import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Join from './pages/Join';
import Register from './pages/Register';
import FindJobsPage from './pages/FindJobsPage';
import HireTalent from './pages/HireTalent';
import ProfileSetup from './pages/ProfileSetup';
import ClientDashboard from './pages/client/Dashboard';
import MyJobs from './pages/client/MyJobs';
import Payments from './pages/client/Payments';
import BrowseExperts from './pages/client/BrowseFreelancers';
import ClientProposals from './pages/client/ClientProposals';
import JobProposals from './pages/client/JobProposals';
import ClientProfile from './pages/client/MyProfile';
import FreelancerDashboard from './pages/freelancer/Dashboard';
import BrowseJobs from './pages/freelancer/BrowseJobs';
import MyProposals from './pages/freelancer/MyProposals';
import Earnings from './pages/freelancer/Earnings';
import MyProfile from './pages/freelancer/MyProfile';
import PublicProfile from './pages/freelancer/PublicProfile';
import JobDetails from './pages/freelancer/JobDetails';
import SavedJobs from './pages/freelancer/SavedJobs';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import './index.css';
import Chat from './pages/Chat';
import Messages from './pages/freelancer/Messages';
import ContractDetails from './pages/ContractDetails';

// Admin Pages
import AdminLayout from './components/AdminLayout';
import AdminOverview from './pages/admin/Overview';
import AdminAnalytics from './pages/admin/Analytics';
import AdminUsers from './pages/admin/Users';
import AdminJobs from './pages/admin/Jobs';
import AdminContracts from './pages/admin/Contracts';
import AdminFinancials from './pages/admin/Financials';
import AdminVerifications from './pages/admin/Verifications';
import AdminLogin from './pages/admin/Login';
import AdminRegister from './pages/admin/Register';
import AdminClients from './pages/admin/Clients';
import AdminFreelancers from './pages/admin/Freelancers';
import AdminDisputes from './pages/admin/Disputes';
import AdminDisputeDetails from './pages/admin/DisputeDetails';
import AdminProposals from './pages/admin/Proposals';
import AdminSupport from './pages/admin/Support';
import AdminNotifications from './pages/admin/Notifications';
import AdminSettings from './pages/admin/Settings';
import AdminProjectDetails from './pages/admin/ProjectDetails';


import DashboardLayout from './components/DashboardLayout';

const PublicLayout = () => {
  return (
    <div className="app-container">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

import { NotificationProvider } from './context/NotificationContext';

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <Routes>
            {/* Public Routes with Navbar & Footer */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Join />} />
              <Route path="/register" element={<Register />} />
              <Route path="/jobs" element={<FindJobsPage />} />
              <Route path="/hire-talent" element={<HireTalent />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/register" element={<AdminRegister />} />
              <Route path="/admin" element={<Navigate to="/admin/register" replace />} />
            </Route>

            {/* Protected Routes (Single Entry Point for Setup) */}
            <Route element={<ProtectedRoute />}>
              <Route path="/profile-setup" element={<ProfileSetup />} />

              {/* Role specific dashboard routes with DashboardLayout (No Footer, has Sidebar) */}
              <Route element={<DashboardLayout />}>
                <Route path="/profile/:id" element={<PublicProfile />} />

                <Route element={<ProtectedRoute requiredRole="client" />}>
                  <Route path="/client/dashboard" element={<ClientDashboard />} />
                  <Route path="/client/my-jobs" element={<MyJobs />} />
                  <Route path="/client/browse-experts" element={<BrowseExperts />} />
                  <Route path="/payments" element={<Payments />} />
                  <Route path="/client/proposals" element={<ClientProposals />} />
                  <Route path="/client/jobs/:jobId/proposals" element={<JobProposals />} />
                  <Route path="/client/profile" element={<ClientProfile />} />
                </Route>

                <Route element={<ProtectedRoute requiredRole="freelancer" />}>
                  <Route path="/freelancer/dashboard" element={<FreelancerDashboard />} />
                  <Route path="/freelancer/browse-jobs" element={<BrowseJobs />} />
                  <Route path="/freelancer/proposals" element={<MyProposals />} />
                  <Route path="/freelancer/earnings" element={<Earnings />} />
                  <Route path="/freelancer/profile" element={<MyProfile />} />
                  <Route path="/freelancer/jobs/:jobId" element={<JobDetails />} />
                  <Route path="/freelancer/saved-jobs" element={<SavedJobs />} />
                </Route>

                {/* Shared Routes - accessible by both client and freelancer */}
                <Route path="/messages" element={<Messages />} />
                <Route path="/chat/:contractId" element={<Chat />} />

                {/* Contract Details Route */}
                <Route path="/contract/:contractId" element={<ContractDetails />} />
              </Route>
            </Route>

            {/* Admin Protected Routes (Moved outside general ProtectedRoute) */}
            <Route element={<ProtectedRoute requiredRole="admin" />}>
              <Route element={<AdminLayout />}>
                <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="/admin/dashboard" element={<AdminOverview />} />
                <Route path="/admin/analytics" element={<AdminAnalytics />} />
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route path="/admin/clients" element={<AdminClients />} />
                <Route path="/admin/freelancers" element={<AdminFreelancers />} />
                <Route path="/admin/verifications" element={<AdminVerifications />} />
                <Route path="/admin/projects" element={<AdminJobs />} />
                <Route path="/admin/projects/:id" element={<AdminProjectDetails />} />
                <Route path="/admin/proposals" element={<AdminProposals />} />
                <Route path="/admin/contracts" element={<AdminContracts />} />
                <Route path="/admin/disputes" element={<AdminDisputes />} />
                <Route path="/admin/disputes/:id" element={<AdminDisputeDetails />} />
                <Route path="/admin/financials" element={<AdminFinancials />} />
                <Route path="/admin/support" element={<AdminSupport />} />
                <Route path="/admin/notifications" element={<AdminNotifications />} />
                <Route path="/admin/settings" element={<AdminSettings />} />
              </Route>
            </Route>
          </Routes>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;

