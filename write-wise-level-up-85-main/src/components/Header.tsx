import { BookOpen } from "lucide-react";
const Header = () => {
  return <header className="bg-white shadow-sm py-4 px-6">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BookOpen size={24} className="text-emerald-500" />
          <span className="font-bold text-xl">Let's Do It English</span>
        </div>
        <nav>
          
        </nav>
      </div>
    </header>;
};
export default Header;