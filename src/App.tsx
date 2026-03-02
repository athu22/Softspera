import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';
import { Suspense, lazy } from 'react';
import RootLayout from './layouts/RootLayout';
import AdminLayout from './layouts/AdminLayout';
import { AuthProvider } from './hooks/useAuth';

// Lazy loaded public pages
const HomePage = lazy(() => import('./pages/HomePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'));
const InternshipsPage = lazy(() => import('./pages/InternshipsPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// Lazy loaded admin pages
const AdminDashboard = lazy(() => import('./pages/admin/DashboardPage'));
const AdminServices = lazy(() => import('./pages/admin/ServicesPage'));
const AdminProjects = lazy(() => import('./pages/admin/ProjectsPage'));
const AdminTeam = lazy(() => import('./pages/admin/TeamPage'));
const AdminInternships = lazy(() => import('./pages/admin/InternshipsPage'));
const AdminInternshipEnquiries = lazy(() => import('./pages/admin/InternshipEnquiriesPage'));
const LoginPage = lazy(() => import('./pages/admin/LoginPage'));

// Loading Fallback
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-background">
    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
  </div>
);

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<RootLayout />}>
                <Route index element={<HomePage />} />
                <Route path="about" element={<AboutPage />} />
                <Route path="services" element={<ServicesPage />} />
                <Route path="projects" element={<ProjectsPage />} />
                <Route path="internships" element={<InternshipsPage />} />
                <Route path="contact" element={<ContactPage />} />
              </Route>

              {/* Admin routes */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="services" element={<AdminServices />} />
                <Route path="projects" element={<AdminProjects />} />
                <Route path="team" element={<AdminTeam />} />
                <Route path="internships" element={<AdminInternships />} />
                <Route path="internship-enquiries" element={<AdminInternshipEnquiries />} />
              </Route>
              <Route path="/admin/login" element={<LoginPage />} />

              {/* 404 page */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
          <Toaster position="top-right" />
        </BrowserRouter>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
