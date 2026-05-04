import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ScrollToTop } from './components/ScrollToTop';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { SolutionsPage } from './pages/SolutionsPage';
import { PreviewPage } from './pages/PreviewPage';
import { AboutPage } from './pages/AboutPage';
import { DemoPage } from './pages/DemoPage';
import LoginPage from './pages/LoginPage';
import DemoLogin from './pages/dashboards/DemoLogin';
import CollegeDashboard from './pages/dashboards/college/CollegeDashboard';
import EDCDashboard from './pages/dashboards/edc/EDCDashboard';
import StudentDashboard from './pages/dashboards/student/StudentDashboard';
import TWCDashboard from './pages/dashboards/twc/TWCDashboard';
import AgentChat from './pages/AgentChat';
import AdminDashboard from './pages/dashboards/admin/AdminDashboard';
import IntelligenceArchivePage from './pages/IntelligenceArchivePage';
import IntelligenceIssuePage from './pages/IntelligenceIssuePage';
import TrackerPage from './pages/TrackerPage';
import TrackerEntryPage from './pages/TrackerEntryPage';
import ToolPlaceholderPage from './pages/ToolPlaceholderPage';

function AppContent() {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard') || location.pathname === '/demo-login' || location.pathname === '/login' || location.pathname === '/agent';

  return (
    <>
      <ScrollToTop />
      {!isDashboard && <Header />}
      <main>
        <Routes>
          {/* Market Intelligence Pages */}
          <Route path="/" element={<HomePage />} />
          <Route path="/solutions" element={<SolutionsPage />} />
          <Route path="/preview" element={<PreviewPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/intelligence" element={<IntelligenceArchivePage />} />
          <Route path="/intelligence/:slug" element={<IntelligenceIssuePage />} />
          <Route path="/tracker" element={<TrackerPage />} />
          <Route path="/tracker/:slug" element={<TrackerEntryPage />} />
          <Route path="/demo" element={<DemoPage />} />

          {/* Tool Placeholder Pages */}
          <Route path="/tools/region-comparison" element={<ToolPlaceholderPage toolKey="region-comparison" />} />
          <Route path="/tools/expansion-readiness" element={<ToolPlaceholderPage toolKey="expansion-readiness" />} />
          <Route path="/tools/edc-directory" element={<ToolPlaceholderPage toolKey="edc-directory" />} />
          <Route path="/tools/talent-source-finder" element={<ToolPlaceholderPage toolKey="talent-source-finder" />} />

          {/* Auth & Dashboards */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/demo-login" element={<DemoLogin />} />
          <Route path="/dashboard/college/*" element={<CollegeDashboard />} />
          <Route path="/dashboard/edc/*" element={<EDCDashboard />} />
          <Route path="/dashboard/student/*" element={<StudentDashboard />} />
          <Route path="/dashboard/twc/*" element={<TWCDashboard />} />
          <Route path="/dashboard/admin/*" element={<AdminDashboard />} />
          <Route path="/agent" element={<AgentChat />} />
        </Routes>
      </main>
      {!isDashboard && <Footer />}
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
