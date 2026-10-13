
/**
 * Main Application Component with Route-based Code Splitting
 * Implements lazy loading for improved performance
 */
import CoverLetter from "./pages/CoverLetter";
import React, { useState, useEffect, lazy, Suspense } from 'react';
import Deployments from './pages/Deployments'
import TemplateGallery from "./pages/TemplateGallery";
import TemplatePreviewOnly from "./pages/TemplatePreviewOnly";

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthProvider';
import { useAuth } from './hooks/useAuth';
import { SocketProvider } from './context/SocketProvider';
import { ThemeProvider } from './context/ThemeProvider';
import AppLayout from './components/AppLayout';
import Footer from './components/ui/Footer';

import CommandPalette from './components/CommandPalette';
import BackToTop from './components/BackToTop';
import Home from './pages/Home';
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Analytics = lazy(() => import('./pages/Analytics'));
const JobSearch = lazy(() => import('./pages/JobSearch'));
const ResumeBuilder = lazy(() => import('./pages/ResumeBuilder'));
import TextToResume from './pages/TextToResume';

import JobTracker from './pages/JobTracker';

const Community = lazy(() => import('./pages/Community'));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const LinkedInCallback = lazy(() => import("./pages/LinkedInCallback"));
const OpenRouterCallback = lazy(() => import("./pages/OpenRouterCallback"));
const Upload = lazy(() => import("./pages/Upload"));
const Enhance = lazy(() => import("./pages/Enhance"));
const ResumeView = lazy(() => import("./pages/ResumeView"));
const ResumeTemplates = lazy(() => import("./pages/ResumeTemplates"));
const ResumeExamples = lazy(() => import("./pages/ResumeExamples"));
const JobAlerts = lazy(() => import("./pages/JobAlerts"));
const InterviewPrep = lazy(() => import("./pages/InterviewPrep"));
const InterviewHistory = lazy(() => import("./pages/InterviewHistory"));
const InterviewReplay = lazy(() => import("./pages/InterviewReplay"));
const UserProfile = lazy(() => import("./pages/UserProfile"));
const SecuritySettings = lazy(() => import("./pages/SecuritySettings"));
const LinkedInOptimizer = lazy(() => import("./pages/LinkedInOptimizer"));
const Settings = lazy(() => import("./pages/Settings"));
const ResumeRoast = lazy(() => import('./pages/ResumeRoast'));
const RoastHub = lazy(() => import('./pages/hubs/RoastHub'));
const PortfolioGithub = lazy(() => import('./pages/PortfolioGithub'));
const GithubPortfolioHub = lazy(() => import('./pages/hubs/GithubPortfolioHub'));
const GithubCallback = lazy(() => import('./pages/auth/GithubCallback'));
const SkillGap = lazy(() => import("./pages/SkillGap"));
const ResumeHub = lazy(() => import("./pages/hubs/ResumeHub"));
const JobsHub = lazy(() => import("./pages/hubs/JobsHub"));
const PortfolioHub = lazy(() => import("./pages/hubs/PortfolioHub"));
const CareerGrowthHub = lazy(() => import("./pages/hubs/CareerGrowthHub"));
const CommunityHub = lazy(() => import("./pages/hubs/CommunityHub"));
const FellowshipLayout = lazy(() => import("./pages/fellowship/FellowshipLayout"));
const Challenges = lazy(() => import("./pages/fellowship/Challenges"));
const Onboarding = lazy(() => import("./pages/fellowship/Onboarding"));
const ChallengeDetail = lazy(() => import("./pages/fellowship/ChallengeDetail"));
const ChallengeProposals = lazy(() => import("./pages/fellowship/ChallengeProposals"));
const CreateChallenge = lazy(() => import("./pages/fellowship/CreateChallenge"));
const MyProposals = lazy(() => import("./pages/fellowship/MyProposals"));
const MyChallenges = lazy(() => import("./pages/fellowship/MyChallenges"));
const Verify = lazy(() => import("./pages/fellowship/Verify"));
const FellowshipMessages = lazy(() => import("./pages/fellowship/FellowshipMessages"));
const FellowshipChat = lazy(() => import("./pages/fellowship/FellowshipChat"));


