import { Link } from "wouter";

interface SidebarProps {
  currentPath: string;
}

const Sidebar = ({ currentPath }: SidebarProps) => {
  return (
    <aside className="bg-white shadow-lg md:w-64 w-full md:min-h-screen z-10">
      <div className="p-4 flex items-center gap-3 border-b border-slate-100">
        <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
          <i className="ri-bar-chart-box-line text-white text-xl"></i>
        </div>
        <h1 className="text-xl font-bold">SocialAnalytics</h1>
      </div>
      
      <nav className="p-2">
        <ul className="space-y-1">
          <li>
            <Link href="/">
              <a className={`flex items-center gap-3 p-3 rounded-lg ${
                currentPath === "/" ? "bg-blue-50 text-primary font-medium" : "hover:bg-slate-50 transition-colors"
              }`}>
                <i className="ri-user-star-line text-xl"></i>
                <span>Top Users</span>
              </a>
            </Link>
          </li>
          <li>
            <Link href="/trending">
              <a className={`flex items-center gap-3 p-3 rounded-lg ${
                currentPath === "/trending" ? "bg-blue-50 text-primary font-medium" : "hover:bg-slate-50 transition-colors"
              }`}>
                <i className="ri-fire-line text-xl"></i>
                <span>Trending Posts</span>
              </a>
            </Link>
          </li>
          <li>
            <Link href="/feed">
              <a className={`flex items-center gap-3 p-3 rounded-lg ${
                currentPath === "/feed" ? "bg-blue-50 text-primary font-medium" : "hover:bg-slate-50 transition-colors"
              }`}>
                <i className="ri-chat-3-line text-xl"></i>
                <span>Feed</span>
              </a>
            </Link>
          </li>
        </ul>
      </nav>
      
      <div className="mt-auto p-4 border-t border-slate-100 hidden md:block">
        <div className="text-xs text-slate-500">
          <p>Connected to local API</p>
          <p>http://localhost:3000</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
