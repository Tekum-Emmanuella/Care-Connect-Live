
import { Link, useLocation } from "wouter";
import { Home, Building2, UserRound, User, Menu, X, LogOut } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import logo from "@assets/generated_images/vibrant_abstract_medical_logo_symbol.png";
import { useAuth } from "@/lib/auth";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { icon: Home, label: "Dashboard", path: "/dashboard" },
    { icon: Building2, label: "Hospitals", path: "/hospitals" },
    { icon: UserRound, label: "Doctors", path: "/doctors" },
    { icon: User, label: "My Records", path: "/records" },
  ];

  const isActive = (path: string) => location === path;

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-100 p-6 fixed h-full z-20">
        <div className="flex items-center gap-3 mb-10">
          <img src={logo} alt="CamHealth Logo" className="w-10 h-10 object-contain" />
          <h1 className="font-heading font-bold text-xl text-primary tracking-tight">CAM HEALTH</h1>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <Link key={item.path} href={item.path}>
              <div
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer group ${
                  isActive(item.path)
                    ? "bg-primary/10 text-primary font-medium shadow-sm"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive(item.path) ? "text-primary" : "text-gray-400 group-hover:text-gray-600"}`} />
                {item.label}
              </div>
            </Link>
          ))}
        </nav>

        <div className="pt-6 border-t border-gray-100">
          <div 
            onClick={() => {
              useAuth.getState().logout();
              window.location.href = "/";
            }}
            className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-destructive hover:bg-red-50 rounded-xl cursor-pointer transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Log Out
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between p-4 bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <img src={logo} alt="CamHealth Logo" className="w-8 h-8 object-contain" />
          <h1 className="font-heading font-bold text-lg text-primary">CAM HEALTH</h1>
        </div>
        
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-gray-600">
              <Menu className="w-6 h-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px] p-0">
            <div className="flex flex-col h-full p-6">
              <div className="flex items-center gap-3 mb-10">
                <img src={logo} alt="CamHealth Logo" className="w-10 h-10 object-contain" />
                <h1 className="font-heading font-bold text-xl text-primary">CAM HEALTH</h1>
              </div>
              <nav className="flex-1 space-y-2">
                {navItems.map((item) => (
                  <Link key={item.path} href={item.path} onClick={() => setIsOpen(false)}>
                    <div
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer ${
                        isActive(item.path)
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      {item.label}
                    </div>
                  </Link>
                ))}
              </nav>
              <div className="pt-6 border-t border-gray-100">
                <div 
                  onClick={() => {
                    useAuth.getState().logout();
                    window.location.href = "/";
                  }}
                  className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-destructive rounded-xl cursor-pointer"
                >
                  <LogOut className="w-5 h-5" />
                  Log Out
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </header>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 pb-24 md:pb-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-2 z-30 flex justify-around items-center safe-area-pb">
        {navItems.map((item) => (
          <Link key={item.path} href={item.path}>
            <div className={`flex flex-col items-center p-2 rounded-lg transition-colors ${isActive(item.path) ? "text-primary" : "text-gray-400 hover:text-gray-600"}`}>
              <item.icon className={`w-6 h-6 ${isActive(item.path) ? "fill-current" : ""}`} strokeWidth={isActive(item.path) ? 2.5 : 2} />
              <span className="text-[10px] font-medium mt-1">{item.label}</span>
            </div>
          </Link>
        ))}
      </nav>
    </div>
  );
}