const AdminLayout = lazy(() => import("./pages/admin/layout/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/admin/views/AdminDashboard"));
const AdminUsers = lazy(() => import("./pages/admin/views/AdminUsers"));
const SharedResumeView = lazy(() => import("./pages/SharedResumeView"));
const AdminLogins = lazy(() => import("./pages/admin/views/AdminLogins"));
const AdminBugs = lazy(() => import("./pages/admin/views/AdminBugs"));

import { NotFound } from './pages';
import TemplateRegistry from './components/portfolio/TemplateRegistry';


const PrivacyPolicy = lazy(() => import('./pages/LegalPrivacy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const CookiePolicy = lazy(() => import('./pages/LegalCookies'));





// Hub Imports
const GitHubDashboard = lazy(() => import('./pages/GitHubDashboard'));
const LinkedInDashboard = lazy(() => import('./pages/LinkedInDashboard'));
const RepoAnalyzerLanding = lazy(() => import('./pages/RepoAnalyzer/Landing'));
const RepoAnalyzerDashboard = lazy(() => import('./pages/RepoAnalyzer/Dashboard'));
const RepoAnalyzerWorkspace = lazy(() => import('./pages/RepoAnalyzer/Workspace'));
const LegacyProjectVisualizerLanding = lazy(() => import('./pages/ProjectVisualizer/Landing'));
const ProjectVisualizerDashboard = lazy(() => import('./pages/ProjectVisualizer/Dashboard'));

const ResumeBuilderLanding = lazy(() => import('./pages/features/ResumeBuilderLanding'));
const PortfolioBuilderLanding = lazy(() => import('./pages/features/PortfolioBuilderLanding'));
const ResumeRoastLanding = lazy(() => import('./pages/features/ResumeRoastLanding'));
const GithubPortfolioLanding = lazy(() => import('./pages/features/GithubPortfolioLanding'));
const ProjectVisualizerLanding = lazy(() => import('./pages/features/ProjectVisualizerLanding'));
const JobFinderLanding = lazy(() => import('./pages/features/JobFinderLanding'));
const MockInterviewLanding = lazy(() => import('./pages/features/MockInterviewLanding'));
const RecruitersLanding = lazy(() => import('./pages/features/RecruitersLanding'));

import ScrollToTop from "./components/ScrollToTop";
import TestSocialLinks from './pages/TestSocialLinks';

function LoadingScreen({ label }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-muted border-t-primary rounded-full animate-spin"></div>
        <p className="text-muted-foreground font-medium">{label}</p>
      </div>
    </div>
  );
}


function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-muted border-t-primary rounded-full animate-spin"></div>
          <p className="text-muted-foreground font-medium">Loading TeacHforPLaCeMeNt...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <AppLayout>{children}</AppLayout>;
}


function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-muted border-t-primary rounded-full animate-spin"></div>
          <p className="text-muted-foreground font-medium">Loading TeacHforPLaCeMeNt...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}


