import { AlertTriangle, CheckCircle, AlertCircle, Thermometer, Cloud, TrendingUp, MapPin, Clock, Layers, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface RiskClassificationProps {
  riskLevel: "low" | "moderate" | "high";
  temperature: string;
  clusterArea: number;
  confidence: number;
  prediction: string;
  modelType?: string;
  coveragePercent?: number;
  calamityType?: string;
  calamitySeverity?: string;
  timestamp?: string;
  latitude?: number;
  longitude?: number;
  region?: string;
  historicalComparison?: string;
  alertLevel?: string;
  confidenceBreakdown?: { convection: number; organization: number; development: number };
  satelliteSource?: string;
  imageQuality?: string;
}

const RiskClassification = ({ 
  riskLevel = "moderate", 
  temperature = "-62.7°C", 
  clusterArea = 1246, 
  confidence = 71, 
  prediction = "Organized cloud cluster identified with moderate convection (-62.7°C). System shows potential for intensification. Continue monitoring for 12-24 hours.",
  modelType = "mock_demo",
  coveragePercent = 8.20,
  calamityType = "Local Rainstorm",
  calamitySeverity = "MODERATE",
  timestamp = "2024-08-24 14:30 UTC",
  latitude = 23.5,
  longitude = 68.2,
  region = "Arabian Sea",
  satelliteSource = "INSAT-3D",
  imageQuality = "High"
}: RiskClassificationProps) => {
  
  const getRiskConfig = (level: string) => {
    switch (level) {
      case "high":
        return {
          color: "red",
          icon: AlertTriangle,
          bgClass: "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-red-400/30",
          textClass: "text-red-400",
          description: "Deep convection detected - Potential cyclone formation",
          action: "Immediate meteorological attention required"
        };
      case "moderate":
        return {
          color: "amber",
          icon: AlertCircle,
          bgClass: "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-amber-400/30",
          textClass: "text-amber-400",
          description: "Organized cloud cluster - Monitor for intensification",
          action: "Continue monitoring - Prepare for possible escalation"
        };
      default:
        return {
          color: "emerald",
          icon: CheckCircle,
          bgClass: "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-emerald-400/30",
          textClass: "text-emerald-400",
          description: "Normal cloud patterns - No immediate threat",
          action: "Routine monitoring sufficient"
        };
    }
  };

  const config = getRiskConfig(riskLevel);
  const IconComponent = config.icon;
  
  const getEventType = (temp: string): string => {
    const tempValue = parseInt(temp);
    if (tempValue < -70) {
      return "Cyclonic Cluster detected";
    } else if (tempValue < -65) {
      return "Severe Thunderstorm detected";
    } else if (tempValue < -60) {
      return "Local Rainstorm detected";
    } else {
      return "Low-Risk Cloud Cluster detected";
    }
  };
  
  const eventTypeDescription = getEventType(temperature);

  return (
    <div className="w-full">
      <Card className={`${config.bgClass} shadow-xl border transition-all duration-300 hover:shadow-2xl backdrop-blur-sm`}>
        
        {/* Header */}
        <CardHeader className="pb-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <CardTitle className="text-white flex items-center">
              <div className={`p-3 rounded-full ${config.textClass} bg-white/10 mr-4 flex-shrink-0`}>
                <IconComponent className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl lg:text-3xl font-bold">Risk Assessment</div>
                <div className="text-sm text-gray-300 mt-1 flex items-center gap-4">
                  {region && (
                    <span className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {region}
                    </span>
                  )}
                  <span className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {timestamp}
                  </span>
                </div>
              </div>
            </CardTitle>
            <Badge 
              className={`text-lg font-bold px-6 py-3 whitespace-nowrap ${
                riskLevel === "high" ? "bg-red-600 hover:bg-red-700" : 
                riskLevel === "moderate" ? "bg-amber-600 hover:bg-amber-700" : 
                "bg-emerald-600 hover:bg-emerald-700"
              } shadow-lg`}
            >
              {riskLevel.toUpperCase()} RISK
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          
          {/* Event Description */}
          <div className="bg-slate-800/40 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div className="flex-1">
                <h3 className={`text-xl lg:text-2xl font-bold ${config.textClass} mb-2 flex items-center`}>
                  <Activity className="mr-3 h-5 w-5 lg:h-6 lg:w-6" />
                  {eventTypeDescription}
                </h3>
                <p className="text-gray-300 text-base lg:text-lg leading-relaxed">
                  {config.action}
                </p>
              </div>
              <div className="text-left lg:text-right flex-shrink-0 bg-slate-900/30 rounded-lg p-3 lg:bg-transparent lg:p-0">
                <div className="text-white font-semibold text-sm">Source: {satelliteSource}</div>
                <div className="text-gray-400 text-sm">Quality: {imageQuality}</div>
              </div>
            </div>
          </div>

          {/* Metrics Grid - 2x2 layout */}
          <div className="grid grid-cols-2 gap-4">
            
            {/* Temperature Card */}
            <div className="bg-slate-800/60 rounded-xl p-4 lg:p-6 border border-slate-700/50 hover:border-blue-400/50 transition-all duration-300">
              <div className="flex items-center mb-3">
                <div className="p-2 bg-blue-500/20 rounded-lg mr-3">
                  <Thermometer className="h-4 w-4 lg:h-5 lg:w-5 text-blue-400" />
                </div>
                <span className="text-gray-300 font-semibold text-sm lg:text-base">Temperature</span>
              </div>
              <div className="text-xl lg:text-2xl font-bold text-white mb-2">{temperature}</div>
              <div className="text-sm text-blue-300 mb-3">
                {parseInt(temperature) < -70 ? "Very Cold - High Altitude" : 
                 parseInt(temperature) < -60 ? "Cold - Storm Clouds" : "Moderate"}
              </div>
              <div className="h-1 bg-slate-700/50 rounded-full">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all duration-1000"
                  style={{ width: `${Math.min(100, Math.abs(parseInt(temperature)))}%` }}
                ></div>
              </div>
            </div>
            
            {/* Cluster Area Card */}
            <div className="bg-slate-800/60 rounded-xl p-4 lg:p-6 border border-slate-700/50 hover:border-purple-400/50 transition-all duration-300">
              <div className="flex items-center mb-3">
                <div className="p-2 bg-purple-500/20 rounded-lg mr-3">
                  <Cloud className="h-4 w-4 lg:h-5 lg:w-5 text-purple-400" />
                </div>
                <span className="text-gray-300 font-semibold text-sm lg:text-base">Cluster Area</span>
              </div>
              <div className="text-xl lg:text-2xl font-bold text-white mb-2">{clusterArea} km²</div>
              <div className="text-sm text-purple-300 mb-3">
                {clusterArea > 2000 ? "Large System" : 
                 clusterArea > 1000 ? "Medium Cluster" : "Small Formation"}
              </div>
              <div className="h-1 bg-slate-700/50 rounded-full">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full transition-all duration-1000"
                  style={{ width: `${Math.min(100, clusterArea / 30)}%` }}
                ></div>
              </div>
            </div>
            
            {/* Coverage Card */}
            {coveragePercent !== undefined && (
              <div className="bg-slate-800/60 rounded-xl p-4 lg:p-6 border border-slate-700/50 hover:border-indigo-400/50 transition-all duration-300">
                <div className="flex items-center mb-3">
                  <div className="p-2 bg-indigo-500/20 rounded-lg mr-3">
                    <Layers className="h-4 w-4 lg:h-5 lg:w-5 text-indigo-400" />
                  </div>
                  <span className="text-gray-300 font-semibold text-sm lg:text-base">Coverage</span>
                </div>
                <div className="text-xl lg:text-2xl font-bold text-white mb-2">{coveragePercent.toFixed(1)}%</div>
                <div className="text-sm text-indigo-300 mb-3">
                  {coveragePercent > 30 ? "Extensive" : 
                   coveragePercent > 15 ? "Significant" : 
                   coveragePercent > 5 ? "Moderate" : "Minimal"}
                </div>
                <div className="h-1 bg-slate-700/50 rounded-full">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-full transition-all duration-1000"
                    style={{ width: `${coveragePercent * 3}%` }}
                  ></div>
                </div>
              </div>
            )}
            
            {/* Confidence Card */}
            <div className="bg-slate-800/60 rounded-xl p-4 lg:p-6 border border-slate-700/50 hover:border-emerald-400/50 transition-all duration-300">
              <div className="flex items-center mb-3">
                <div className="p-2 bg-emerald-500/20 rounded-lg mr-3">
                  <TrendingUp className="h-4 w-4 lg:h-5 lg:w-5 text-emerald-400" />
                </div>
                <span className="text-gray-300 font-semibold text-sm lg:text-base">Confidence</span>
              </div>
              <div className="text-xl lg:text-2xl font-bold text-white mb-2">{confidence}%</div>
              <div className="text-sm text-emerald-300 mb-3">
                {confidence > 80 ? "Very High" : confidence > 60 ? "High" : "Moderate"}
              </div>
              <div>
                <Progress 
                  value={confidence} 
                  className="h-2 bg-slate-700/50" 
                />
              </div>
            </div>
          </div>

          {/* Calamity Classification */}
          {calamityType && (
            <div className="bg-slate-800/60 rounded-xl p-6 border border-slate-700/50 backdrop-blur-sm">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                <h4 className="text-white font-bold text-xl flex items-center">
                  <span className="text-2xl mr-3">
                    {calamityType.includes("Cyclonic") ? "🌪️" : 
                     calamityType.includes("Thunder") ? "⛈️" : 
                     calamityType.includes("Rain") ? "🌧️" : "☁️"}
                  </span>
                  Event Classification
                </h4>
                <Badge 
                  className={`text-sm font-bold px-4 py-2 ${
                    calamitySeverity === "EXTREME" ? "bg-red-600 hover:bg-red-700" : 
                    calamitySeverity === "HIGH" ? "bg-orange-600 hover:bg-orange-700" : 
                    calamitySeverity === "MODERATE" ? "bg-amber-600 hover:bg-amber-700" : "bg-emerald-600 hover:bg-emerald-700"
                  } shadow-lg`}
                >
                  {calamitySeverity}
                </Badge>
              </div>
              
              <div className="text-xl lg:text-2xl font-bold mb-4">
                <span className={`${
                  calamitySeverity === "EXTREME" ? "text-red-400" : 
                  calamitySeverity === "HIGH" ? "text-orange-400" : 
                  calamitySeverity === "MODERATE" ? "text-amber-400" : "text-emerald-400"
                }`}>
                  {calamityType}
                </span>
              </div>
              
              <p className="text-gray-300 text-base lg:text-lg mb-6 leading-relaxed">
                {calamitySeverity === "EXTREME" ? 
                  "High-intensity cyclonic formation with deep convection patterns detected" :
                 calamitySeverity === "HIGH" ?
                  "Organized severe convective system showing rapid development" :
                 calamitySeverity === "MODERATE" ?
                  "Localized heavy precipitation system with moderate intensity" :
                  "Normal cloud formation with minimal atmospheric disturbance"
                }
              </p>
              
              <div className="bg-slate-900/60 p-4 rounded-lg border border-slate-700/50">
                <div className="text-sm font-semibold text-gray-300 mb-3">Classification Criteria:</div>
                <div className="text-sm text-gray-400 space-y-2">
                  <div>• <strong>Cyclonic Cluster:</strong> Area &gt; 1500 km² &amp; Temperature &lt; -70°C</div>
                  <div>• <strong>Severe Thunderstorm:</strong> 500 &lt; Area ≤ 1500 km² &amp; Temperature &lt; -65°C</div>
                  <div>• <strong>Local Rainstorm:</strong> 200 &lt; Area ≤ 500 km² &amp; Temperature &lt; -60°C</div>
                  <div>• <strong>Low-Risk Cluster:</strong> All other conditions</div>
                </div>
              </div>
            </div>
          )}

          {/* Risk Indicators */}
          <div className="bg-slate-800/60 rounded-xl p-6 border border-slate-700/50 backdrop-blur-sm">
            <h4 className="text-white font-bold text-xl mb-6 flex items-center">
              <Activity className="mr-3 h-5 w-5" />
              Risk Analysis Matrix
            </h4>
            <div className="space-y-4">
              
              {/* Deep Convection */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-slate-800/40 rounded-lg border border-slate-700/40 hover:border-slate-600/60 transition-all duration-300 gap-3 sm:gap-0">
                <div className="flex items-center">
                  <Thermometer className="h-4 w-4 mr-3 text-blue-400" />
                  <span className="text-gray-300 font-medium text-base">Deep Convection Analysis</span>
                </div>
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-3 shadow-lg ${
                    parseInt(temperature) < -70 ? "bg-red-500 shadow-red-500/50" : 
                    parseInt(temperature) < -60 ? "bg-amber-500 shadow-amber-500/50" : "bg-emerald-500 shadow-emerald-500/50"
                  }`}></div>
                  <span className={`font-semibold text-sm ${
                    parseInt(temperature) < -70 ? "text-red-400" : 
                    parseInt(temperature) < -60 ? "text-amber-400" : "text-emerald-400"
                  }`}>
                    {parseInt(temperature) < -70 ? "Critical Activity" : 
                     parseInt(temperature) < -60 ? "Active Development" : "Stable Conditions"}
                  </span>
                </div>
              </div>
              
              {/* System Organization */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-slate-800/40 rounded-lg border border-slate-700/40 hover:border-slate-600/60 transition-all duration-300 gap-3 sm:gap-0">
                <div className="flex items-center">
                  <Cloud className="h-4 w-4 mr-3 text-purple-400" />
                  <span className="text-gray-300 font-medium text-base">System Organization</span>
                </div>
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-3 shadow-lg ${
                    clusterArea > 2000 ? "bg-red-500 shadow-red-500/50" : 
                    clusterArea > 1000 ? "bg-amber-500 shadow-amber-500/50" : "bg-emerald-500 shadow-emerald-500/50"
                  }`}></div>
                  <span className={`font-semibold text-sm ${
                    clusterArea > 2000 ? "text-red-400" : 
                    clusterArea > 1000 ? "text-amber-400" : "text-emerald-400"
                  }`}>
                    {clusterArea > 2000 ? "Highly Organized" : 
                     clusterArea > 1000 ? "Moderately Organized" : "Loosely Organized"}
                  </span>
                </div>
              </div>
              
              {/* Development Potential */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-slate-800/40 rounded-lg border border-slate-700/40 hover:border-slate-600/60 transition-all duration-300 gap-3 sm:gap-0">
                <div className="flex items-center">
                  <TrendingUp className="h-4 w-4 mr-3 text-emerald-400" />
                  <span className="text-gray-300 font-medium text-base">Development Potential</span>
                </div>
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-3 shadow-lg ${
                    riskLevel === "high" ? "bg-red-500 shadow-red-500/50" : 
                    riskLevel === "moderate" ? "bg-amber-500 shadow-amber-500/50" : "bg-emerald-500 shadow-emerald-500/50"
                  }`}></div>
                  <span className={`font-semibold text-sm ${
                    riskLevel === "high" ? "text-red-400" : 
                    riskLevel === "moderate" ? "text-amber-400" : "text-emerald-400"
                  }`}>
                    {riskLevel === "high" ? "High Risk Evolution" : 
                     riskLevel === "moderate" ? "Moderate Risk Evolution" : "Low Risk Evolution"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RiskClassification;