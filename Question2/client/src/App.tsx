import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import TopUsers from "@/pages/TopUsers";
import TrendingPosts from "@/pages/TrendingPosts";
import Feed from "@/pages/Feed";
import Sidebar from "@/components/layout/Sidebar";
import MobileNav from "@/components/layout/MobileNav";

function Router() {
  const [location] = useLocation();

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <Sidebar currentPath={location} />
      
      <main className="flex-1 p-4 md:p-6 overflow-auto">
        <Switch>
          <Route path="/" component={TopUsers} />
          <Route path="/trending" component={TrendingPosts} />
          <Route path="/feed" component={Feed} />
          <Route component={NotFound} />
        </Switch>
        
        <MobileNav currentPath={location} />
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
