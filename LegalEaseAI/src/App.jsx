import React, { useState, Suspense, lazy } from "react";
import { useAuth } from "./contexts/useAuth.js";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster, toast } from "sonner";
import { Loader2 } from "lucide-react";

// Lazy-loaded Pages
const Login = lazy(() => import("./pages/Login"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const ChatPage = lazy(() => import("./pages/ChatPage"));
const UploadPage = lazy(() => import("./pages/UploadPage"));
const CasesPage = lazy(() => import("./pages/CasesPage"));
const LandingPage = lazy(() => import("./pages/LandingPage"));
const PublicLandingPage = lazy(() => import("./pages/PublicLandingPage"));
const AuthIntroPage = lazy(() => import("./pages/AuthIntroPage"));

// Global Components
import { Button } from "./components/ui/Button";
import { 
  LayoutDashboard, 
  MessageSquare, 
  FileBox, 
  Briefcase, 
  Settings, 
  LogOut, 
  Bell, 
  Plus,
  Home,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

// Page Loader Component
const PageLoader = () => (
  <div className="flex h-full w-full items-center justify-center p-12">
    <Loader2 className="w-8 h-8 animate-spin text-primary opacity-50" />
  </div>
);

const NavItem = React.memo(({ icon: Icon, label, page, current, onClick, collapsed }) => {
  const isActive = current === page;
  return (
    <button 
      className={`relative w-full flex items-center ${collapsed ? 'justify-center' : 'gap-3 px-3'} py-2.5 rounded-lg text-sm font-medium transition-colors z-10 ${isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`} 
      onClick={() => onClick(page)}
      title={collapsed ? label : undefined}
    >
      {isActive && (
        <motion.div
          layoutId="sidebar-active"
          className="absolute inset-0 bg-primary/10 border border-primary/20 rounded-lg -z-10"
          initial={false}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
      <Icon size={18} className={`${isActive ? 'text-primary' : 'text-muted-foreground'} shrink-0`} />
      {!collapsed && <span className="truncate">{label}</span>}
    </button>
  );
});

function AuthenticatedApp() {
  const [page, setPage] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(window.innerWidth < 768);
  const { logout, user } = useAuth();

  const titles = {
    landing: "LegalEase AI Overview",
    dashboard: "Dashboard",
    chat: "AI Legal Assistant",
    upload: "Document Analysis",
    cases: "Case Management",
  };

  const noTopbar = page === "chat" || page === "landing";

  const handleLogout = () => {
    toast("Logging out...");
    logout();
  };

  const sidebarVariants = {
    expanded: { width: "240px" },
    collapsed: { width: "72px" }
  };

  const pageVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2, ease: "easeIn" } }
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden text-foreground font-sans selection:bg-primary/20">
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={collapsed ? "collapsed" : "expanded"}
        variants={sidebarVariants}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="shrink-0 border-r border-border bg-card/90 md:bg-card/30 backdrop-blur-md flex flex-col z-50 fixed md:relative h-full"
      >
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-6 w-6 h-6 bg-card border border-border rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors z-30 shadow-sm"
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>

        <div className={`p-6 border-b border-border/50 flex ${collapsed ? 'justify-center px-0' : 'flex-col'} overflow-hidden whitespace-nowrap`}>
          {collapsed ? (
            <div className="font-serif text-xl font-semibold text-primary tracking-tight">LE</div>
          ) : (
            <>
              <div className="font-serif text-xl font-semibold text-primary tracking-tight">LegalEase AI</div>
              <div className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground mt-1 font-medium">Management Platform</div>
            </>
          )}
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-1 overflow-x-hidden">
          {!collapsed && <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 mt-2 px-3">Main</div>}
          <NavItem icon={Home} label="Overview" page="landing" current={page} onClick={setPage} collapsed={collapsed} />
          <NavItem icon={LayoutDashboard} label="Dashboard" page="dashboard" current={page} onClick={setPage} collapsed={collapsed} />
          
          {!collapsed && <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 mt-6 px-3">Tools</div>}
          {collapsed && <div className="my-2 border-b border-border/50" />}
          <NavItem icon={MessageSquare} label="AI Assistant" page="chat" current={page} onClick={setPage} collapsed={collapsed} />
          <NavItem icon={FileBox} label="Documents" page="upload" current={page} onClick={setPage} collapsed={collapsed} />
          <NavItem icon={Briefcase} label="Cases" page="cases" current={page} onClick={setPage} collapsed={collapsed} />
        </div>

        <div className="p-4 border-t border-border/50">
          <button 
            onClick={handleLogout}
            className={`w-full flex items-center ${collapsed ? 'justify-center p-2' : 'gap-3 p-2'} rounded-xl bg-card border border-border hover:border-primary/50 transition-colors group`}
            title={collapsed ? "Log out" : undefined}
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center text-primary-foreground font-medium shrink-0 shadow-sm shadow-primary/20">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            {!collapsed && (
              <>
                <div className="flex-1 min-w-0 text-left">
                  <div className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">{user?.name || 'Legal Team'}</div>
                  <div className="text-xs text-muted-foreground truncate">{user?.email || 'Secure session'}</div>
                </div>
                <LogOut size={16} className="text-muted-foreground group-hover:text-primary transition-colors shrink-0 mr-1" />
              </>
            )}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-background relative overflow-hidden ml-[72px] md:ml-0">
        {!noTopbar && (
          <header className="h-16 shrink-0 border-b border-border bg-background/90 backdrop-blur-sm sticky top-0 z-10 px-8 flex items-center justify-between shadow-sm">
            <h2 className="font-serif text-lg font-medium text-foreground">{titles[page]}</h2>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="gap-2 shrink-0 border-border shadow-sm">
                <Bell size={14} /> Alerts
              </Button>
              {page === "dashboard" && (
                <Button size="sm" className="gap-2 shrink-0 shadow-sm shadow-primary/20">
                  <Plus size={14} /> New case
                </Button>
              )}
            </div>
          </header>
        )}
        
        <div className="flex-1 overflow-y-auto relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={page}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="min-h-full"
            >
              <Suspense fallback={<PageLoader />}>
                {page === "landing" && <LandingPage onNav={setPage} />}
                {page === "dashboard" && <DashboardPage />}
                {page === "chat" && <ChatPage />}
                {page === "upload" && <UploadPage />}
                {page === "cases" && <CasesPage />}
              </Suspense>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

export default function App() {
  const { isLoggedIn, authReady } = useAuth();
  const [publicState, setPublicState] = useState("landing"); // 'landing' | 'auth-intro' | 'login'

  if (!authReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground font-sans text-sm animate-pulse">
        Verifying session...
      </div>
    );
  }

  return (
    <>
      <Toaster theme="dark" position="bottom-right" className="font-sans" />
      <Suspense fallback={<PageLoader />}>
        {!isLoggedIn ? (
          publicState === "landing" ? <PublicLandingPage onNavigate={setPublicState} /> :
          publicState === "auth-intro" ? <AuthIntroPage onNavigate={setPublicState} /> :
          <Login />
        ) : (
          <AuthenticatedApp />
        )}
      </Suspense>
    </>
  );
}
