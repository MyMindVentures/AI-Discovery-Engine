import { useEffect, useState } from 'react';
import PageHeader from '../components/ui/PageHeader';
import { 
  User, 
  Shield, 
  Bell, 
  Globe, 
  Key, 
  Cloud, 
  Save, 
  UserCheck, 
  RefreshCw, 
  Layout, 
  Type, 
  Palette, 
  Settings as SettingsIcon,
  Smartphone,
  Mail,
  Lock,
  CreditCard,
  Building,
  Plus,
  Trash2,
  Copy,
  Check,
  ExternalLink,
  Github,
  Database,
  Briefcase,
  Terminal,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types/auth';
import { userService, organizationService } from '../services/userService';
import { usePersistentState } from '../hooks/usePersistentState';
import { useTheme } from '../contexts/ThemeContext';
import { toast } from 'sonner';
import { SettingsSection, ToggleRow, EmptyActionState } from '../components/ui/SettingsUI';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';

type SettingsTab = 'profile' | 'preferences' | 'language' | 'theme' | 'notifications' | 'integrations' | 'api-keys' | 'security' | 'workspace' | 'billing';

export default function SettingsPage() {
  const { user, switchRole, isLoading: authLoading } = useAuth();
  const { theme, setTheme } = useTheme();
  
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Profile State
  const [profile, setProfile] = useState<any>(null);
  const [profileForm, setProfileForm] = useState({ name: '', email: '', company: '' });

  // Preferences State
  const [preferences, setPreferences] = usePersistentState('user-preferences', {
    defaultSearchMode: 'intelligence',
    defaultResultView: 'table',
    defaultExportFormat: 'csv',
    rowsPerPage: 25,
    compactMode: false
  });

  // Language State
  const [language, setLanguage] = usePersistentState('user-language', 'English');

  // Notifications State
  const [notifications, setNotifications] = usePersistentState('user-notifications', {
    productUpdates: true,
    monitoringAlerts: true,
    exportCompleted: true,
    scrapingFailed: true,
    billingAlerts: true,
    aiUsageAlerts: false,
    weeklyDigest: false
  });

  // Integrations State
  const [integrations, setIntegrations] = usePersistentState('user-integrations', {
    googleSheets: { connected: false, status: 'Disconnected' },
    airtable: { connected: false, status: 'Disconnected' },
    notion: { connected: false, status: 'Disconnected' },
    hubspot: { connected: false, status: 'Disconnected' },
    slack: { connected: false, status: 'Disconnected' },
    webhooks: { connected: false, status: 'Disconnected' }
  });

  // API Keys State
  const [apiKeys, setApiKeys] = useState<any[]>([]);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [lastGeneratedKey, setLastGeneratedKey] = useState<string | null>(null);

  // Security State
  const [twoFactor, setTwoFactor] = useState(false);

  // Workspace State
  const [workspace, setWorkspace] = useState({ name: 'Discovery Studio', slug: 'discovery-studio', defaultRole: 'team_member' });
  const [members, setMembers] = useState([
    { id: '1', name: 'Alice Node', email: 'alice@discovery.ai', role: 'team_admin', status: 'Active' },
    { id: '2', name: 'Bob Neural', email: 'bob@discovery.ai', role: 'team_member', status: 'Invited' }
  ]);
  const [inviteEmail, setInviteEmail] = useState('');

  // Billing Shortcut State (Mocked from existing billing data patterns)
  const [billingSummary] = useState({
    plan: 'Pro Plan',
    credits: '8,420 remaining',
    usage: '42% utilized',
    renewal: 'June 12, 2026'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const profileData = await userService.getProfile('u_1');
      setProfile(profileData);
      setProfileForm({
        name: profileData?.name || '',
        email: profileData?.email || '',
        company: profileData?.memberships?.[0]?.organization?.name || 'Personal'
      });

      const keysData = await userService.getApiKeys('org_1');
      setApiKeys(keysData);
    } catch (err) {
      console.error("Failed to fetch data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await userService.updateProfile('u_1', { name: profileForm.name });
      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveWorkspace = async () => {
    setSaving(true);
    try {
      await organizationService.update('org_1', { name: workspace.name });
      toast.success("Workspace settings saved");
    } catch (err) {
      toast.error("Failed to update workspace");
    } finally {
      setSaving(false);
    }
  };

  const handleCreateApiKey = async () => {
    if (!newKeyName) return;
    try {
      const data = await userService.createApiKey({ organizationId: 'org_1', name: newKeyName });
      setLastGeneratedKey(data.rawKey);
      setApiKeys([...apiKeys, data]);
      setNewKeyName('');
      toast.success("New API key generated");
    } catch (err) {
      toast.error("Failed to create API key");
    }
  };

  const handleDeleteApiKey = async (id: string) => {
    try {
      await userService.deleteApiKey(id);
      setApiKeys(apiKeys.filter(k => k.id !== id));
      toast.success("API key revoked");
    } catch (err) {
      toast.error("Failed to revoke key");
    }
  };

  const handleConnectIntegration = (id: string) => {
    const isConnected = integrations[id as keyof typeof integrations].connected;
    setIntegrations({
      ...integrations,
      [id]: { 
        connected: !isConnected, 
        status: !isConnected ? 'Connected' : 'Disconnected' 
      }
    });
    toast.success(isConnected ? `Disconnected from ${id}` : `Successfully connected to ${id}`);
  };

  const handleInviteMember = () => {
    if (!inviteEmail) return;
    const newMember = {
      id: Math.random().toString(36).substr(2, 9),
      name: inviteEmail.split('@')[0],
      email: inviteEmail,
      role: 'team_member',
      status: 'Invited'
    };
    setMembers([...members, newMember]);
    setInviteEmail('');
    toast.success(`Invitation sent to ${inviteEmail}`);
  };

  const handleRemoveMember = (id: string) => {
    setMembers(members.filter(m => m.id !== id));
    toast.success("Team member removed");
  };

  const tabs: { id: SettingsTab; label: string; icon: any }[] = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'workspace', label: 'Workspace', icon: Building },
    { id: 'preferences', label: 'Preferences', icon: Layout },
    { id: 'theme', label: 'Theme', icon: Palette },
    { id: 'language', label: 'Language', icon: Globe },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'integrations', label: 'Integrations', icon: Cloud },
    { id: 'api-keys', label: 'API Keys', icon: Key },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'billing', label: 'Billing Summary', icon: CreditCard },
  ];

  if (loading && !profile) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-10 max-w-7xl mx-auto pb-32">
      <PageHeader 
        title="Settings" 
        description="Governing account state, intelligence preferences, and protocol nodes."
        actions={
          <div className="flex items-center gap-3">
             <div className="p-2 rounded-xl bg-indigo-600/5 border border-indigo-600/20 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-indigo-400" />
                <select 
                  value={user?.role} 
                  onChange={(e) => switchRole(e.target.value as UserRole)}
                  className="bg-transparent border-none text-[10px] font-black uppercase text-indigo-400 focus:outline-none"
                >
                  {Object.values(UserRole).map(role => (
                    <option key={role} value={role}>{role.replace('_', ' ')}</option>
                  ))}
                </select>
             </div>
             <button 
                onClick={() => {
                  if (activeTab === 'profile') handleSaveProfile();
                  else if (activeTab === 'workspace') handleSaveWorkspace();
                  else toast.success("Settings saved locally");
                }}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/20 disabled:opacity-50"
                disabled={saving}
              >
                {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Changes
              </button>
          </div>
        }
      />

      <div className="flex flex-col lg:flex-row gap-10 mt-10">
        {/* Navigation Sidebar */}
        <div className="w-full lg:w-72 space-y-2 lg:sticky lg:top-10 h-fit">
          <div className="flex flex-row lg:flex-col overflow-x-auto pb-2 lg:pb-0 gap-2 no-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all border whitespace-nowrap min-w-fit",
                  activeTab === tab.id 
                    ? "bg-indigo-600/10 text-indigo-400 border-indigo-600/20 shadow-sm" 
                    : "bg-transparent text-zinc-500 border-transparent hover:text-zinc-300 hover:bg-zinc-900"
                )}
              >
                <tab.icon className={cn("w-4 h-4", activeTab === tab.id ? "text-indigo-400" : "text-zinc-600")} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 max-w-3xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-12"
            >
              {activeTab === 'profile' && (
                <SettingsSection title="Profile Identity" description="Update your personal details and how you appear in the network.">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest px-1">Identity Display Name</label>
                      <input 
                        type="text" 
                        value={profileForm.name}
                        onChange={e => setProfileForm({ ...profileForm, name: e.target.value })}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:ring-1 ring-indigo-500/30 transition-all font-medium"
                      />
                    </div>
                    <div className="space-y-3 opacity-60">
                      <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest px-1">Authenticated Email</label>
                      <input 
                        type="email" 
                        value={profileForm.email}
                        readOnly
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-5 py-4 text-sm text-zinc-500 cursor-not-allowed font-medium"
                      />
                    </div>
                    <div className="sm:col-span-2 flex items-center gap-6 p-6 rounded-3xl bg-zinc-950 border border-zinc-800">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-3xl font-black text-white shadow-xl relative group">
                        {profileForm.name.charAt(0) || '?'}
                        <button className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Plus className="w-6 h-6" />
                        </button>
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-sm font-bold text-white">Identity Avatar</h4>
                        <p className="text-xs text-zinc-500 max-w-[200px]">Represent your profile across the discovery engine. JPEG or PNG up to 2MB.</p>
                        <button className="text-[10px] font-black uppercase text-indigo-400 hover:underline tracking-widest">Upload New Cluster</button>
                      </div>
                    </div>
                  </div>
                </SettingsSection>
              )}

              {activeTab === 'preferences' && (
                <SettingsSection title="Extraction Preferences" description="Configure default behaviors for discovery and data exfiltration.">
                  <div className="space-y-8">
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest px-1">Default Search Protocol</label>
                          <select 
                            value={preferences.defaultSearchMode}
                            onChange={e => setPreferences({...preferences, defaultSearchMode: e.target.value})}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none ring-indigo-500/30 transition-all font-medium appearance-none"
                          >
                            <option value="intelligence">Deep Intelligence</option>
                            <option value="rapid">Rapid Discovery</option>
                            <option value="stealth">Stealth Extraction</option>
                          </select>
                        </div>
                        <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest px-1">Initial View Mode</label>
                          <div className="flex p-1 bg-zinc-900 border border-zinc-800 rounded-2xl">
                             <button 
                                onClick={() => setPreferences({...preferences, defaultResultView: 'table'})}
                                className={cn("flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all", preferences.defaultResultView === 'table' ? "bg-zinc-800 text-white shadow-inner" : "text-zinc-600 hover:text-zinc-400")}
                             >
                               Table
                             </button>
                             <button 
                                onClick={() => setPreferences({...preferences, defaultResultView: 'cards'})}
                                className={cn("flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all", preferences.defaultResultView === 'cards' ? "bg-zinc-800 text-white shadow-inner" : "text-zinc-600 hover:text-zinc-400")}
                             >
                               Cards
                             </button>
                          </div>
                        </div>
                     </div>

                     <div className="p-6 rounded-3xl bg-zinc-950 border border-zinc-800 space-y-6">
                        <ToggleRow 
                          label="Compact Interface" 
                          description="Minimize white space and font sizes for high-density monitoring."
                          checked={preferences.compactMode}
                          onChange={val => setPreferences({...preferences, compactMode: val})}
                        />
                        <div className="w-full h-px bg-zinc-900" />
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col gap-1">
                               <span className="text-sm font-bold text-white">Default Export Format</span>
                               <p className="text-xs text-zinc-500">Standard encoding for data exfiltration.</p>
                            </div>
                            <div className="flex gap-2">
                               {['csv', 'xlsx', 'json'].map(fmt => (
                                 <button 
                                    key={fmt}
                                    onClick={() => setPreferences({...preferences, defaultExportFormat: fmt})}
                                    className={cn("px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all", preferences.defaultExportFormat === fmt ? "bg-indigo-600 text-white border-indigo-500" : "bg-zinc-900 border-zinc-800 text-zinc-600")}
                                 >
                                   {fmt}
                                 </button>
                               ))}
                            </div>
                        </div>
                     </div>
                  </div>
                </SettingsSection>
              )}

              {activeTab === 'language' && (
                <SettingsSection title="Localization Node" description="Select the linguistic interface for the discovery engine.">
                   <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {[
                        'English', 'Dutch', 'French', 'German', 'Spanish', 
                        'Italian', 'Portuguese', 'Polish', 'Turkish', 'Japanese'
                      ].map(lang => (
                        <button
                          key={lang}
                          onClick={() => {
                            setLanguage(lang);
                            toast.success(`Language set to ${lang}`);
                          }}
                          className={cn(
                            "p-4 rounded-2xl border text-sm font-bold transition-all text-left flex items-center justify-between",
                            language === lang 
                              ? "bg-indigo-600/10 border-indigo-600/30 text-indigo-400 shadow-sm" 
                              : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700"
                          )}
                        >
                          {lang}
                          {language === lang && <Check className="w-4 h-4" />}
                        </button>
                      ))}
                   </div>
                </SettingsSection>
              )}

              {activeTab === 'theme' && (
                <SettingsSection title="Visual Spectrum" description="Adjust the luminosity of the engine interface.">
                   <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      {[
                        { id: 'light', label: 'Luminous', icon: Smartphone, desc: 'Light mode interface' },
                        { id: 'dark', label: 'Ether', icon: Database, desc: 'Dark mode interface' },
                        { id: 'system', label: 'Neural', icon: RefreshCw, desc: 'Follow system baseline' }
                      ].map(t => (
                        <button
                          key={t.id}
                          onClick={() => {
                            setTheme(t.id as any);
                            toast.success(`Theme configured to ${t.label}`);
                          }}
                          className={cn(
                            "flex flex-col gap-4 p-8 rounded-3xl border transition-all text-left group",
                            theme === t.id 
                              ? "bg-indigo-600/10 border-indigo-600/30 text-indigo-400" 
                              : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-white"
                          )}
                        >
                          <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center border transition-all", theme === t.id ? "bg-indigo-600 text-white border-indigo-500" : "bg-zinc-800 text-zinc-600 border-zinc-700 group-hover:scale-110")}>
                             <t.icon className="w-6 h-6" />
                          </div>
                          <div>
                            <div className="text-sm font-black uppercase tracking-widest mb-1">{t.label}</div>
                            <p className="text-[10px] font-medium opacity-60 tracking-tight leading-tight">{t.desc}</p>
                          </div>
                        </button>
                      ))}
                   </div>
                </SettingsSection>
              )}

              {activeTab === 'notifications' && (
                <SettingsSection title="Neural Alerts" description="Configure when the discovery engine should trigger external alerts.">
                   <div className="p-8 rounded-[2.5rem] bg-zinc-950 border border-zinc-800 divide-y divide-zinc-900">
                      <ToggleRow 
                        label="Product Telemetry" 
                        description="New features and baseline updates."
                        checked={notifications.productUpdates}
                        onChange={v => setNotifications({...notifications, productUpdates: v})}
                      />
                      <ToggleRow 
                        label="Job Failures & Blocks" 
                        description="Critical alerts when extraction nodes are bricked."
                        checked={notifications.scrapingFailed}
                        onChange={v => setNotifications({...notifications, scrapingFailed: v})}
                      />
                      <ToggleRow 
                        label="Monitoring Triggers" 
                        description="Alerts for specific company target movements."
                        checked={notifications.monitoringAlerts}
                        onChange={v => setNotifications({...notifications, monitoringAlerts: v})}
                      />
                      <ToggleRow 
                        label="Quota Limitations" 
                        description="Alert when intelligence usage exceeds 80%."
                        checked={notifications.aiUsageAlerts}
                        onChange={v => setNotifications({...notifications, aiUsageAlerts: v})}
                      />
                      <ToggleRow 
                        label="Intelligence Digest" 
                        description="Weekly rollup of exfiltrated company data."
                        checked={notifications.weeklyDigest}
                        onChange={v => setNotifications({...notifications, weeklyDigest: v})}
                      />
                   </div>
                </SettingsSection>
              )}

              {activeTab === 'integrations' && (
                <SettingsSection title="External Clusters" description="Establish data bridges between AI Discovery and your enterprise stack.">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { id: 'googleSheets', name: 'Google Sheets', icon: Database, color: 'text-emerald-500' },
                      { id: 'airtable', name: 'Airtable', icon: Layout, color: 'text-blue-400' },
                      { id: 'notion', name: 'Notion', icon: Type, color: 'text-white' },
                      { id: 'hubspot', name: 'HubSpot', icon: User, color: 'text-orange-500' },
                      { id: 'slack', name: 'Slack', icon: Bell, color: 'text-purple-400' },
                      { id: 'webhooks', name: 'Webhooks', icon: Key, color: 'text-indigo-400' }
                    ].map(int => (
                      <div key={int.id} className="p-6 rounded-3xl bg-zinc-950 border border-zinc-800 flex items-center justify-between group hover:border-zinc-700 transition-all">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 rounded-2xl bg-zinc-900 flex items-center justify-center border border-zinc-800">
                             <int.icon className={cn("w-6 h-6", int.color)} />
                           </div>
                           <div className="flex flex-col">
                              <span className="text-sm font-bold text-white">{int.name}</span>
                              <span className={cn("text-[10px] font-black uppercase tracking-widest", integrations[int.id as keyof typeof integrations].connected ? "text-emerald-500" : "text-zinc-600")}>
                                {integrations[int.id as keyof typeof integrations].status}
                              </span>
                           </div>
                        </div>
                        <div className="flex items-center gap-2">
                           {integrations[int.id as keyof typeof integrations].connected && (
                             <button className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-white transition-all">
                                <SettingsIcon className="w-4 h-4" />
                             </button>
                           )}
                           <button 
                            onClick={() => handleConnectIntegration(int.id)}
                            className={cn(
                              "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                              integrations[int.id as keyof typeof integrations].connected 
                                ? "bg-zinc-800 text-zinc-400 border border-zinc-700 hover:bg-rose-500/10 hover:text-rose-500 hover:border-rose-500/20" 
                                : "bg-indigo-600 text-white border border-indigo-500 hover:bg-indigo-500"
                            )}
                          >
                            {integrations[int.id as keyof typeof integrations].connected ? 'Disconnect' : 'Connect'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </SettingsSection>
              )}

              {activeTab === 'api-keys' && (
                <SettingsSection title="Access Fragments" description="REST and GraphQL credentials for cross-system intelligence routing.">
                   <div className="space-y-6">
                      <div className="flex items-center justify-between">
                         <h4 className="text-xs font-black uppercase text-zinc-500 tracking-widest">Active Fragments ({apiKeys.length})</h4>
                         <button 
                          onClick={() => {
                            setLastGeneratedKey(null);
                            setShowKeyModal(true);
                          }}
                          className="text-[10px] font-black text-indigo-400 uppercase tracking-widest hover:underline flex items-center gap-1"
                         >
                           <Plus className="w-3 h-3" /> Generate New Node
                         </button>
                      </div>

                      <div className="space-y-3">
                         {apiKeys.length === 0 ? (
                           <div className="p-10 rounded-3xl border border-zinc-800 bg-zinc-900/10 text-center">
                              <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">No access tokens established.</p>
                           </div>
                         ) : apiKeys.map(key => (
                           <div key={key.id} className="p-6 rounded-3xl bg-zinc-950 border border-zinc-800 flex items-center justify-between group">
                              <div className="flex items-center gap-4">
                                 <div className="w-10 h-10 rounded-xl bg-indigo-600/10 border border-indigo-600/20 flex items-center justify-center text-indigo-400">
                                    <Key className="w-5 h-5" />
                                 </div>
                                 <div className="flex flex-col">
                                    <span className="text-sm font-bold text-white leading-tight">{key.name}</span>
                                    <span className="text-[10px] font-mono text-zinc-600 italic">sk_live_****{key.rawKey?.slice(-4) || '****'}</span>
                                 </div>
                              </div>
                              <div className="flex items-center gap-2">
                                 <button 
                                  onClick={() => {
                                    navigator.clipboard.writeText(key.rawKey || 'sk_live_mock_key');
                                    toast.success("Key copied to clipboard");
                                  }}
                                  className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-white transition-all shadow-inner"
                                 >
                                    <Copy className="w-4 h-4" />
                                 </button>
                                 <button 
                                  onClick={() => handleDeleteApiKey(key.id)}
                                  className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-rose-500 transition-all shadow-inner"
                                 >
                                    <Trash2 className="w-4 h-4" />
                                 </button>
                              </div>
                           </div>
                         ))}
                      </div>

                      <Link to="/developer" className="mt-10 p-6 rounded-3xl border border-indigo-600/20 bg-indigo-600/[0.02] flex items-center justify-between group hover:bg-indigo-600/[0.05] transition-all">
                         <div className="flex items-center gap-4">
                            <Terminal className="w-6 h-6 text-indigo-400" />
                            <div>
                               <h4 className="text-sm font-bold text-white">Developer Console</h4>
                               <p className="text-[10px] text-zinc-500 tracking-tight leading-tight">Access full documentation, schema explorers, and integration guides.</p>
                            </div>
                         </div>
                         <ExternalLink className="w-4 h-4 text-zinc-600 group-hover:text-indigo-400 transition-colors" />
                      </Link>
                   </div>
                </SettingsSection>
              )}

              {activeTab === 'security' && (
                <SettingsSection title="Identity Hardening" description="Fortify your account against unauthorized neural intrusions.">
                   <div className="space-y-8">
                     <div className="p-8 rounded-[2.5rem] bg-zinc-950 border border-zinc-800 space-y-8">
                        <div className="space-y-6">
                           <h4 className="text-xs font-black uppercase text-zinc-500 tracking-widest border-b border-zinc-900 pb-3">Baseline Credentials</h4>
                           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <input type="password" placeholder="Current Secret" className="bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-3 text-sm focus:outline-none" />
                              <div className="hidden sm:block" />
                              <input type="password" placeholder="New Secret Fragment" className="bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-3 text-sm focus:outline-none" />
                              <input type="password" placeholder="Confirm Secret Fragment" className="bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-3 text-sm focus:outline-none" />
                           </div>
                           <button className="text-[10px] font-black uppercase text-white bg-zinc-800 px-6 py-2.5 rounded-xl hover:bg-zinc-700 transition-all">
                              Update Cipher
                           </button>
                        </div>

                        <ToggleRow 
                          label="Multi-Factor Auth (2FA)" 
                          description="Require a hardware token or authenticator app pulse to decrypt account access."
                          checked={twoFactor}
                          onChange={setTwoFactor}
                        />

                        <div className="space-y-4 pt-4">
                           <h4 className="text-xs font-black uppercase text-zinc-500 tracking-widest border-b border-zinc-900 pb-3">Active Transmissions</h4>
                           <div className="space-y-3">
                              {[
                                { id: 1, agent: 'Chrome / macOS', ip: '142.12.8.***', loc: 'Berlin, DE', current: true },
                                { id: 2, agent: 'Neural Interface / CLI', ip: '8.8.8.8', loc: 'Cloud Node', current: false }
                              ].map(session => (
                                <div key={session.id} className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800 flex items-center justify-between">
                                   <div className="flex items-center gap-3">
                                      <Smartphone className="w-4 h-4 text-zinc-600" />
                                      <div className="flex flex-col">
                                         <span className="text-xs font-bold text-white">{session.agent} {session.current && <span className="text-[8px] px-1.5 py-0.5 bg-indigo-600/20 text-indigo-400 rounded-md border border-indigo-500/20 ml-2 uppercase">Current</span>}</span>
                                         <span className="text-[10px] text-zinc-600 font-mono italic">{session.ip} • {session.loc}</span>
                                      </div>
                                   </div>
                                   {!session.current && (
                                     <button className="text-[10px] font-black uppercase text-rose-500 hover:underline tracking-widest">Sever</button>
                                   )}
                                </div>
                              ))}
                           </div>
                           <button className="w-full py-4 rounded-2xl border border-rose-500/10 text-[10px] font-black uppercase text-rose-500 tracking-[0.2em] hover:bg-rose-500/5 transition-all mt-4">
                              Kill All Remote Sessions
                           </button>
                        </div>
                     </div>
                   </div>
                </SettingsSection>
              )}

              {activeTab === 'workspace' && (
                <SettingsSection title="Collaboration Node" description="Establish the metadata and personnel for your shared discovery studio.">
                  <div className="space-y-10">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest px-1">Studio Identifier</label>
                        <input 
                          type="text" 
                          value={workspace.name}
                          onChange={e => setWorkspace({...workspace, name: e.target.value})}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:ring-1 ring-indigo-500/30 transition-all font-medium"
                        />
                      </div>
                      <div className="space-y-3 opacity-60">
                        <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest px-1">Neural Slug (Immutable)</label>
                        <div className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-5 py-4 text-sm text-zinc-500 cursor-not-allowed font-medium flex items-center justify-between">
                           {workspace.slug}
                           <Lock className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                       <div className="flex items-center justify-between">
                          <h4 className="text-xs font-black uppercase text-zinc-500 tracking-widest">Authorized Personnel ({members.length})</h4>
                       </div>
                       <div className="space-y-3">
                          {members.map(member => (
                            <div key={member.id} className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-between group">
                               <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-xs font-bold border border-zinc-800">
                                     {member.name.charAt(0)}
                                  </div>
                                  <div className="flex flex-col">
                                     <span className="text-sm font-bold text-white tracking-tight">{member.name}</span>
                                     <span className="text-[10px] text-zinc-600 italic tracking-tight">{member.email}</span>
                                  </div>
                               </div>
                               <div className="flex items-center gap-4">
                                  <span className={cn(
                                    "text-[9px] font-black uppercase px-2 py-0.5 rounded-md border",
                                    member.role === 'team_admin' ? "bg-indigo-600/10 border-indigo-600/20 text-indigo-400" : "bg-zinc-900 border-zinc-800 text-zinc-500"
                                  )}>
                                    {member.role.replace('_', ' ')}
                                  </span>
                                  {user?.id !== member.id && (
                                    <button 
                                      onClick={() => handleRemoveMember(member.id)}
                                      className="p-2 rounded-lg text-zinc-600 hover:text-rose-500 transition-all"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  )}
                               </div>
                            </div>
                          ))}
                       </div>

                       <div className="p-6 rounded-3xl bg-zinc-900/30 border border-zinc-800/50 space-y-4">
                          <h4 className="text-[10px] font-black uppercase text-zinc-600 tracking-widest">Provision New Agent</h4>
                          <div className="flex gap-2">
                             <input 
                                type="email" 
                                placeholder="agent@discovery.ai" 
                                value={inviteEmail}
                                onChange={e => setInviteEmail(e.target.value)}
                                className="flex-1 bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500"
                             />
                             <button 
                                onClick={handleInviteMember}
                                className="px-6 rounded-xl bg-indigo-600 text-white text-[11px] font-black uppercase tracking-widest hover:bg-indigo-500 transition-all border border-indigo-500"
                             >
                               Invite
                             </button>
                          </div>
                          <p className="text-[9px] text-zinc-600 italic">Provisioned agents will inherit the default role: <span className="text-indigo-400 font-black">{workspace.defaultRole.replace('_', ' ')}</span></p>
                       </div>
                    </div>
                  </div>
                </SettingsSection>
              )}

              {activeTab === 'billing' && (
                <SettingsSection title="Revenue Node" description="Current subscription status and intelligence resource allocation.">
                   <div className="space-y-6">
                      <div className="p-10 rounded-[3rem] bg-gradient-to-br from-indigo-600 to-purple-700 text-white shadow-2xl shadow-indigo-500/20 relative overflow-hidden group">
                         <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:rotate-12 transition-transform duration-1000">
                             <CreditCard className="w-40 h-40" />
                         </div>
                         <div className="relative z-10">
                            <span className="text-[10px] font-black uppercase opacity-60 tracking-[0.3em] mb-4 block">Active Deployment</span>
                            <div className="flex items-baseline gap-4 mb-8">
                               <h3 className="text-4xl font-black tracking-tighter">{billingSummary.plan}</h3>
                               <p className="text-sm font-bold opacity-60 tracking-widest">RENEWAL: {billingSummary.renewal.toUpperCase()}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-8">
                               <div className="space-y-1">
                                  <span className="text-[11px] font-black uppercase opacity-60 tracking-widest">Resource Credits</span>
                                  <p className="text-2xl font-black tracking-tight">{billingSummary.credits}</p>
                               </div>
                               <div className="space-y-1">
                                  <span className="text-[11px] font-black uppercase opacity-60 tracking-widest">Network Usage</span>
                                  <p className="text-2xl font-black tracking-tight">{billingSummary.usage}</p>
                               </div>
                            </div>
                            <Link to="/billing" className="mt-10 inline-flex items-center gap-2 px-6 py-3 bg-white text-indigo-600 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-zinc-100 shadow-xl transition-all border border-white">
                               Management Console <ChevronRight className="w-4 h-4" />
                            </Link>
                         </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                         <div className="p-6 rounded-3xl bg-zinc-950 border border-zinc-800 space-y-2">
                             <span className="text-[10px] font-black uppercase text-zinc-600 tracking-widest">Billing ID</span>
                             <p className="text-xs font-mono text-white">#DISC_ORG_0921_AF01</p>
                         </div>
                         <div className="p-6 rounded-3xl bg-zinc-950 border border-zinc-800 space-y-2">
                             <span className="text-[10px] font-black uppercase text-zinc-600 tracking-widest">Current Storage</span>
                             <p className="text-xs font-bold text-white tracking-tight">14.2 GB used of 50 GB</p>
                         </div>
                      </div>
                   </div>
                </SettingsSection>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* API Key Modal */}
      <AnimatePresence>
        {showKeyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowKeyModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="px-10 py-10 space-y-8">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-white tracking-tight">Initiate Access Fragment</h3>
                  <p className="text-sm text-zinc-500 italic">Generate a secure connection node for external systems.</p>
                </div>

                {lastGeneratedKey ? (
                  <div className="space-y-6">
                    <div className="p-6 rounded-3xl bg-indigo-600/5 border border-indigo-600/20 space-y-3">
                       <div className="flex items-center gap-2 text-rose-500">
                         <Shield className="w-4 h-4" />
                         <span className="text-[10px] font-black uppercase tracking-widest leading-none">Security Protocol</span>
                       </div>
                       <p className="text-xs text-zinc-400 italic">Key will only be revealed once. Store securely.</p>
                       <div className="p-4 rounded-xl bg-black border border-zinc-800 font-mono text-xs text-indigo-400 break-all select-all flex items-center justify-between">
                         {lastGeneratedKey}
                         <button 
                           onClick={() => {
                             navigator.clipboard.writeText(lastGeneratedKey);
                             toast.success("Key copied");
                           }}
                           className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-500"
                         >
                           <Copy className="w-4 h-4" />
                         </button>
                       </div>
                    </div>
                    <button 
                      onClick={() => setShowKeyModal(false)}
                      className="w-full py-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-white font-bold hover:bg-zinc-800 transition-all shadow-xl"
                    >
                      Close Protocol
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest px-1">Node Identifier</label>
                       <input 
                         type="text" 
                         value={newKeyName}
                         onChange={e => setNewKeyName(e.target.value)}
                         placeholder="e.g. Pipeline Enforcer"
                         className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-indigo-500 transition-all font-medium"
                         autoFocus
                       />
                    </div>
                    <button 
                      onClick={handleCreateApiKey}
                      disabled={!newKeyName}
                      className="w-full py-4 rounded-2xl bg-indigo-600 text-white font-bold hover:bg-indigo-500 disabled:opacity-50 transition-all shadow-2xl shadow-indigo-500/40"
                    >
                      Deploy Access Fragment
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

