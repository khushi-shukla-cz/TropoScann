import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { Cloud, Satellite, AlertTriangle, TrendingUp, Eye, Download, MapPin, Clock, Activity, Zap, Bell, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import DetectionInterface from "@/components/DetectionInterface";
import HistoricalCases from "@/components/HistoricalCases";
import CycloneSimulator from "@/components/CycloneSimulator";
import ModelValidation from "@/components/ModelValidation";
import { useNavigate, useLocation } from "react-router-dom";
const Index = () => {
  const [metrics, setMetrics] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  // Read tab from URL
  const params = new URLSearchParams(location.search);
  const tab = params.get('tab');
  const [activeTab, setActiveTab] = useState(tab || "home");

  useEffect(() => {
    axios.get("/api/dashboard-metrics")
      .then(res => setMetrics(res.data))
      .catch(() => setMetrics(null));
  }, []);

  // Update activeTab when URL changes
  useEffect(() => {
    setActiveTab(tab || "home");
  }, [tab]);

  return (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 dark:from-slate-950 dark:via-blue-950 dark:to-slate-950 transition-all duration-500 responsive-padding">

      {/* Main Content */}
      {activeTab === "home" && (
        <div className="animate-fade-in responsive-padding">
          <section className="container mx-auto px-4 py-8 md:py-16 responsive-padding">
            <div className="text-center mb-8 md:mb-16 animate-scale-in responsive-text">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 animate-fade-in delay-100 responsive-text">
                Early Warning System for <span className="text-blue-400">Tropical Storms</span>
              </h2>
              <p className="text-base md:text-xl text-gray-300 mb-8 max-w-3xl mx-auto animate-fade-in delay-200 responsive-text">
                Using AI and INSAT satellite data to detect dangerous cloud clusters before they develop into cyclones.
              </p>
              <div className="flex flex-col md:flex-row justify-center space-y-2 md:space-y-0 md:space-x-4 animate-fade-in delay-300">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl" onClick={() => setActiveTab("detection")}> <Eye className="mr-2 h-5 w-5" /> Try Detection </Button>
                <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 transform hover:scale-105 transition-all duration-300" onClick={() => navigate("/CycloneSimulator")}> <Zap className="mr-2 h-5 w-5" /> Cyclone Simulator </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8 md:mb-16 responsive-grid">
              {[
                { icon: Satellite, title: "INSAT Data Processing", description: "Real-time infrared satellite images from INSAT-3D/3DR processed every 30 minutes for temperature and cloud pattern analysis.", color: "blue", delay: "delay-100" },
                { icon: Cloud, title: "AI Detection", description: "U-Net deep learning model identifies deep convection zones and organized cloud clusters with pixel-level precision.", color: "green", delay: "delay-300" },
                { icon: AlertTriangle, title: "Risk Assessment", description: "Automated risk classification and alert generation for meteorologists and disaster management agencies.", color: "red", delay: "delay-500" },
              ].map((item, index) => (
                <Card key={index} className={`bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-500 transform hover:scale-105 hover:shadow-xl animate-fade-in ${item.delay}`}>
                  <CardHeader>
                    <item.icon className={`h-12 w-12 text-${item.color}-400 mb-4`} />
                    <CardTitle className="text-white">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Card className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-blue-400/30 hover:shadow-2xl transition-all duration-500 animate-fade-in delay-700 responsive-padding responsive-text w-full container mx-auto px-4 py-8 md:py-16">
              <CardContent className="p-4 md:p-8 text-center responsive-text">
                <h3 className="text-2xl font-bold text-white mb-4">Real-World Impact</h3>
                <p className="text-lg text-gray-200 mb-6">"Early detection can save thousands of lives. In 2023, Cyclone Biparjoy was detected by our system 2 hours before official warnings, providing crucial time for evacuation and preparation."</p>
                <div className="flex justify-center items-center space-x-8">
                  <div className="text-center transform hover:scale-110 transition-all duration-300">
                    <div className="text-2xl font-bold text-blue-400">70%</div>
                    <div className="text-sm text-gray-300">India's rainfall from tropical systems</div>
                  </div>
                  <div className="text-center transform hover:scale-110 transition-all duration-300">
                    <div className="text-2xl font-bold text-green-400">500M+</div>
                    <div className="text-sm text-gray-300">People in vulnerable coastal areas</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-green-600/20 to-blue-600/20 border-green-400/30 hover:shadow-2xl transition-all duration-500 animate-fade-in delay-800 responsive-padding responsive-text w-full container mx-auto px-4 py-8 md:py-16 mt-8">
              <CardContent className="p-4 md:p-8 text-center responsive-text">
                <ModelValidation />
              </CardContent>
            </Card>
          </section>
        </div>
      )}
      {activeTab === "detection" && (
        <div className="animate-fade-in responsive-padding">
          <DetectionInterface />
        </div>
      )}
      {activeTab === "cases" && (
        <div className="animate-fade-in responsive-padding">
          <HistoricalCases />
        </div>
      )}
      {/* Footer */}
      <footer className="bg-black/20 border-t border-white/10 py-4 md:py-8 animate-fade-in responsive-padding">
        <div className="container mx-auto px-4 text-center responsive-text">
          <p className="text-gray-400">TropoScan - AI-Powered Tropical Storm Detection System</p>
          <p className="text-gray-500 mt-2">Built for early disaster detection and meteorological research</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
