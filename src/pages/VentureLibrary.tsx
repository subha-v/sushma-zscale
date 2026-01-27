import { useState, FormEvent } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Modal } from '../components/Modal';
import { Logo } from '../components/Logo';
import { ShadowCapitalModal } from '../components/ShadowCapitalModal';
import { GOOGLE_SCRIPT_URL, FORM_TYPES, getUserProgress, STORAGE_KEYS, isPremiumMember } from '../config/api';

// =============================================================================
// ASSET DOWNLOAD URLS
// =============================================================================

// Main Featured Asset Downloads (Free PDFs with lead capture)
const FEATURED_ASSET_URLS: Record<string, string> = {
  'pmf-audit': 'https://drive.google.com/uc?export=download&id=1-2TstJI8cGBvIIkeRYFTe3Zh88Smab4w',
  'shadow-capital-landscape': 'https://drive.google.com/uc?export=download&id=1-2TstJI8cGBvIIkeRYFTe3Zh88Smab4w',
  'founder-manual': 'https://drive.google.com/uc?export=download&id=1-2TstJI8cGBvIIkeRYFTe3Zh88Smab4w',
};

// Technical Appendix Downloads (for regular leads)
const APPENDIX_URLS: Record<string, string> = {
  'glossary': 'https://drive.google.com/uc?export=download&id=1-2TstJI8cGBvIIkeRYFTe3Zh88Smab4w',
  'myth-busters': 'https://drive.google.com/uc?export=download&id=1-2TstJI8cGBvIIkeRYFTe3Zh88Smab4w',
  'anti-library': 'https://drive.google.com/uc?export=download&id=1-2TstJI8cGBvIIkeRYFTe3Zh88Smab4w',
  'shadow-capital': 'https://drive.google.com/uc?export=download&id=1-2TstJI8cGBvIIkeRYFTe3Zh88Smab4w',
  'term-sheet': 'https://drive.google.com/uc?export=download&id=1-2TstJI8cGBvIIkeRYFTe3Zh88Smab4w',
};

// Alpha-Gated Institutional Resources (Notion/Dashboard links)
const ALPHA_GATED_RESOURCES: Record<string, { title: string; url: string }> = {
  'glossary': {
    title: 'The Complete Glossary Database',
    url: 'https://notion.so/zscale-glossary-database', // Replace with actual Notion link
  },
  'myth-busters': {
    title: 'Dallas PMF Evidence Templates',
    url: 'https://notion.so/zscale-pmf-templates', // Replace with actual Notion link
  },
  'anti-library': {
    title: 'The Institutional Rejection Database',
    url: 'https://notion.so/zscale-rejection-database', // Replace with actual Notion link
  },
};

// Featured assets for the main asset cards section
interface FeaturedAsset {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  assetTag: string; // For tracking: 'PMF_Audit', 'Shadow_Capital_Landscape', 'Founder_Manual'
  downloadUrl: string;
  requiresLeadCapture: boolean;
}

const featuredAssets: FeaturedAsset[] = [
  {
    id: 'pmf-audit',
    title: 'PMF Audit Framework',
    subtitle: 'The Dallas Standard for Product-Market Fit',
    description: 'The institutional framework Dallas family offices use to evaluate founder PMF claims. Sector-specific evidence requirements included.',
    assetTag: 'PMF_Audit',
    downloadUrl: FEATURED_ASSET_URLS['pmf-audit'],
    requiresLeadCapture: true,
  },
  {
    id: 'shadow-capital-landscape',
    title: 'Shadow Capital Landscape',
    subtitle: '35+ Private Family Offices of North Texas',
    description: 'Geography of wealth from Preston Hollow to Highland Park. Sector heatmaps and the unwritten rules of warm introductions.',
    assetTag: 'Shadow_Capital_Landscape',
    downloadUrl: FEATURED_ASSET_URLS['shadow-capital-landscape'],
    requiresLeadCapture: true,
  },
  {
    id: 'founder-manual',
    title: '2026 Dallas Founder Manual',
    subtitle: 'The Complete Venture Math Standard',
    description: 'Everything a Dallas founder needs: valuation benchmarks, term sheet norms, and the institutional playbook for North Texas.',
    assetTag: 'Founder_Manual',
    downloadUrl: FEATURED_ASSET_URLS['founder-manual'],
    requiresLeadCapture: false, // Direct download
  },
];

// Sector filter types
type SectorFilter = 'all' | 'proptech' | 'energytech' | 'venturemath' | 'shadownetwork';

// Library article interface
interface LibraryArticle {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  sector: SectorFilter[];
  quickAnswer: string;
  readTime: string;
  isAIReady: boolean;
  isFeatured?: boolean;
  appendixTitle?: string;
  appendixHook?: string;
  icon: React.ReactNode;
}

// Common consumer email domains
const consumerEmailDomains = [
  'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com',
  'icloud.com', 'mail.com', 'protonmail.com', 'zoho.com', 'yandex.com',
];