// Admin Route Wrapper
const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen label="Checking permissions..." />;
  }

  // Note: we trust the backend to enforce the real check.
  // We can just check if they are logged in here, and rely on the backend.
  // Ideally, the user object would have a role property from the decoded token.
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function AppRoutes() {
  const { user } = useAuth();
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  useEffect(() => {
    if (!user) return;
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [user]);

  return (
    <BrowserRouter>
      <ScrollToTop />
      {!!user && (
        <CommandPalette
          isOpen={isCommandPaletteOpen}
          setIsOpen={setIsCommandPaletteOpen}
        />
      )}
      <div className="bg-mesh" />
      <BackToTop />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          className: "teachforplacement-toast",
          style: {
            background: "var(--card)",
            color: "var(--foreground)",
            borderRadius: "var(--radius)",
            border: "1px solid var(--border)",
            backdropFilter: "blur(8px)",
          },
          success: {
            iconTheme: { primary: "#10B981", secondary: "#fff" },
          },
          error: {
            iconTheme: { primary: "#EF4444", secondary: "#fff" },
          },
        }}
      />
      <Suspense fallback={<LoadingScreen label="Loading route..." />}><Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicRoute><Home /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/auth/linkedin/callback" element={<LinkedInCallback />} />
        <Route path="/auth/openrouter/callback" element={<OpenRouterCallback />} />

        {/* Feature SaaS Landing Pages (Clean Slugs) */}
        <Route path="/resume-builder" element={<ResumeBuilderLanding />} />
        <Route path="/portfolio-builder" element={<PortfolioBuilderLanding />} />
        <Route path="/resume-roast" element={<ResumeRoastLanding />} />
        <Route path="/github-portfolio" element={<GithubPortfolioLanding />} />
        <Route path="/project-visualizer" element={<ProjectVisualizerLanding />} />
        <Route path="/job-finder" element={<JobFinderLanding />} />
        <Route path="/mock-interview" element={<MockInterviewLanding />} />
        <Route path="/recruiters" element={<RecruitersLanding />} />

        {/* Legacy Landing Redirects */}
        
        
        
        

        {/* Legal Pages (Public) */}
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/about" element={<About />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/cookies" element={<CookiePolicy />} />

        {/* Template Gallery Route (Registered at /templates) */}
        <Route path="/templates" element={<TemplateGallery />} />
        <Route path="/templates/:templateId" element={<TemplateRegistry />} />
        <Route path="/preview/:templateId" element={<TemplatePreviewOnly />} />
                <Route path="/cover-letter" element={<CoverLetter />} />


        {/*  */}

                                        
                                                                                                        
                                                                                                                {/* Core Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/analytics"
          element={
            <Analytics />
          }
        />
        <Route path="/upload" element={<ProtectedRoute><Upload /></ProtectedRoute>} />
        <Route
          path="/shared/:shareToken" element={<SharedResumeView />} />
        <Route
          path="/roast/:shareToken"
          element={
            <ProtectedRoute>
              <ResumeRoast />
            </ProtectedRoute>
          }
        />
        <Route path="/resume-builder/build"
          element={
            <ProtectedRoute>
              <ResumeBuilder />
            </ProtectedRoute>
          }
        />
        <Route path="/text-to-resume" element={<ProtectedRoute><TextToResume /></ProtectedRoute>} />
        <Route path="/enhance/:resumeId" element={<ProtectedRoute><Enhance /></ProtectedRoute>} />
        <Route path="/shared/:shareToken" element={<SharedResumeView />} />
        <Route path="/resume/:resumeId" element={<ProtectedRoute><ResumeView /></ProtectedRoute>} />
        <Route path="/resume-templates" element={<ProtectedRoute><ResumeTemplates /></ProtectedRoute>} />
        <Route path="/resume-examples" element={<ProtectedRoute><ResumeExamples /></ProtectedRoute>} />
        <Route
          path="/job-finder/search"
          element={
            <ProtectedRoute>
              <JobSearch />
            </ProtectedRoute>
          }
        />
        {/* Legacy redirect for jobs */}
        
        <Route path="/job-alerts" element={<ProtectedRoute><JobAlerts /></ProtectedRoute>} />
        <Route path="/job-tracker" element={<ProtectedRoute><JobTracker /></ProtectedRoute>} />
        <Route
          path="/community"
          element={
            <ProtectedRoute>
              <Community />
            </ProtectedRoute>
          }
        />
        <Route path="/mock-interview/practice" element={<ProtectedRoute><InterviewPrep /></ProtectedRoute>} />
        {/* Legacy redirect for interview-prep */}
        
        <Route
          path="/interview-history"
          element={
            <ProtectedRoute>
              <InterviewHistory />
            </ProtectedRoute>
          }
        />

        <Route
          path="/interview-history/:id"
          element={
            <ProtectedRoute>
              <InterviewReplay />
            </ProtectedRoute>
          }
        />
        <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
        <Route path="/profile/:uid" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
        <Route path="/security" element={<ProtectedRoute><SecuritySettings /></ProtectedRoute>} />
        <Route path="/linkedin-optimizer" element={<ProtectedRoute><LinkedInOptimizer /></ProtectedRoute>} />
        <Route path="/skill-gap" element={<ProtectedRoute><SkillGap /></ProtectedRoute>} />
        <Route path="/deployments" element={<ProtectedRoute><Deployments /></ProtectedRoute>} />
        <Route path="/resume-roast/analyze" element={<ProtectedRoute><ResumeRoast /></ProtectedRoute>} />
        <Route path="/github-portfolio/build" element={<ProtectedRoute><PortfolioGithub /></ProtectedRoute>} />
        {/* Legacy redirects */}
        
        <Route path="/auth/github/callback" element={<ProtectedRoute><GithubCallback /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />


        {/* Admin Routes */}
        <Route path="/admin" element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="logins" element={<AdminLogins />} />
          <Route path="bugs" element={<AdminBugs />} />
        </Route>

        {/* Hub Routes */}
        <Route path="/hub/resume" element={<ProtectedRoute><ResumeHub /></ProtectedRoute>} />
        <Route path="/hub/roast" element={<ProtectedRoute><RoastHub /></ProtectedRoute>} />
        <Route path="/hub/portfolio/github" element={<ProtectedRoute><GithubPortfolioHub /></ProtectedRoute>} />
        <Route path="/hub/jobs" element={<ProtectedRoute><JobsHub /></ProtectedRoute>} />
        <Route path="/hub/portfolio" element={<ProtectedRoute><PortfolioHub /></ProtectedRoute>} />
        <Route path="/hub/career" element={<ProtectedRoute><CareerGrowthHub /></ProtectedRoute>} />
        <Route path="/hub/community" element={<ProtectedRoute><CommunityHub /></ProtectedRoute>} />
        <Route
          path="/github-dashboard"
          element={
            <ProtectedRoute>
              <GitHubDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/github"
          element={
            <ProtectedRoute>
              <GitHubDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/linkedin-dashboard"
          element={
            <ProtectedRoute>
              <LinkedInDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/linkedin"
          element={
            <ProtectedRoute>
              <LinkedInDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="/repo-analyzer" element={<Navigate to="/project-visualizer" replace />} />
        <Route path="/repo-analyzer/dashboard" element={<Navigate to="/project-visualizer" replace />} />
        <Route path="/repo-analyzer/workspace" element={<Navigate to="/project-visualizer" replace />} />
        <Route
          path="/project-visualizer"
          element={
            <ProjectVisualizerLanding />
          }
        />
        
        <Route
          path="/project-visualizer/dashboard/:sessionId"
          element={
            <ProtectedRoute>
              <ProjectVisualizerDashboard />
            </ProtectedRoute>
          }
        />


        {/* Nested Fellowship Routes */}
        <Route path="/fellowship" element={<ProtectedRoute><FellowshipLayout /></ProtectedRoute>}>
          <Route index element={<Challenges />} />
          <Route path="onboarding" element={<Onboarding />} />
          <Route path="challenges" element={<Challenges />} />
          <Route path="challenges/:id" element={<ChallengeDetail />} />
          <Route path="challenges/:id/proposals" element={<ChallengeProposals />} />
          <Route path="create-challenge" element={<CreateChallenge />} />
          <Route path="my-proposals" element={<MyProposals />} />
          <Route path="my-challenges" element={<MyChallenges />} />
          <Route path="verify" element={<Verify />} />
          <Route path="messages" element={<FellowshipMessages />} />
          <Route path="messages/:roomId" element={<FellowshipChat />} />
        </Route>


        <Route path="/test-social-links" element={<TestSocialLinks />} />


        {/* Catch-All Route */}
        <Route path="*" element={<NotFound />} />
              </Routes></Suspense>
    </BrowserRouter>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SocketProvider>
          <AppRoutes />
        </SocketProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
