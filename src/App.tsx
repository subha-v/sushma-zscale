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

function AppContent() {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard') || location.pathname === '/demo-login' || location.pathname === '/login';

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
          <Route path="/demo" element={<DemoPage />} />

          {/* Auth & Dashboards */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/demo-login" element={<DemoLogin />} />
          <Route path="/dashboard/college/*" element={<CollegeDashboard />} />
          <Route path="/dashboard/edc/*" element={<EDCDashboard />} />
          <Route path="/dashboard/student/*" element={<StudentDashboard />} />
          <Route path="/dashboard/twc/*" element={<TWCDashboard />} />
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
