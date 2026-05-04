import { supabase } from './supabase';
import { GOOGLE_SCRIPT_URL, FORM_TYPES } from '../config/api';

export async function joinToolWaitlist(email: string, toolKey: string): Promise<{ success: boolean }> {
  try {
    // Try Supabase insert first
    const { error } = await supabase
      .from('tool_waitlist')
      .insert({ email, tool_key: toolKey });

    if (error && !error.message.includes('duplicate')) {
      console.error('Supabase tool_waitlist insert error:', error);
    }

    // Also send to Google Apps Script for backup
    fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        formType: FORM_TYPES.TOOL_WAITLIST,
        email,
        tool_key: toolKey,
        timestamp: new Date().toISOString(),
      }),
    }).catch(() => {});

    return { success: true };
  } catch {
    return { success: true };
  }
}
