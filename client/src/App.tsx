import { Switch, Route, Link, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Card } from "@/components/ui/card";
import { 
  Calendar, 
  BarChart3, 
  Bell, 
  Settings as SettingsIcon,
  Users,
  Menu
} from "lucide-react";
import Schedule from "@/pages/schedule";
import Dashboard from "@/pages/dashboard";
import Settings from "@/pages/settings";
import Notifications from "@/pages/notifications";
import NotFound from "@/pages/not-found";

function Navigation() {
  const [location] = useLocation();
  
  const navItems = [
    { path: "/", icon: BarChart3, label: "Dashboard" },
    { path: "/schedule", icon: Calendar, label: "Cronograma" },
    { path: "/notifications", icon: Bell, label: "Notificações" },
    { path: "/settings", icon: SettingsIcon, label: "Configurações" },
  ];

  return (
    <Card className="w-64 h-screen rounded-none border-r border-gray-200 bg-white shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <Users className="text-2xl text-blue-600" />
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Scrum Team</h2>
            <p className="text-sm text-gray-500">Schedule Manager</p>
          </div>
        </div>
      </div>
      
      <nav className="p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = location === item.path || (item.path === "/" && location === "/");
          return (
            <Link key={item.path} href={item.path}>
              <div className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                isActive 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}>
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>
    </Card>
  );
}

function Router() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Navigation />
      <div className="flex-1">
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/schedule" component={Schedule} />
          <Route path="/notifications" component={Notifications} />
          <Route path="/settings" component={Settings} />
          <Route component={NotFound} />
        </Switch>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
