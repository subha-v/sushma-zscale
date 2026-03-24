import "https://deno.land/x/xhr@0.1.0/mod.ts";
import Anthropic from "npm:@anthropic-ai/sdk@0.39.0";
import { TOOL_DEFINITIONS, TOOL_EXECUTORS } from "./tools.ts";
import { SYSTEM_PROMPT } from "./system-prompt.ts";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: CORS_HEADERS });
  }

  try {
    const { messages, role } = await req.json();
    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "messages array required" }), {
        status: 400,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      });
    }

    const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "ANTHROPIC_API_KEY not configured" }), {
        status: 500,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      });
    }

    const client = new Anthropic({ apiKey });

    // SSE stream
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        function sendEvent(event: string, data: unknown) {
          controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
        }

        try {
          // Build conversation messages for Anthropic API
          const apiMessages = messages.map((m: { role: string; content: string }) => ({
            role: m.role as "user" | "assistant",
            content: m.content,
          }));

          // Tool use loop: keep calling Claude until it stops using tools
          let loopMessages = [...apiMessages];
          const MAX_TOOL_ROUNDS = 8;

          for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
            const response = await client.messages.create({
              model: "claude-sonnet-4-6",
              max_tokens: 4096,
              system: role
                ? `${SYSTEM_PROMPT}\n\nThe user is logged in as a **${role}** user. Adapt responses to this role.`
                : SYSTEM_PROMPT,
              tools: TOOL_DEFINITIONS,
              messages: loopMessages,
            });

            let hasToolUse = false;
            const toolResults: { type: "tool_result"; tool_use_id: string; content: string }[] = [];

            for (const block of response.content) {
              if (block.type === "text") {
                // Send text in chunks for streaming feel
                const text = block.text;
                const chunkSize = 20;
                for (let i = 0; i < text.length; i += chunkSize) {
                  sendEvent("text_delta", { text: text.slice(i, i + chunkSize) });
                }
              } else if (block.type === "tool_use") {
                hasToolUse = true;
                const toolName = block.name;
                const toolArgs = block.input as Record<string, unknown>;

                sendEvent("tool_start", { tool: toolName, args: toolArgs });

                if (toolName === "generate_visualization") {
                  // Emit chart data directly to frontend as a visualization event
                  sendEvent("visualization", {
                    chart_type: toolArgs.chart_type,
                    title: toolArgs.title,
                    data: toolArgs.data,
                    x_key: toolArgs.x_key,
                    y_key: toolArgs.y_key,
                    x_label: toolArgs.x_label,
                    y_label: toolArgs.y_label,
                    insight: toolArgs.insight,
                  });
                  toolResults.push({
                    type: "tool_result",
                    tool_use_id: block.id,
                    content: JSON.stringify({ displayed: true }),
                  });
                  sendEvent("tool_end", { tool: toolName, success: true });
                } else {
                  try {
                    const executor = TOOL_EXECUTORS[toolName];
                    if (!executor) throw new Error(`Unknown tool: ${toolName}`);
                    const result = await executor(toolArgs);
                    toolResults.push({
                      type: "tool_result",
                      tool_use_id: block.id,
                      content: JSON.stringify(result),
                    });
                    sendEvent("tool_end", { tool: toolName, success: true });
                  } catch (toolErr) {
                    const errMsg = toolErr instanceof Error ? toolErr.message : "Tool execution failed";
                    toolResults.push({
                      type: "tool_result",
                      tool_use_id: block.id,
                      content: JSON.stringify({ error: errMsg }),
                    });
                    sendEvent("tool_end", { tool: toolName, success: false, error: errMsg });
                  }
                }
              }
            }

            // If no tool use, we're done
            if (!hasToolUse) break;

            // Feed tool results back to Claude for next round
            loopMessages = [
              ...loopMessages,
              { role: "assistant" as const, content: response.content },
              { role: "user" as const, content: toolResults },
            ];
          }

          sendEvent("done", {});
        } catch (err) {
          const errMsg = err instanceof Error ? err.message : "Internal error";
          sendEvent("error", { message: errMsg });
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        ...CORS_HEADERS,
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : "Bad request";
    return new Response(JSON.stringify({ error: errMsg }), {
      status: 400,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }
});
