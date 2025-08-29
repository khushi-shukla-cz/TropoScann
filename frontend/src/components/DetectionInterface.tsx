import React, { useState, useEffect } from "react";
import { Upload, Play, Download, AlertTriangle, CheckCircle, Loader2, Bell, BellRing, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { notificationService } from "@/services/notificationService";
import RiskClassification from "./RiskClassification";
import TrajectoryForecast from "./TrajectoryForecast";
import PathPredictor from "./PathPredictor";

interface DetectionResult {
  risk_data: {
    risk_level: "low" | "moderate" | "high";
    temperature: string;
    cluster_area: number;
    confidence: number;
    prediction: string;
    coverage_percent?: number;
  };
  overlay_image: string;
  processed_image: string;
  timestamp: string;
  model_type?: string;
}

interface SampleImage {
  id: string;
  name: string;
  description: string;
  risk_level: string;
  preview?: string;
}

const DetectionInterface = () => {
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingImageId, setProcessingImageId] = useState<string | null>(null);
  const [results, setResults] = useState<DetectionResult | null>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [sampleImages, setSampleImages] = useState<SampleImage[]>([]);
  const [loadingSamples, setLoadingSamples] = useState(true);
  const [showSampleDropdown, setShowSampleDropdown] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load sample images from backend
    const loadSampleImages = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/sample-images');
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setSampleImages(data.samples);
          }
        }
      } catch (error) {
        console.error('Failed to load sample images:', error);
        // Fallback to static samples if backend is unavailable
        setSampleImages([
          {
            id: "normal",
            name: "Normal Conditions",
            description: "Clear skies with minimal cloud cover",
            risk_level: "low"
          },
          {
            id: "developing", 
            name: "Developing Cluster",
            description: "Organized cloud formation with moderate convection",
            risk_level: "moderate"
          },
          {
            id: "cyclone",
            name: "Cyclone Formation",
            description: "Deep convective system with spiral structure", 
            risk_level: "high"
          }
        ]);
      } finally {
        setLoadingSamples(false);
      }
    };

    loadSampleImages();
  }, []);

  useEffect(() => {
    // Request notification permission on component mount
    const initNotifications = async () => {
      const hasPermission = await notificationService.requestPermission();
      setNotificationsEnabled(hasPermission);
      if (hasPermission) {
        toast({
          title: "Notifications Enabled",
          description: "You'll receive mobile alerts for risk detections",
        });
      }
    };
    initNotifications();
  }, [toast]);

  const loadSamplePreview = async (sampleId: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/sample/${sampleId}/preview`);
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          return `data:image/jpeg;base64,${data.image_data}`;
        }
      }
    } catch (error) {
      console.error(`Failed to load preview for ${sampleId}:`, error);
    }
    return null;
  };

  const sendRiskNotification = (riskData: DetectionResult['risk_data']) => {
    console.log('🔔 sendRiskNotification called with:', riskData);
    console.log('📱 Notifications enabled:', notificationsEnabled);
    
    if (!notificationsEnabled) {
      console.log('❌ Notifications disabled - skipping alert');
      return;
    }

    const details = `Temperature: ${riskData.temperature}, Confidence: ${riskData.confidence}%`;
    console.log('📋 Sending risk alert with details:', details);
    notificationService.sendRiskAlert(riskData.risk_level, details);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.includes('image/')) {
        toast({
          title: "Invalid File Type",
          description: "Please upload a valid image file (PNG, JPEG, TIFF)",
          variant: "destructive"
        });
        return;
      }
      
      setUploadedImage(file);
      setResults(null);
      toast({
        title: "Image Uploaded",
        description: "Ready for analysis"
      });
    }
  };

  const processUploadedImage = async () => {
    if (!uploadedImage) return;
    
    setIsProcessing(true);
    
    try {
      const formData = new FormData();
      formData.append('image', uploadedImage);
      
      const response = await fetch('http://localhost:5000/api/detect', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Detection failed');
      }
      
      const result = await response.json();
      
      if (result.success) {
        setResults(result);
        
        // Send mobile notification
        sendRiskNotification(result.risk_data);
        
        toast({
          title: "Analysis Complete",
          description: `Risk Level: ${result.risk_data.risk_level.toUpperCase()}`,
          variant: result.risk_data.risk_level === "high" ? "destructive" : "default"
        });
      } else {
        throw new Error(result.error || 'Detection failed');
      }
      
    } catch (error) {
      console.error('Detection error:', error);
      toast({
        title: "Analysis Failed",
        description: "Please try again or contact support",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const processSampleImage = async (sampleId: string) => {
    setIsProcessing(true);
    setProcessingImageId(sampleId);
    setUploadedImage(null);
    
    try {
      const response = await fetch(`http://localhost:5000/api/sample/${sampleId}`, {
        method: 'POST'
      });
      
      if (!response.ok) {
        throw new Error('Sample processing failed');
      }
      
      const result = await response.json();
      
      if (result.success) {
        setResults(result);
        
        // Send mobile notification
        sendRiskNotification(result.risk_data);
        
        toast({
          title: "Sample Analysis Complete",
          description: `Risk Level: ${result.risk_data.risk_level.toUpperCase()}`,
          variant: result.risk_data.risk_level === "high" ? "destructive" : "default"
        });
      } else {
        throw new Error(result.error || 'Sample processing failed');
      }
      
    } catch (error) {
      console.error('Sample processing error:', error);
      toast({
        title: "Sample Analysis Failed", 
        description: "Please try again or contact support",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
      setProcessingImageId(null);
    }
  };

  const enableNotifications = async () => {
    const hasPermission = await notificationService.requestPermission();
    setNotificationsEnabled(hasPermission);
    
    if (hasPermission) {
      toast({
        title: "Notifications Enabled",
        description: "You'll now receive mobile alerts for risk detections",
      });
    } else {
      toast({
        title: "Notifications Denied",
        description: "Please enable notifications in your browser settings",
        variant: "destructive"
      });
    }
  };

  const downloadResults = () => {
    if (!results) return;
    
    const reportData = {
      timestamp: results.timestamp,
      risk_assessment: results.risk_data,
      analysis_summary: `TropoScan AI Detection Report - ${results.risk_data.risk_level.toUpperCase()} RISK`
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `troposcam-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Report Downloaded",
      description: "Analysis report saved successfully"
    });
  };

  const sendAlert = () => {
    if (!results || results.risk_data.risk_level === "low") return;
    
    toast({
      title: "Alert Sent",
      description: "Notification sent to Disaster Management Portal 📡",
      duration: 5000
    });
  };

  return (
    <div className="container mx-auto px-4 py-6 lg:py-8">
      {/* Header Section - Fixed typography hierarchy */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex-1">
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3">
              AI Detection Interface
            </h1>
            <p className="text-lg text-gray-300 leading-relaxed max-w-2xl">
              Upload INSAT-3D infrared satellite images or try our sample images to detect tropical cloud clusters
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={enableNotifications}
              variant={notificationsEnabled ? "default" : "outline"}
              className="text-sm font-medium"
            >
              {notificationsEnabled ? (
                <BellRing className="mr-2 h-4 w-4" />
              ) : (
                <Bell className="mr-2 h-4 w-4" />
              )}
              {notificationsEnabled ? "Notifications On" : "Enable Alerts"}
            </Button>
            
            {notificationsEnabled && (
              <Button
                onClick={async () => {
                  console.log('🧪 Testing immediate desktop notification...');
                  const success = await notificationService.sendImmediateTestNotification();
                  if (!success) {
                    toast({
                      title: "Notification Test Failed",
                      description: "Check browser settings and console for details",
                      variant: "destructive"
                    });
                  }
                }}
                variant="outline"
                size="sm"
                className="text-sm"
              >
                Test Alert
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          {/* Upload Section */}
          <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-500">
            <CardHeader>
              <CardTitle className="text-white text-xl font-semibold flex items-center">
                <Upload className="mr-3 h-5 w-5" />
                Upload Satellite Image
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center hover:border-blue-400/50 transition-all duration-300">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="imageUpload" 
                />
                <label 
                  htmlFor="imageUpload"
                  className="cursor-pointer flex flex-col items-center space-y-3"
                >
                  <Upload className="h-10 w-10 text-gray-400" />
                  <span className="text-base text-gray-300 font-medium">
                    Click to upload INSAT-3D IR image
                  </span>
                  <span className="text-sm text-gray-500">
                    Supports PNG, JPEG, TIFF formats
                  </span>
                </label>
              </div>
              
              {uploadedImage && (
                <div className="flex items-center justify-between bg-white/5 p-4 rounded-lg">
                  <span className="text-white text-sm font-medium">{uploadedImage.name}</span>
                  <Button 
                    onClick={processUploadedImage}
                    disabled={isProcessing}
                    size="sm"
                  >
                    {isProcessing ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Play className="mr-2 h-4 w-4" />
                    )}
                    Analyze
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Sample Images Section */}
          <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-500">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white text-xl font-semibold">Sample Images</CardTitle>
                <Badge variant="outline" className="text-blue-400 border-blue-400 text-sm">
                  Try Our Samples
                </Badge>
              </div>
              <p className="text-gray-300 text-base mt-2">
                Don't have satellite images? Try our preprocessed samples to see the AI detection in action
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Dropdown Toggle Button */}
              <Button
                variant="outline"
                onClick={() => setShowSampleDropdown(!showSampleDropdown)}
                className="w-full flex items-center justify-between bg-white/5 border-white/20 hover:bg-white/10 text-white text-sm font-medium"
                disabled={loadingSamples}
              >
                <span className="flex items-center">
                  <Upload className="h-4 w-4 mr-2" />
                  {loadingSamples ? "Loading sample images..." : `Browse Sample Images (${sampleImages.length} available)`}
                </span>
                {loadingSamples ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  showSampleDropdown ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                )}
              </Button>

              {/* Dropdown Content */}
              {showSampleDropdown && !loadingSamples && (
                <div className="mt-4 p-4 bg-black/20 rounded-lg border border-white/10">
                  {sampleImages.length > 0 ? (
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                      {sampleImages.map((sample, index) => (
                        <SampleImageGridCard
                          key={sample.id}
                          sample={sample}
                          index={index}
                          onSelect={processSampleImage}
                          onLoadPreview={loadSamplePreview}
                          isProcessing={processingImageId === sample.id}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <AlertTriangle className="h-8 w-8 text-yellow-400 mx-auto mb-3" />
                      <p className="text-gray-400 text-sm">No sample images available</p>
                    </div>
                  )}
                </div>
              )}

              {/* Storm Tracking Section */}
              {results && results.risk_data.risk_level !== "low" && (
                <Card className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-blue-400/30 hover:shadow-2xl transition-all duration-500 mt-6">
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold text-white mb-2">
                      Storm Tracking & Forecasting
                    </CardTitle>
                    <p className="text-gray-300 text-base">
                      Advanced storm tracking with trajectory prediction and movement analysis
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <PathPredictor 
                        stormName={`Detected System (${results.timestamp})`}
                        positions={[
                          {lat: 18.2, lon: 72.8, timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), riskLevel: 'low'},
                          {lat: 18.5, lon: 73.2, timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), riskLevel: 'moderate'},
                          {lat: 18.9, lon: 73.7, timestamp: new Date().toISOString(), riskLevel: results.risk_data.risk_level}
                        ]}
                      />
                      <TrajectoryForecast 
                        cycloneName={`Detected System (${new Date().toLocaleDateString()})`}
                        coordinates={[73.7, 18.9]}
                        intensity={results.risk_data.risk_level === "high" ? "Cyclonic Storm" : results.risk_data.risk_level === "moderate" ? "Depression" : "Low Pressure Area"}
                      />
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {isProcessing && (
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-8 text-center">
                <Loader2 className="h-12 w-12 text-blue-400 animate-spin mx-auto mb-4" />
                <h3 className="text-white text-xl font-semibold mb-2">Analyzing Satellite Data</h3>
                <p className="text-gray-400 text-base">Processing image through U-Net AI Model...</p>
              </CardContent>
            </Card>
          )}

          {results && (
            <div className="space-y-6">
              {/* Visual Results */}
              <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-500">
                <CardHeader>
                  <CardTitle className="text-white text-xl font-semibold">Detection Results</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-white text-sm font-semibold mb-3">Original Image</h4>
                      <img 
                        src={`data:image/png;base64,${results.processed_image}`}
                        alt="Original satellite image"
                        className="w-full rounded-lg border border-white/20 hover:shadow-lg transition-all duration-300"
                      />
                    </div>
                    <div>
                      <h4 className="text-white text-sm font-semibold mb-3">Risk Overlay</h4>
                      <img 
                        src={`data:image/png;base64,${results.overlay_image}`}
                        alt="Risk overlay"
                        className="w-full rounded-lg border border-white/20 hover:shadow-lg transition-all duration-300"
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-3 pt-4">
                    <Button 
                      onClick={downloadResults} 
                      variant="outline" 
                      size="sm"
                      className="text-sm font-medium"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download Report
                    </Button>
                    
                    {results.risk_data.risk_level !== "low" && (
                      <Button 
                        onClick={sendAlert} 
                        variant="destructive" 
                        size="sm"
                        className="text-sm font-medium"
                      >
                        <AlertTriangle className="mr-2 h-4 w-4" />
                        Send Alert
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Risk Classification */}
              <RiskClassification 
                riskLevel={results.risk_data.risk_level}
                temperature={results.risk_data.temperature}
                clusterArea={results.risk_data.cluster_area}
                confidence={results.risk_data.confidence}
                prediction={results.risk_data.prediction}
                modelType={results.model_type}
                coveragePercent={results.risk_data.coverage_percent}
              />
            </div>
          )}

          {!results && !isProcessing && (
            <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-500">
              <CardContent className="p-8 text-center">
                <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-white text-xl font-semibold mb-2">Ready for Analysis</h3>
                <p className="text-gray-400 text-base">Upload an image or select a sample to begin detection</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

// Sample Image Grid Card Component
const SampleImageGridCard = ({ sample, index, onSelect, onLoadPreview, isProcessing }: {
  sample: SampleImage;
  index: number;
  onSelect: (id: string) => void;
  onLoadPreview: (id: string) => Promise<string | null>;
  isProcessing: boolean;
}) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const loadPreview = async () => {
    if (preview) return;
    
    setLoadingPreview(true);
    try {
      const previewData = await onLoadPreview(sample.id);
      if (previewData) {
        setPreview(previewData);
        setShowPreview(true);
      }
    } catch (error) {
      console.error('Failed to load preview:', error);
    } finally {
      setLoadingPreview(false);
    }
  };

  React.useEffect(() => {
    const timer = setTimeout(() => {
      loadPreview();
    }, index * 200);
    
    return () => clearTimeout(timer);
  }, []);

  const handleClick = () => {
    if (!isProcessing) {
      onSelect(sample.id);
    }
  };

  return (
    <div 
      className={`group relative border border-white/20 rounded-lg overflow-hidden hover:border-blue-400/50 transition-all duration-300 aspect-square cursor-pointer ${
        isProcessing ? 'opacity-50 pointer-events-none' : ''
      }`}
      onClick={handleClick}
    >
      {/* Image Preview */}
      <div className="relative w-full h-full">
        {showPreview && preview ? (
          <img 
            src={preview} 
            alt={sample.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
            {loadingPreview ? (
              <Loader2 className="h-5 w-5 animate-spin text-blue-400" />
            ) : (
              <div className="text-center p-2">
                <Upload className="h-5 w-5 text-gray-400 mx-auto mb-2" />
                <p className="text-xs text-gray-400">Preview</p>
              </div>
            )}
          </div>
        )}
        
        {/* Risk Badge */}
        <div className="absolute top-2 right-2">
          <Badge 
            variant={sample.risk_level === "high" ? "destructive" : sample.risk_level === "moderate" ? "default" : "secondary"}
            className="text-xs font-medium"
          >
            {sample.risk_level.toUpperCase()}
          </Badge>
        </div>

        {/* Processing Overlay */}
        {isProcessing && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="h-6 w-6 animate-spin text-blue-400 mx-auto mb-2" />
              <p className="text-white text-sm font-medium">Analyzing...</p>
            </div>
          </div>
        )}

        {/* Hover Effect */}
        {!isProcessing && (
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-all duration-300">
              <Play className="h-6 w-6 text-white" />
            </div>
          </div>
        )}
      </div>

      {/* Sample Info Overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
        <h4 className="text-white text-sm font-semibold truncate">{sample.name}</h4>
        <p className="text-gray-300 text-xs truncate">{sample.description}</p>
      </div>
    </div>
  );
};

export default DetectionInterface;