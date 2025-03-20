import { Link } from "wouter";

interface MobileNavProps {
  currentPath: string;
}

const MobileNav = ({ currentPath }: MobileNavProps) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t z-50">
      <div className="flex justify-around">
        <Link href="/">
          <a className={`flex flex-col items-center p-3 ${
            currentPath === "/" ? "text-primary" : "text-slate-600"
          }`}>
            <i className="ri-user-star-line text-xl"></i>
            <span className="text-xs mt-1">Top Users</span>
          </a>
        </Link>
        <Link href="/trending">
          <a className={`flex flex-col items-center p-3 ${
            currentPath === "/trending" ? "text-primary" : "text-slate-600"
          }`}>
            <i className="ri-fire-line text-xl"></i>
            <span className="text-xs mt-1">Trending</span>
          </a>
        </Link>
        <Link href="/feed">
          <a className={`flex flex-col items-center p-3 ${
            currentPath === "/feed" ? "text-primary" : "text-slate-600"
          }`}>
            <i className="ri-chat-3-line text-xl"></i>
            <span className="text-xs mt-1">Feed</span>
          </a>
        </Link>
      </div>
    </div>
  );
};

export default MobileNav;