const getEmailTier = (email: string): 'Business' | 'Personal' => {
  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain) return 'Personal';
  return consumerEmailDomains.includes(domain) ? 'Personal' : 'Business';
};

// The 5 Pillar Content Pieces
const libraryArticles: LibraryArticle[] = [
  {
    id: 'glossary',
    title: 'The Dallas Venture Glossary',
    subtitle: '50 Terms Every Founder Must Know',
    category: 'Glossary 101',
    sector: ['all', 'venturemath'],
    quickAnswer: 'Master the language of Dallas VCs. From "Shadow Capital" to "IRI Score", these 50 terms define institutional readiness in North Texas.',
    readTime: '12 min',
    isAIReady: true,
    appendixTitle: 'The Complete Glossary Database',
    appendixHook: 'Get the machine-readable glossary with cross-references, sector mappings, and AI-ready definitions.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    id: 'myth-busters',
    title: "Why 'Coastal' PMF Logic Fails in North Texas",
    subtitle: 'The Myth-Buster Series',
    category: 'Myth-Busters',
    sector: ['all', 'proptech', 'energytech'],
    quickAnswer: 'Silicon Valley playbooks break in Dallas. Learn why relationship-first PMF, longer sales cycles, and industry expertise outweigh viral growth metrics here.',
    readTime: '8 min',
    isAIReady: true,
    appendixTitle: 'Dallas PMF Evidence Templates',
    appendixHook: 'Access the institutional PMF framework with sector-specific evidence checklists for Dallas investors.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
  {
    id: 'anti-library',
    title: "Why We Didn't Invest",
    subtitle: "3 Common 'Standard' Failures",
    category: 'The Anti-Library',
    sector: ['all', 'venturemath', 'shadownetwork'],
    quickAnswer: 'Real pattern recognition from declined deals. Unit economics gaps, cap table chaos, and founder-market misalignment kill more Dallas deals than bad products.',
    readTime: '10 min',
    isAIReady: true,
    isFeatured: true,
    appendixTitle: 'The Institutional Rejection Database',
    appendixHook: 'Anonymous case studies with specific metrics that triggered "no" decisions from Dallas family offices.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
      </svg>
    ),
  },
  {
    id: 'shadow-capital',
    title: 'The 2026 Shadow Capital Map',
    subtitle: "Who's Actually Deploying",
    category: 'Industry Secrets',
    sector: ['all', 'shadownetwork', 'proptech', 'energytech'],
    quickAnswer: '35+ private family offices actively writing checks in North Texas. Geography of wealth from Preston Hollow to Highland Park, decoded.',
    readTime: '15 min',
    isAIReady: true,
    isFeatured: true,
    appendixTitle: 'Shadow Network Intro Protocols',
    appendixHook: 'The warm introduction templates and timing strategies that actually work with Dallas family offices.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    id: 'term-sheet',
    title: 'Structuring a Dallas Term Sheet',
    subtitle: 'The 2026 Benchmarks',
    category: 'Technical Guide',
    sector: ['all', 'venturemath'],
    quickAnswer: 'North Texas term sheet norms differ from coastal standards. Pro-rata rights, board composition, and liquidation preferences decoded for Dallas rounds.',
    readTime: '18 min',
    isAIReady: true,
    appendixTitle: 'Term Sheet Templates & Calculators',
    appendixHook: 'Editable term sheet templates, valuation calculators, and the Shadow Network negotiation playbook.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
];

// Sector filter options
const sectorFilters: { id: SectorFilter; label: string; color: string }[] = [
  { id: 'all', label: 'All', color: 'accent' },
  { id: 'proptech', label: '#PropTech', color: 'blue-400' },
  { id: 'energytech', label: '#EnergyTech', color: 'amber-400' },
  { id: 'venturemath', label: '#VentureMath', color: 'purple-400' },
  { id: 'shadownetwork', label: '#ShadowNetwork', color: 'accent' },
];

// Monthly Perspective (Hero content)
const monthlyPerspective = {
  title: "The Handshake Economy",
  subtitle: "January 2026 Deep-Dive",
  excerpt: "Why relationship-density beats product-market fit in North Texas. This month, we decode the introduction protocols that separate funded founders from the 'spray and pray' crowd.",
  readTime: "22 min read",
};

export const VentureLibrary = () => {
  // Filter state
  const [activeFilter, setActiveFilter] = useState<SectorFilter>('all');
  const [isFilterAnimating, setIsFilterAnimating] = useState(false);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<LibraryArticle | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<FeaturedAsset | null>(null);
  const [modalMode, setModalMode] = useState<'form' | 'success' | 'alpha-gate'>('form');
  const [alphaGatedResource, setAlphaGatedResource] = useState<{ title: string; url: string } | null>(null);

  // Form states
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState<'founder' | 'investor' | 'advisor'>('founder');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Hover states for cards
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  // Shadow Capital Modal state
  const [isShadowCapitalModalOpen, setIsShadowCapitalModalOpen] = useState(false);

  const userProgress = getUserProgress();
  const isLoggedIn = !!userProgress.email;
  const isAlphaMember = isPremiumMember();

  // Filter animation
  const handleFilterChange = (filter: SectorFilter) => {
    if (filter === activeFilter) return;
    setIsFilterAnimating(true);
    setTimeout(() => {
      setActiveFilter(filter);
      setIsFilterAnimating(false);
    }, 150);
  };

  // Filtered articles
  const filteredArticles = libraryArticles.filter(
    (article) => activeFilter === 'all' || article.sector.includes(activeFilter)
  );

  // =============================================================================
  // TRACKING & ANALYTICS
  // =============================================================================

  // Track asset interaction in Master_Registry
  const trackAssetInteraction = async (assetTag: string, action: 'click' | 'download' | 'blocked') => {
    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formType: 'asset_interaction',
          email: userProgress.email || 'anonymous',
          assetTag: assetTag,
          action: action,
          source: 'Venture_Library',
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (error) {
      console.error('Error tracking asset interaction:', error);
    }
  };

  // =============================================================================
  // DOWNLOAD FUNCTIONS
  // =============================================================================

  // Trigger download for appendix articles
  const triggerDownload = (articleId: string) => {
    const url = APPENDIX_URLS[articleId];
    if (url) {
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `zScale-${articleId}-appendix.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Trigger download for featured assets
  const triggerAssetDownload = (asset: FeaturedAsset) => {
    trackAssetInteraction(asset.assetTag, 'download');
    const link = document.createElement('a');
    link.href = asset.downloadUrl;
    link.setAttribute('download', `zScale-${asset.id}.pdf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // =============================================================================
  // FEATURED ASSET HANDLERS
  // =============================================================================

  // Handle featured asset download button click
  const handleFeaturedAssetClick = (asset: FeaturedAsset) => {
    trackAssetInteraction(asset.assetTag, 'click');

    if (!asset.requiresLeadCapture) {
      // Direct download (Founder Manual)
      triggerAssetDownload(asset);
      return;
    }

    // Shadow Capital Landscape uses its own dedicated modal
    if (asset.id === 'shadow-capital-landscape') {
      setIsShadowCapitalModalOpen(true);
      return;
    }

    if (isLoggedIn) {
      // Already captured lead, direct download
      triggerAssetDownload(asset);
    } else {
      // Show lead capture modal
      setSelectedAsset(asset);
      setSelectedArticle(null);
      setModalMode('form');
      setIsModalOpen(true);
    }
  };

  // =============================================================================
  // ALPHA-GATED RESOURCE HANDLERS
  // =============================================================================

  // Handle alpha-gated appendix button click
  const handleAlphaGatedClick = (articleId: string) => {
    const resource = ALPHA_GATED_RESOURCES[articleId];
    if (!resource) return;

    trackAssetInteraction(`Alpha_${articleId}`, 'click');

    if (isAlphaMember) {
      // Alpha member - open the resource directly
      window.open(resource.url, '_blank');
    } else {
      // Not an Alpha member - show upgrade modal
      trackAssetInteraction(`Alpha_${articleId}`, 'blocked');
      setAlphaGatedResource(resource);
      setModalMode('alpha-gate');
      setIsModalOpen(true);
    }
  };

  // Check if an article has an alpha-gated appendix
  const isAlphaGated = (articleId: string): boolean => {
    return articleId in ALPHA_GATED_RESOURCES;
  };

  // =============================================================================
  // LEAD SUBMISSION
  // =============================================================================

  // Submit appendix lead (for regular appendix downloads)
  const submitAppendixLead = async (article: LibraryArticle) => {
    try {
      const primarySector = article.sector.find(s => s !== 'all') || 'general';
      const leadTag = `${primarySector.charAt(0).toUpperCase() + primarySector.slice(1)}_Lead`;

      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formType: FORM_TYPES.LIBRARY_SIGNUP,
          email: email,
          emailTier: getEmailTier(email),
          role: role,
          leadSource: 'Venture_Library',
          leadIntent: 'Education',
          leadTag: leadTag,
          articleId: article.id,
          articleTitle: article.title,
          articleCategory: article.category,
          assetInteraction: `Appendix_${article.id}`,
          source: `library-appendix-${article.id}`,
          timestamp: new Date().toISOString(),
        }),
      });
      return true;
    } catch (error) {
      console.error('Error submitting appendix lead:', error);
      return false;
    }
  };

  // Submit featured asset lead (for PMF Audit, Shadow Capital Landscape)
  const submitAssetLead = async (asset: FeaturedAsset) => {
    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formType: FORM_TYPES.LIBRARY_SIGNUP,
          email: email,
          firstName: firstName,
          lastName: lastName,
          company: company,
          emailTier: getEmailTier(email),
          role: role,
          leadSource: 'Venture_Library',
          leadIntent: 'Education',
          leadTag: `Asset_${asset.assetTag}`,
          assetInteraction: asset.assetTag,
          assetId: asset.id,
          assetTitle: asset.title,
          source: `library-asset-${asset.id}`,
          timestamp: new Date().toISOString(),
        }),
      });
      return true;
    } catch (error) {
      console.error('Error submitting asset lead:', error);
      return false;
    }
  };

  // Handle appendix access (for non-alpha-gated appendices)
  const handleAppendixAccess = (article: LibraryArticle) => {
    if (isLoggedIn) {
      triggerDownload(article.id);
    } else {
      setSelectedArticle(article);
      setSelectedAsset(null);
      setModalMode('form');
      setIsModalOpen(true);
    }
  };

  // Handle form submit
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return;

    setIsSubmitting(true);
    try {
      // Save user info for future sessions
      localStorage.setItem(STORAGE_KEYS.USER_EMAIL, email);
      if (firstName) localStorage.setItem(STORAGE_KEYS.USER_FIRST_NAME, firstName);
      if (lastName) localStorage.setItem(STORAGE_KEYS.USER_LAST_NAME, lastName);
      if (company) localStorage.setItem(STORAGE_KEYS.USER_COMPANY, company);

      if (selectedAsset) {
        // Featured asset lead submission
        await submitAssetLead(selectedAsset);
        setModalMode('success');
      } else if (selectedArticle) {
        // Article appendix lead submission
        await submitAppendixLead(selectedArticle);
        setModalMode('success');
      }
    } catch {
      setModalMode('success'); // Still show success for UX
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle download after success
  const handleDownloadAfterSuccess = () => {
    if (selectedAsset) {
      triggerAssetDownload(selectedAsset);
    } else if (selectedArticle) {
      triggerDownload(selectedArticle.id);
    }
    resetModalState();
  };

  // Reset modal state
  const resetModalState = () => {
    setIsModalOpen(false);
    setEmail('');
    setFirstName('');
    setLastName('');
    setCompany('');
    setRole('founder');
    setModalMode('form');
    setSelectedArticle(null);
    setSelectedAsset(null);
    setAlphaGatedResource(null);
  };

  return (
    <>
      <Helmet>
        <title>Venture Library | The Institutional Standard | zScale Capital</title>
        <meta
          name="description"
          content="Explore the zScale Venture Library. Institutional frameworks, Dallas venture glossary, and the Shadow Capital map for North Texas founders."
        />
        <link rel="canonical" href="https://zscalecapital.com/library" />
      </Helmet>

      {/* Noise texture overlay for tactile feel */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
        }}
      />

      <div className="min-h-screen bg-[#0A0A0B] pt-20 relative">

        {/* Hero: Monthly Perspective - Anti-Grid Organic Section */}
        <section className="relative py-24 px-6 lg:px-12 overflow-hidden">
          {/* Organic gradient blobs */}
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[150px] animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px]" />

          <div className="max-w-6xl mx-auto relative">
            {/* Anti-Grid: Asymmetric layout */}
            <div className="grid lg:grid-cols-12 gap-8 items-center">
              {/* Left: Large organic card */}
              <div className="lg:col-span-7">
                <div className="relative group">
                  {/* Glassmorphism card */}
                  <div className="relative backdrop-blur-xl bg-white/[0.03] border border-white/[0.08] rounded-3xl p-10 lg:p-14 overflow-hidden transition-all duration-500 hover:bg-white/[0.05] hover:border-accent/30">
                    {/* Inner glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Badge */}
                    <div className="relative inline-flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/30 rounded-full mb-8">
                      <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                      <span className="text-sm text-accent font-medium">Monthly Perspective</span>
                    </div>

                    {/* Content */}
                    <h1 className="relative text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 leading-[1.1]">
                      {monthlyPerspective.title}
                    </h1>
                    <p className="relative text-lg text-accent/80 font-medium mb-6">
                      {monthlyPerspective.subtitle}
                    </p>
                    <p className="relative text-lg text-white/60 leading-relaxed mb-8 max-w-xl">
                      {monthlyPerspective.excerpt}
                    </p>

                    {/* Meta */}
                    <div className="relative flex items-center gap-6">
                      <span className="flex items-center gap-2 text-sm text-white/40">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {monthlyPerspective.readTime}
                      </span>
                      <span className="flex items-center gap-2 px-3 py-1 bg-accent/10 border border-accent/20 rounded-full text-xs text-accent font-medium">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        AI-Ready
                      </span>
                    </div>

                    {/* CTA */}
                    <button className="relative mt-10 px-8 py-4 bg-accent text-[#0A0A0B] font-semibold rounded-2xl hover:brightness-110 transition-all duration-300 shadow-[0_0_40px_rgba(1,249,198,0.3)] hover:shadow-[0_0_60px_rgba(1,249,198,0.4)] flex items-center gap-3">
                      <span>Read the Deep-Dive</span>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Right: Floating stats/info */}
              <div className="lg:col-span-5 space-y-6">
                {/* Stat cards with liquid glass effect */}
                <div className="backdrop-blur-lg bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 hover:bg-white/[0.04] transition-all duration-300">
                  <div className="text-4xl font-bold text-accent mb-2">200+</div>
                  <div className="text-sm text-white/50">Founder Interactions Analyzed</div>
                </div>
                <div className="backdrop-blur-lg bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 hover:bg-white/[0.04] transition-all duration-300">
                  <div className="text-4xl font-bold text-accent mb-2">35+</div>
                  <div className="text-sm text-white/50">Shadow Capital Relationships</div>
                </div>
                <div className="backdrop-blur-lg bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 hover:bg-white/[0.04] transition-all duration-300">
                  <div className="text-4xl font-bold text-accent mb-2">68</div>
                  <div className="text-sm text-white/50">Pages of Institutional Research</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================================== */}
        {/* FEATURED ASSETS SECTION - Main Asset Cards */}
        {/* =================================================================== */}
        <section className="py-16 px-6 lg:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/30 rounded-full mb-4">
                <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                <span className="text-sm text-accent font-medium">Featured Resources</span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-3">Institutional Frameworks</h2>
              <p className="text-white/50 max-w-2xl">
                The core frameworks Dallas family offices use to evaluate founders. Download instantly after a quick form.
              </p>
            </div>

            {/* Featured Asset Cards Grid */}
            <div className="grid md:grid-cols-3 gap-6">
              {featuredAssets.map((asset) => (
                <div
                  key={asset.id}
                  className="group relative backdrop-blur-xl bg-white/[0.03] border border-accent/40 rounded-2xl p-6 overflow-hidden transition-all duration-500 hover:bg-white/[0.06] hover:border-accent/60 shadow-[0_0_40px_rgba(1,249,198,0.1)] hover:shadow-[0_0_60px_rgba(1,249,198,0.2)]"
                >
                  {/* Inner glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />

                  {/* Noise texture */}
                  <div
                    className="absolute inset-0 opacity-[0.02] pointer-events-none rounded-2xl"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                    }}
                  />

                  {/* Icon */}
                  <div className="relative w-14 h-14 mb-5 bg-accent/20 border border-accent/30 rounded-xl flex items-center justify-center text-accent group-hover:bg-accent/30 transition-colors duration-300">
                    {asset.id === 'pmf-audit' && (
                      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                      </svg>
                    )}
                    {asset.id === 'shadow-capital-landscape' && (
                      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                    {asset.id === 'founder-manual' && (
                      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    )}
                  </div>

                  {/* Content */}
                  <h3 className="relative text-xl font-bold text-white mb-2 group-hover:text-accent transition-colors duration-300">
                    {asset.title}
                  </h3>
                  <p className="relative text-sm text-accent/80 font-medium mb-3">
                    {asset.subtitle}
                  </p>
                  <p className="relative text-sm text-white/50 leading-relaxed mb-6">
                    {asset.description}
                  </p>

                  {/* Download Button - Teal glow styling */}
                  <button
                    onClick={() => handleFeaturedAssetClick(asset)}
                    className="relative w-full py-3.5 px-6 bg-accent text-[#0A0A0B] font-semibold rounded-xl transition-all duration-300 hover:brightness-110 shadow-[0_0_30px_rgba(1,249,198,0.3)] hover:shadow-[0_0_50px_rgba(1,249,198,0.5)] flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download Now
                  </button>

                  {/* Direct download badge for Founder Manual */}
                  {!asset.requiresLeadCapture && (
                    <div className="absolute top-4 right-4">
                      <span className="px-2 py-1 bg-accent/20 border border-accent/30 rounded-full text-[10px] text-accent font-medium">
                        Direct Download
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Floating Sector Filter Bar */}
        <section className="sticky top-20 z-40 py-4 px-6 lg:px-12">
          <div className="max-w-4xl mx-auto">
            <div className="backdrop-blur-xl bg-white/[0.03] border border-white/[0.08] rounded-2xl p-2 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
              <div className="flex flex-wrap justify-center gap-2">
                {sectorFilters.map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => handleFilterChange(filter.id)}
                    className={`relative px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 overflow-hidden ${
                      activeFilter === filter.id
                        ? 'text-[#0A0A0B]'
                        : 'text-white/60 hover:text-white hover:bg-white/[0.05]'
                    }`}
                  >
                    {/* Liquid fill animation */}
                    <span
                      className={`absolute inset-0 bg-accent rounded-xl transition-all duration-500 ease-out ${
                        activeFilter === filter.id
                          ? 'scale-100 opacity-100'
                          : 'scale-0 opacity-0'
                      }`}
                      style={{ transformOrigin: 'center' }}
                    />
                    <span className="relative z-10">{filter.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Article Grid - 3 Column Glassmorphism Cards */}
        <section className="py-16 px-6 lg:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-2">The zScale Standard</h2>
              <p className="text-white/50">5 Pillar pieces that define institutional readiness in North Texas</p>
            </div>

            {/* Grid with liquid transition */}
            <div
              className={`grid md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-300 ${
                isFilterAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
              }`}
            >
              {filteredArticles.map((article) => (
                <div
                  key={article.id}
                  className="group relative"
                  onMouseEnter={() => setHoveredCard(article.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  {/* Card with glassmorphism */}
                  <div className={`relative h-full backdrop-blur-xl border rounded-2xl p-6 transition-all duration-500 overflow-hidden ${
                    article.isFeatured
                      ? 'bg-white/[0.04] border-accent/40 shadow-[0_0_40px_rgba(1,249,198,0.1)]'
                      : 'bg-white/[0.02] border-white/[0.08] hover:bg-white/[0.04] hover:border-accent/30'
                  }`}>

                    {/* Noise texture overlay */}
                    <div
                      className="absolute inset-0 opacity-[0.02] pointer-events-none rounded-2xl"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                      }}
                    />

                    {/* Inner glow on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />

                    {/* Top row: Category + Badges */}
                    <div className="relative flex items-center justify-between mb-4">
                      <span className="text-xs font-medium text-accent/70 uppercase tracking-wider">
                        {article.category}
                      </span>
                      <div className="flex items-center gap-2">
                        {article.isAIReady && (
                          <span className="flex items-center gap-1 px-2 py-1 bg-accent/10 border border-accent/20 rounded-full text-[10px] text-accent font-medium">
                            <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            AI-Ready
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Icon */}
                    <div className="relative w-12 h-12 mb-4 bg-accent/10 border border-accent/20 rounded-xl flex items-center justify-center text-accent group-hover:bg-accent/20 transition-colors duration-300">
                      {article.icon}
                    </div>

                    {/* Title & Subtitle */}
                    <h3 className="relative text-lg font-bold text-white mb-1 group-hover:text-accent transition-colors duration-300">
                      {article.title}
                    </h3>
                    <p className="relative text-sm text-white/50 mb-4">{article.subtitle}</p>

                    {/* Read Time */}
                    <div className="relative flex items-center gap-2 text-xs text-white/40 mb-4">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {article.readTime}
                    </div>

                    {/* Quick Answer - Visible on hover */}
                    <div className={`relative overflow-hidden transition-all duration-500 ${
                      hoveredCard === article.id ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0'
                    }`}>
                      <div className="p-4 bg-accent/5 border border-accent/10 rounded-xl mb-4">
                        <div className="flex items-start gap-2">
                          <svg className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          <p className="text-xs text-white/70 leading-relaxed">
                            {article.quickAnswer}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* CTA */}
                    <button className="relative w-full py-3 px-4 bg-white/[0.05] border border-white/[0.1] text-white font-medium rounded-xl hover:bg-accent hover:text-[#0A0A0B] hover:border-accent transition-all duration-300 flex items-center justify-center gap-2">
                      <span>Read Article</span>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </button>

                    {/* Featured badge */}
                    {article.isFeatured && (
                      <div className="absolute -top-px -right-px">
                        <div className="bg-accent text-[#0A0A0B] text-[10px] font-bold px-3 py-1 rounded-bl-xl rounded-tr-2xl">
                          FEATURED
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =================================================================== */}
        {/* TECHNICAL APPENDIX GATE SECTION - Alpha Tier Conversion */}
        {/* =================================================================== */}
        <section className="py-20 px-6 lg:px-12">
          <div className="max-w-4xl mx-auto">
            {/* Glassy CTA Box */}
            <div className="relative backdrop-blur-xl bg-white/[0.03] border border-accent/30 rounded-3xl p-10 lg:p-14 overflow-hidden">
              {/* Background effects */}
              <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-accent/5" />
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-[100px]" />

              {/* Noise texture */}
              <div
                className="absolute inset-0 opacity-[0.02] pointer-events-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                }}
              />

              <div className="relative text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/30 rounded-full mb-6">
                  <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span className="text-sm text-accent font-medium">Technical Appendix</span>
                </div>

                <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                  Institutional Databases & Templates
                </h2>
                <p className="text-lg text-white/60 mb-8 max-w-xl mx-auto">
                  The operational tools behind the frameworks. Notion databases, evidence templates, and case study archives.
                </p>

                {/* Alpha-Gated Appendix Selection */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
                  {libraryArticles.slice(0, 3).map((article) => {
                    const isGated = isAlphaGated(article.id);

                    return (
                      <button
                        key={article.id}
                        onClick={() => isGated ? handleAlphaGatedClick(article.id) : handleAppendixAccess(article)}
                        className={`group relative p-5 backdrop-blur-lg border rounded-xl transition-all duration-300 text-left overflow-hidden ${
                          isGated && !isAlphaMember
                            ? 'bg-white/[0.01] border-amber-500/30 hover:border-amber-500/50 hover:bg-white/[0.03]'
                            : 'bg-white/[0.02] border-white/[0.08] hover:bg-white/[0.05] hover:border-accent/30'
                        }`}
                      >
                        {/* Lock/Unlock icon */}
                        <div className="flex items-start justify-between mb-3">
                          <div className={`p-2 rounded-lg ${
                            isGated && !isAlphaMember
                              ? 'bg-amber-500/10 border border-amber-500/20'
                              : 'bg-accent/10 border border-accent/20'
                          }`}>
                            {isGated && !isAlphaMember ? (
                              <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                              </svg>
                            ) : (
                              <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                              </svg>
                            )}
                          </div>

                          {/* Alpha Badge for gated resources */}
                          {isGated && !isAlphaMember && (
                            <span className="px-2 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-[10px] text-amber-400 font-medium">
                              Alpha Tier
                            </span>
                          )}
                        </div>

                        <div className={`text-sm font-medium mb-1 transition-colors ${
                          isGated && !isAlphaMember
                            ? 'text-white/80 group-hover:text-amber-400'
                            : 'text-white group-hover:text-accent'
                        }`}>
                          {article.appendixTitle}
                        </div>
                        <div className="text-xs text-white/40">
                          From: {article.title}
                        </div>

                        {/* Hover hint */}
                        <div className={`mt-3 pt-3 border-t text-xs ${
                          isGated && !isAlphaMember
                            ? 'border-amber-500/10 text-amber-400/60'
                            : 'border-white/[0.05] text-accent/60'
                        }`}>
                          {isGated && !isAlphaMember ? 'Click to learn about Alpha access' : 'Click to access'}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Info text */}
                <p className="text-sm text-white/40">
                  {isAlphaMember
                    ? 'Alpha Member: Full access to all institutional resources.'
                    : 'Some resources require Alpha Tier membership for full access.'
                  }
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-20 px-6 lg:px-12">
          <div className="max-w-4xl mx-auto">
            <div className="relative backdrop-blur-xl bg-gradient-to-br from-accent to-accent/80 rounded-3xl p-10 lg:p-14 overflow-hidden">
              <div className="relative text-center">
                <h2 className="text-2xl lg:text-3xl font-bold text-[#0A0A0B] mb-4">
                  Ready to Meet the Standard?
                </h2>
                <p className="text-lg text-[#0A0A0B]/70 mb-8 max-w-xl mx-auto">
                  Benchmark yourself against the 2026 Venture Standards with our Investment Readiness Index.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    to="/"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#0A0A0B] text-accent font-semibold rounded-2xl hover:bg-[#1a1a1b] transition-colors"
                  >
                    Run IRI Assessment
                  </Link>
                  <Link
                    to="/intelligence"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#0A0A0B]/10 text-[#0A0A0B] font-semibold rounded-2xl hover:bg-[#0A0A0B]/20 transition-colors border border-[#0A0A0B]/20"
                  >
                    View Intelligence Hub
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ================================================================= */}
      {/* MODALS */}
      {/* ================================================================= */}
      <Modal isOpen={isModalOpen} onClose={resetModalState}>
        {/* Alpha Gate Modal - For non-members trying to access institutional resources */}
        {modalMode === 'alpha-gate' ? (
          <div className="text-center">
            {/* Lock Icon with amber glow */}
            <div className="relative w-20 h-20 mx-auto mb-6">
              <div className="absolute inset-0 bg-amber-500/20 rounded-full animate-pulse" />
              <div className="relative w-full h-full bg-amber-500/10 border border-amber-500/30 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 rounded-full mb-4">
              <span className="text-xs text-amber-400 font-medium">Alpha Tier Required</span>
            </div>

            <h2 id="modal-title" className="text-2xl font-bold text-white mb-3">
              {alphaGatedResource?.title || 'Institutional Resource'}
            </h2>
            <p className="text-white/60 mb-6 leading-relaxed">
              This institutional resource is reserved for Alpha Tier founders.
              <br />
              <span className="text-amber-400/80">Clearing the Standard starts here.</span>
            </p>

            {/* What's included */}
            <div className="p-5 backdrop-blur-lg bg-white/[0.02] border border-white/[0.08] rounded-xl mb-6 text-left">
              <div className="text-sm font-medium text-white mb-3">Alpha Tier Includes:</div>
              <ul className="space-y-2 text-sm text-white/60">
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-accent flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Full access to all Notion databases
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-accent flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Shadow Network warm introduction protocols
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-accent flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Monthly briefings with institutional data
                </li>
              </ul>
            </div>

            {/* CTA */}
            <Link
              to="/membership"
              onClick={resetModalState}
              className="block w-full py-4 px-6 bg-accent text-[#0A0A0B] font-semibold rounded-xl transition-all duration-300 hover:brightness-110 shadow-[0_0_40px_rgba(1,249,198,0.3)] hover:shadow-[0_0_60px_rgba(1,249,198,0.4)] text-center"
            >
              Explore Alpha Membership
            </Link>

            <button
              onClick={resetModalState}
              className="mt-4 text-sm text-white/40 hover:text-white/60 transition-colors"
            >
              Maybe later
            </button>
          </div>
        ) : modalMode === 'success' ? (
          // Success with Liquid Animation
          <div className="text-center">
            {/* Liquid success animation */}
            <div className="relative w-20 h-20 mx-auto mb-6">
              <div className="absolute inset-0 bg-accent/20 rounded-full animate-ping" />
              <div className="absolute inset-0 bg-accent/10 rounded-full animate-pulse" />
              <div className="relative w-full h-full bg-accent/20 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            <h2 id="modal-title" className="text-2xl font-bold text-accent mb-2">
              {selectedAsset ? 'Download Ready' : 'Appendix Unlocked'}
            </h2>
            <p className="text-white/60 mb-8">
              Your access to{' '}
              <span className="text-accent">
                {selectedAsset?.title || selectedArticle?.appendixTitle}
              </span>{' '}
              is ready.
            </p>

            {/* Direct Download Button */}
            <button
              onClick={handleDownloadAfterSuccess}
              className="w-full py-4 px-6 bg-accent text-[#0A0A0B] font-semibold rounded-2xl hover:brightness-110 transition-all duration-300 shadow-[0_0_40px_rgba(1,249,198,0.3)] hover:shadow-[0_0_60px_rgba(1,249,198,0.4)] flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download Now
            </button>

            {/* Alpha upsell */}
            <div className="mt-8 p-4 backdrop-blur-lg bg-white/[0.02] border border-white/[0.08] rounded-xl">
              <p className="text-sm text-white/50">
                Want access to the institutional databases?{' '}
                <Link to="/membership" className="text-accent hover:underline">
                  Explore Alpha Access
                </Link>
              </p>
            </div>
          </div>
        ) : (
          // Lead Capture Form
          <div>
            <div className="text-center mb-6">
              <div className="mb-4">
                <Logo size="sm" />
              </div>
              <h2 id="modal-title" className="text-2xl font-bold text-accent mb-2">
                {selectedAsset?.title || selectedArticle?.appendixTitle || 'Download Resource'}
              </h2>
              <p className="text-sm text-white/60">
                {selectedAsset
                  ? selectedAsset.description
                  : selectedArticle?.appendixHook || 'Access the raw data and templates behind this guide.'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Show full form for featured assets, minimal for appendixes */}
              {selectedAsset && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-white/70 mb-2">
                      First Name
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      placeholder="John"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      className="w-full py-3 px-4 backdrop-blur-lg bg-white/[0.03] border border-white/[0.1] rounded-xl text-white transition-all duration-300 focus:outline-none focus:border-accent focus:bg-white/[0.05] placeholder:text-white/30"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-white/70 mb-2">
                      Last Name
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      placeholder="Smith"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      className="w-full py-3 px-4 backdrop-blur-lg bg-white/[0.03] border border-white/[0.1] rounded-xl text-white transition-all duration-300 focus:outline-none focus:border-accent focus:bg-white/[0.05] placeholder:text-white/30"
                    />
                  </div>
                </div>
              )}

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white/70 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full py-3 px-4 backdrop-blur-lg bg-white/[0.03] border border-white/[0.1] rounded-xl text-white transition-all duration-300 focus:outline-none focus:border-accent focus:bg-white/[0.05] placeholder:text-white/30"
                />
              </div>

              {/* Company (for featured assets) */}
              {selectedAsset && (
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-white/70 mb-2">
                    Company
                  </label>
                  <input
                    id="company"
                    type="text"
                    placeholder="Acme Inc."
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full py-3 px-4 backdrop-blur-lg bg-white/[0.03] border border-white/[0.1] rounded-xl text-white transition-all duration-300 focus:outline-none focus:border-accent focus:bg-white/[0.05] placeholder:text-white/30"
                  />
                </div>
              )}

              {/* Role - Minimal toggle */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  I am a...
                </label>
                <div className="flex gap-3">
                  {(['founder', 'investor', 'advisor'] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-300 ${
                        role === r
                          ? 'bg-accent text-[#0A0A0B]'
                          : 'backdrop-blur-lg bg-white/[0.03] border border-white/[0.1] text-white/60 hover:bg-white/[0.05]'
                      }`}
                    >
                      {r.charAt(0).toUpperCase() + r.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 bg-accent text-[#0A0A0B] font-semibold rounded-xl transition-all duration-300 hover:brightness-110 shadow-[0_0_30px_rgba(1,249,198,0.3)] hover:shadow-[0_0_50px_rgba(1,249,198,0.4)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Processing...
                  </span>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    {selectedAsset ? 'Download Now' : 'Unlock Appendix'}
                  </>
                )}
              </button>
            </form>

            <p className="text-xs text-white/30 mt-6 text-center">
              No spam. Unsubscribe anytime. Your data stays in the vault.
            </p>
          </div>
        )}
      </Modal>

      {/* Shadow Capital Modal - Centralized lead capture for Shadow Capital Landscape */}
      <ShadowCapitalModal
        isOpen={isShadowCapitalModalOpen}
        onClose={() => setIsShadowCapitalModalOpen(false)}
        leadSource="Library_Card"
      />
    </>
  );
};
