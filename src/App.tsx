import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useScrollReveal } from './hooks/useScrollReveal';
import { ScrollToTop } from './components/ScrollToTop';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { EcosystemMap } from './pages/EcosystemMap';
import { IntelligenceHub } from './pages/IntelligenceHub';
import { VentureLibrary } from './pages/VentureLibrary';
import { InvestorTierList } from './pages/tools/InvestorTierList';
import { EquityCalculator } from './pages/tools/EquityCalculator';
import { AcceleratorChecklist } from './pages/tools/AcceleratorChecklist';
import { ValuationTool } from './pages/tools/ValuationTool';
import { Membership } from './pages/Membership';
import { Team } from './pages/Team';
import { Studio } from './pages/Studio';
import { Apply } from './pages/Apply';

// Inner component that uses hooks requiring Router context
function AppContent() {
  useScrollReveal();

  return (
    <>
      <ScrollToTop />
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/ecosystem-map" element={<EcosystemMap />} />
          <Route path="/intelligence" element={<IntelligenceHub />} />
          <Route path="/library" element={<VentureLibrary />} />
          <Route path="/tools/investor-tier-list" element={<InvestorTierList />} />
          <Route path="/tools/equity-calculator" element={<EquityCalculator />} />
          <Route path="/tools/accelerator-checklist" element={<AcceleratorChecklist />} />
          <Route path="/tools/valuation" element={<ValuationTool />} />
          <Route path="/membership" element={<Membership />} />
          <Route path="/team" element={<Team />} />
          <Route path="/studio" element={<Studio />} />
          <Route path="/apply" element={<Apply />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
