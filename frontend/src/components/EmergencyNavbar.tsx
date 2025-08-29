import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Satellite, 
  AlertTriangle, 
  Eye,
  Activity,
  FileText,
  Cloud,
  TrendingUp,
  Bell,
  Moon,
  Sun,
  Menu
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

interface EmergencyNavbarProps {
  currentPage?: string;
}

const EmergencyNavbar: React.FC<EmergencyNavbarProps> = ({ currentPage = "emergency" }) => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [showMobileMenu, setShowMobileMenu] = React.useState(false);

  const handleNavigation = (tab: string) => {
    switch (tab) {
      case "home":
        navigate('/');
        break;
      case "detection":
        navigate('/?tab=detection');
        break;
      case "simulator":
        navigate('/CycloneSimulator');
        break;
      case "cases":
        navigate('/?tab=cases');
        break;
      case "emergency":
        navigate('/emergency');
        break;
      case "trends":
        navigate('/trending');
        break;
      case "alerts":
        navigate('/notifications');
        break;
      default:
        navigate('/');
    }
  };

  const getActiveTab = () => {
    const path = window.location.pathname;
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');

    if (path === '/trending') return "trends";
    if (path === '/notifications') return "alerts";
    if (path === '/CycloneSimulator') return "simulator";
    if (path === '/') {
      if (tab === 'detection') return "detection";
      if (tab === 'cases') return "cases";
      return "home";
    }
    if (path === '/emergency' || currentPage === "emergency" || currentPage === "overview") return "emergency";
    if (currentPage === "contacts") return "emergency";
    if (currentPage === "evacuation") return "emergency";
    if (currentPage === "preparedness") return "emergency";
    return "home";
  };

  const activeTab = getActiveTab();

  return (
    <nav className="bg-black/20 backdrop-blur-md border-b border-white/10 sticky top-0 z-50 transition-all duration-300">
      <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
          <div className="flex items-center space-x-2 animate-fade-in">
            <Satellite className="h-8 w-8 text-blue-400" />
            <h1 className="text-lg sm:text-2xl font-bold text-white">TropoScan</h1>
            <Badge variant="secondary" className="ml-2 text-xs sm:text-base">
              AI-Powered
            </Badge>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4 mt-2 sm:mt-0">
            {/* Mobile menu toggle */}
            <div className="sm:hidden">
              <Button
                variant="ghost"
                size="icon"
                aria-label="Open navigation menu"
                onClick={() => setShowMobileMenu((prev) => !prev)}
                className="text-white"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </div>
            {/* Desktop navigation */}
            <div className="hidden sm:flex space-x-2">
              {/* ...existing navigation buttons... */}
              <button
                onClick={() => handleNavigation("home")}
                className={`px-2 py-1 sm:px-4 sm:py-2 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center space-x-1 sm:space-x-2 text-xs sm:text-base ${
                  activeTab === "home" 
                    ? "bg-blue-600 text-white shadow-lg animate-scale-in" 
                    : "text-gray-300 hover:text-white hover:bg-white/10"
                }`}
              >
                <Cloud className="h-4 w-4" />
                <span>Home</span>
              </button>
              <button
                onClick={() => handleNavigation("detection")}
                className={`px-2 py-1 sm:px-4 sm:py-2 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center space-x-1 sm:space-x-2 text-xs sm:text-base ${
                  activeTab === "detection" 
                    ? "bg-blue-600 text-white shadow-lg animate-scale-in" 
                    : "text-gray-300 hover:text-white hover:bg-white/10"
                }`}
              >
                <Eye className="h-4 w-4" />
                <span>Detection</span>
              </button>
              <button
                onClick={() => handleNavigation("cases")}
                className={`px-2 py-1 sm:px-4 sm:py-2 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center space-x-1 sm:space-x-2 text-xs sm:text-base ${
                  activeTab === "cases" 
                    ? "bg-blue-600 text-white shadow-lg animate-scale-in" 
                    : "text-gray-300 hover:text-white hover:bg-white/10"
                }`}
              >
                <FileText className="h-4 w-4" />
                <span>Cases</span>
              </button>
              <button
                onClick={() => handleNavigation("emergency")}
                className={`px-2 py-1 sm:px-4 sm:py-2 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center space-x-1 sm:space-x-2 text-xs sm:text-base ${
                  activeTab === "emergency" 
                    ? "bg-blue-600 text-white shadow-lg animate-scale-in" 
                    : "text-gray-300 hover:text-white hover:bg-white/10"
                }`}
              >
                <AlertTriangle className="h-4 w-4" />
                <span>Emergency</span>
              </button>
              <button
                onClick={() => handleNavigation("simulator")}
                className={`px-2 py-1 sm:px-4 sm:py-2 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center space-x-1 sm:space-x-2 text-xs sm:text-base ${
                  activeTab === "simulator" 
                    ? "bg-blue-600 text-white shadow-lg animate-scale-in" 
                    : "text-gray-300 hover:text-white hover:bg-white/10"
                }`}
              >
                <Activity className="h-4 w-4" />
                <span>Simulator</span>
              </button>
              <button
                onClick={() => handleNavigation("trends")}
                className={`px-2 py-1 sm:px-4 sm:py-2 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center space-x-1 sm:space-x-2 text-xs sm:text-base ${
                  activeTab === "trends" 
                    ? "bg-blue-600 text-white shadow-lg animate-scale-in" 
                    : "text-gray-300 hover:text-white hover:bg-white/10"
                }`}
              >
                <TrendingUp className="h-4 w-4" />
                <span>Trends</span>
              </button>
              <button
                onClick={() => handleNavigation("alerts")}
                className={`px-2 py-1 sm:px-4 sm:py-2 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center space-x-1 sm:space-x-2 text-xs sm:text-base ${
                  activeTab === "alerts" 
                    ? "bg-blue-600 text-white shadow-lg animate-scale-in" 
                    : "text-gray-300 hover:text-white hover:bg-white/10"
                }`}
              >
                <Bell className="h-4 w-4" />
                <span>Alerts</span>
              </button>
            </div>
          </div>
        </div>
        {/* Mobile navigation menu */}
        {showMobileMenu && (
          <div className="sm:hidden mt-2">
            <div className="flex flex-col gap-2">
              {/* ...existing navigation buttons for mobile... */}
              <button
                onClick={() => handleNavigation("home")}
                className={`px-2 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 text-xs ${
                  activeTab === "home" 
                    ? "bg-blue-600 text-white shadow-lg animate-scale-in" 
                    : "text-gray-300 hover:text-white hover:bg-white/10"
                }`}
              >
                <Cloud className="h-4 w-4" />
                <span>Home</span>
              </button>
              <button
                onClick={() => handleNavigation("detection")}
                className={`px-2 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 text-xs ${
                  activeTab === "detection" 
                    ? "bg-blue-600 text-white shadow-lg animate-scale-in" 
                    : "text-gray-300 hover:text-white hover:bg-white/10"
                }`}
              >
                <Eye className="h-4 w-4" />
                <span>Detection</span>
              </button>
              <button
                onClick={() => handleNavigation("cases")}
                className={`px-2 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 text-xs ${
                  activeTab === "cases" 
                    ? "bg-blue-600 text-white shadow-lg animate-scale-in" 
                    : "text-gray-300 hover:text-white hover:bg-white/10"
                }`}
              >
                <FileText className="h-4 w-4" />
                <span>Cases</span>
              </button>
              <button
                onClick={() => handleNavigation("emergency")}
                className={`px-2 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 text-xs ${
                  activeTab === "emergency" 
                    ? "bg-blue-600 text-white shadow-lg animate-scale-in" 
                    : "text-gray-300 hover:text-white hover:bg-white/10"
                }`}
              >
                <AlertTriangle className="h-4 w-4" />
                <span>Emergency</span>
              </button>
              <button
                onClick={() => handleNavigation("simulator")}
                className={`px-2 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 text-xs ${
                  activeTab === "simulator" 
                    ? "bg-blue-600 text-white shadow-lg animate-scale-in" 
                    : "text-gray-300 hover:text-white hover:bg-white/10"
                }`}
              >
                <Activity className="h-4 w-4" />
                <span>Simulator</span>
              </button>
              <button
                onClick={() => handleNavigation("trends")}
                className={`px-2 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 text-xs ${
                  activeTab === "trends" 
                    ? "bg-blue-600 text-white shadow-lg animate-scale-in" 
                    : "text-gray-300 hover:text-white hover:bg-white/10"
                }`}
              >
                <TrendingUp className="h-4 w-4" />
                <span>Trends</span>
              </button>
              <button
                onClick={() => handleNavigation("alerts")}
                className={`px-2 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 text-xs ${
                  activeTab === "alerts" 
                    ? "bg-blue-600 text-white shadow-lg animate-scale-in" 
                    : "text-gray-300 hover:text-white hover:bg-white/10"
                }`}
              >
                <Bell className="h-4 w-4" />
                <span>Alerts</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default EmergencyNavbar;