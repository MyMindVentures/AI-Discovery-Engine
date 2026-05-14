/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import SearchPage from './pages/SearchPage';
import ResultsPage from './pages/ResultsPage';
import CompanyDetail from './pages/CompanyDetail';
import ListsPage from './pages/ListsPage';
import ListDetail from './pages/ListDetail';
import MonitoringPage from './pages/MonitoringPage';
import ExportsPage from './pages/ExportsPage';
import BillingPage from './pages/BillingPage';
import SettingsPage from './pages/SettingsPage';
import DeveloperPage from './pages/DeveloperPage';
import AdminPage from './pages/AdminPage';
import CopyrightPage from './pages/legal/CopyrightPage';
import IpProtectionPage from './pages/legal/IpProtectionPage';
import TermsPage from './pages/legal/TermsPage';
import PrivacyPage from './pages/legal/PrivacyPage';
import AdminIpProtectionPage from './pages/AdminIpProtectionPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* App Shell */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/companies/:id" element={<CompanyDetail />} />
          <Route path="/lists" element={<ListsPage />} />
          <Route path="/lists/:id" element={<ListDetail />} />
          <Route path="/monitoring" element={<MonitoringPage />} />
          <Route path="/exports" element={<ExportsPage />} />
          <Route path="/billing" element={<BillingPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/developer" element={<DeveloperPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/:tab" element={<AdminPage />} />
          <Route path="/admin/ip-protection" element={<AdminIpProtectionPage />} />
        </Route>

        {/* Legal Pages */}
        <Route path="/legal/copyright" element={<CopyrightPage />} />
        <Route path="/legal/ip-protection" element={<IpProtectionPage />} />
        <Route path="/legal/terms" element={<TermsPage />} />
        <Route path="/legal/privacy" element={<PrivacyPage />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

