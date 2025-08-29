import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 dark:from-slate-950 dark:via-blue-950 dark:to-slate-950 transition-all duration-500 responsive-padding">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-white mb-4 animate-fade-in responsive-text">404</h1>
        <p className="text-base md:text-xl text-gray-300 mb-8 animate-fade-in delay-100 responsive-text">Page Not Found</p>
        <a href="/" className="text-blue-500 hover:text-blue-700 underline">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
