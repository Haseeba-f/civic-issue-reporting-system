import { useState, useEffect } from "react";

function App() {
  const [activeTab, setActiveTab] = useState("report");
  const [file, setFile] = useState(null);
  const [selectedIssueType, setSelectedIssueType] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState({
    address: "Fetching location...",
    lat: null,
    lng: null
  });
  const [reports, setReports] = useState([]);
  const [locationLoading, setLocationLoading] = useState(false);

  // Auto-fetch location on mount
  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = () => {
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        setLocation({
          address: `📍 Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`,
          lat: latitude,
          lng: longitude
        });
        setLocationLoading(false);
      },
      (error) => {
        console.error("Geolocation error:", error);
        setLocation({
          address: "📍 Location: Hyderabad, India (Default)",
          lat: 17.385,
          lng: 78.4867
        });
        setLocationLoading(false);
      }
    );
  };

  const handlePhotoCapture = () => {
    document.getElementById('photo-input').click();
  };

  const handleSubmit = async () => {
    if (!file) {
      alert("📸 Please take a photo first!");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("latitude", location.lat || 17.385);
    formData.append("longitude", location.lng || 78.4867);
    formData.append("address", location.address);

    try {
      const response = await fetch(
        "http://localhost:8000/api/submit-report",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      
      if (data.success) {
        setResult(data);
        const newReport = {
          id: data.data?.report_id,
          type: data.data?.issue?.type,
          location: location.address,
          status: "Pending Review",
          date: new Date().toLocaleDateString(),
          severity: data.data?.issue?.severity,
          complaint: data.data?.complaint
        };
        setReports([newReport, ...reports]);
        
        // Auto-reset form
        setFile(null);
        setSelectedIssueType("");
        
        // Switch to status after 2 seconds
        setTimeout(() => {
          setActiveTab("status");
        }, 3000);
      } else {
        setError(data.error || "Failed to submit report");
      }
    } catch (error) {
      console.error(error);
      setError("❌ Connection error. Make sure backend is running!");
    }
    setLoading(false);
  };

  const getIssueIcon = (type) => {
    const icons = {
      "Pothole": "🕳️",
      "Garbage Accumulation": "🗑️",
      "Garbage": "🗑️",
      "Broken Streetlight": "💡",
      "Streetlight": "💡",
      "Drainage Issue": "💧",
      "Water Leak": "💧",
      "Damaged Property": "🏚️",
      "Fallen Tree/Branch": "🌳",
      "Traffic Signal": "🚦"
    };
    return icons[type] || "📍";
  };

  return (
    // Mobile Phone Frame Container
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black flex items-center justify-center p-4">
      
      {/* Phone Frame */}
      <div className="relative" style={{ width: '375px', height: '812px' }}>
        
        {/* Phone Outer Shell */}
        <div className="absolute inset-0 bg-gray-900 rounded-[50px] shadow-2xl border-8 border-gray-800">
          
          {/* Notch */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-6 bg-black rounded-b-3xl z-50"></div>
          
          {/* Screen Container */}
          <div className="absolute inset-0 m-2 bg-white rounded-[42px] overflow-hidden">
            
            {/* Status Bar */}
            <div className="bg-white h-11 flex items-center justify-between px-6 pt-2 text-xs font-medium">
              <span>9:41</span>
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M17.778 8.222c-4.296-4.296-11.26-4.296-15.556 0A1 1 0 01.808 6.808c5.076-5.077 13.308-5.077 18.384 0a1 1 0 01-1.414 1.414zM14.95 11.05a7 7 0 00-9.9 0 1 1 0 01-1.414-1.414 9 9 0 0112.728 0 1 1 0 01-1.414 1.414zM12.12 13.88a3 3 0 00-4.242 0 1 1 0 01-1.415-1.415 5 5 0 017.072 0 1 1 0 01-1.415 1.415zM9 16a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
                <span>100%</span>
                <svg className="w-6 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="1" y="6" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                  <rect x="4" y="9" width="12" height="6" fill="currentColor"/>
                  <rect x="20" y="9" width="3" height="6" rx="1" fill="currentColor"/>
                </svg>
              </div>
            </div>

            {/* App Content */}
            <div className="flex flex-col h-full" style={{ paddingBottom: '70px', paddingTop: '0px' }}>
              
              {/* Header */}
              <div className="bg-blue-600 text-white p-4 shadow-lg">
                <h1 className="text-xl font-bold">🚨 Civic Issue Reporter</h1>
                <p className="text-blue-100 text-xs mt-0.5">AI-Powered Municipal Reporting</p>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto bg-gray-50 p-3">
                
                {activeTab === "report" && (
                  <div className="space-y-3">
                    {/* Report Card */}
                    <div className="bg-white p-4 rounded-2xl shadow-md">
                      <h2 className="text-base font-bold mb-3 text-gray-800">📝 Report Issue</h2>
                      
                      {/* Camera Capture */}
                      <div 
                        onClick={handlePhotoCapture}
                        className="relative border-2 border-dashed border-blue-300 rounded-2xl p-6 mb-3 text-center cursor-pointer bg-blue-50 hover:bg-blue-100 active:scale-[0.98] transition-all"
                      >
                        <input
                          id="photo-input"
                          type="file"
                          accept="image/*"
                          capture="environment"
                          onChange={(e) => setFile(e.target.files[0])}
                          className="hidden"
                        />
                        {!file ? (
                          <>
                            <div className="text-5xl mb-2">📸</div>
                            <p className="text-sm font-semibold text-gray-700">Tap to Take Photo</p>
                            <p className="text-xs text-gray-500 mt-1">Use your phone camera</p>
                          </>
                        ) : (
                          <>
                            <img 
                              src={URL.createObjectURL(file)} 
                              alt="Captured" 
                              className="w-full h-48 object-cover rounded-xl mb-2"
                            />
                            <p className="text-xs text-green-600 font-medium">✅ Photo Captured</p>
                            <button
                              onClick={(e) => { e.stopPropagation(); setFile(null); }}
                              className="mt-2 text-red-600 text-sm font-medium"
                            >
                              🗑️ Remove
                            </button>
                          </>
                        )}
                      </div>

                      {/* Auto-detected Location */}
                      <div className="mb-3 p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-xs font-bold text-green-700 mb-1">📍 GPS LOCATION (Auto-Tagged)</p>
                            <p className="text-xs text-gray-700 font-mono break-all">
                              {locationLoading ? (
                                <span className="text-blue-600 animate-pulse">⏳ Fetching GPS...</span>
                              ) : (
                                location.address
                              )}
                            </p>
                          </div>
                          <button
                            onClick={getCurrentLocation}
                            className="ml-2 text-blue-600 text-lg hover:scale-110 transition-transform"
                            title="Refresh location"
                          >
                            🔄
                          </button>
                        </div>
                      </div>

                      {/* AI Classification Info */}
                      <div className="mb-3 p-3 bg-purple-50 rounded-xl border border-purple-200">
                        <p className="text-xs font-bold text-purple-700 mb-1">🤖 AI AUTO-CLASSIFICATION</p>
                        <p className="text-xs text-gray-600">
                          Photo will be analyzed to identify: Pothole, Garbage, Streetlight, Drainage, etc.
                        </p>
                      </div>

                      {/* Submit Button */}
                      <button
                        onClick={handleSubmit}
                        disabled={loading || !file}
                        className={`w-full py-4 rounded-2xl font-bold text-base shadow-lg transition-all active:scale-95 ${
                          loading || !file
                            ? "bg-gray-300 cursor-not-allowed text-gray-500"
                            : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                        }`}
                      >
                        {loading ? (
                          <span className="flex items-center justify-center">
                            <span className="animate-spin mr-2">⏳</span> Processing...
                          </span>
                        ) : (
                          "🚀 Submit Report"
                        )}
                      </button>
                    </div>

                    {/* Success Message */}
                    {result && result.success && (
                      <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-2xl border-2 border-green-300 shadow-lg animate-bounce-in">
                        <div className="flex items-center mb-3">
                          <span className="text-3xl mr-3">✅</span>
                          <div>
                            <h2 className="text-base font-bold text-green-800">Report Submitted!</h2>
                            <p className="text-xs text-green-600">Formal complaint generated</p>
                          </div>
                        </div>
                        
                        <div className="bg-white rounded-xl p-3 text-xs space-y-2 shadow-inner">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600 font-medium">Report ID:</span>
                            <span className="font-mono font-bold text-blue-600 text-xs">{result.data?.report_id}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600 font-medium">AI Detected:</span>
                            <span className="font-bold text-gray-800">
                              {getIssueIcon(result.data?.issue?.type)} {result.data?.issue?.type}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600 font-medium">Priority:</span>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              result.data?.issue?.priority === 'Critical' ? 'bg-red-600 text-white' :
                              result.data?.issue?.priority === 'High' ? 'bg-orange-500 text-white' :
                              'bg-yellow-400 text-gray-800'
                            }`}>
                              {result.data?.issue?.priority}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600 font-medium">Confidence:</span>
                            <span className="font-bold text-green-600">{result.data?.issue?.confidence}%</span>
                          </div>
                        </div>

                        <p className="text-xs text-center text-green-700 mt-3 font-medium">
                          🎯 Switching to Status tab...
                        </p>
                      </div>
                    )}

                    {/* Error */}
                    {error && (
                      <div className="bg-red-50 border-2 border-red-300 text-red-800 p-4 rounded-2xl">
                        <p className="font-bold text-sm mb-1">❌ Error</p>
                        <p className="text-xs">{error}</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "status" && (
                  <div className="space-y-3">
                    <h2 className="text-base font-bold text-gray-800 mb-3">📊 Your Reports</h2>
                    {reports.length === 0 ? (
                      <div className="bg-white p-10 rounded-2xl shadow-md text-center">
                        <span className="text-6xl mb-3 block">📋</span>
                        <p className="text-gray-600 font-bold">No reports yet</p>
                        <p className="text-xs text-gray-400 mt-2">Take a photo to get started</p>
                      </div>
                    ) : (
                      reports.map((report) => (
                        <div key={report.id} className="bg-white p-4 rounded-2xl shadow-md border-l-4 border-blue-500">
                          <div className="flex items-center mb-2">
                            <span className="text-3xl mr-3">{getIssueIcon(report.type)}</span>
                            <div className="flex-1">
                              <div className="flex justify-between items-center mb-1">
                                <span className="font-bold text-sm">{report.type}</span>
                                <span className="px-2 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800">
                                  {report.status}
                                </span>
                              </div>
                              <p className="text-xs text-gray-500 font-mono">{report.id}</p>
                            </div>
                          </div>
                          <p className="text-xs text-gray-600 mb-2 pl-12">{report.location}</p>
                          <div className="flex justify-between items-center pl-12">
                            <p className="text-xs text-gray-400">📅 {report.date}</p>
                            {report.severity && (
                              <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                                report.severity === 'High' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {report.severity}
                              </span>
                            )}
                          </div>
                          
                          {/* Show complaint preview */}
                          {report.complaint && (
                            <details className="mt-3 text-xs">
                              <summary className="cursor-pointer text-blue-600 font-medium">📄 View Generated Complaint</summary>
                              <pre className="mt-2 p-2 bg-gray-50 rounded text-xs overflow-x-auto whitespace-pre-wrap border">
                                {report.complaint}
                              </pre>
                            </details>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                )}

                {activeTab === "info" && (
                  <div className="space-y-3">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-2xl shadow-lg text-center">
                      <h1 className="text-2xl font-bold mb-2">🤖 AI Civic Reporter</h1>
                      <p className="text-sm opacity-90">Powered by Machine Learning</p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl shadow-md">
                      <h3 className="font-bold text-sm mb-3 text-gray-800">✨ How It Works</h3>
                      <div className="space-y-3 text-xs">
                        <div className="flex items-start">
                          <span className="text-2xl mr-3">📸</span>
                          <div>
                            <p className="font-bold">1. Take Photo</p>
                            <p className="text-gray-600">Capture civic issue with camera</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <span className="text-2xl mr-3">🤖</span>
                          <div>
                            <p className="font-bold">2. AI Classification</p>
                            <p className="text-gray-600">Auto-detects: Pothole, Garbage, etc.</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <span className="text-2xl mr-3">📍</span>
                          <div>
                            <p className="font-bold">3. GPS Tagging</p>
                            <p className="text-gray-600">Automatically captures location</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <span className="text-2xl mr-3">📝</span>
                          <div>
                            <p className="font-bold">4. Generate Complaint</p>
                            <p className="text-gray-600">AI writes formal letter to authorities</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-2xl shadow-md">
                      <h3 className="font-bold text-sm mb-2 text-gray-800">📋 Detected Issues</h3>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {["Pothole 🕳️", "Garbage 🗑️", "Streetlight 💡", "Drainage 💧", "Property 🏚️", "Tree 🌳"].map((item) => (
                          <div key={item} className="p-2 bg-gray-50 rounded-lg text-center font-medium">
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-2xl shadow-md text-center">
                      <p className="text-xs text-gray-500">Team Blushy Tech</p>
                      <p className="text-xs text-gray-400 mt-1">SUDHEE 2026 Hackathon</p>
                      <p className="text-xs font-mono text-gray-400 mt-2">v1.0.0</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Navigation */}
              <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-2 shadow-2xl">
                {[
                  { id: "report", label: "Report", icon: "📝" },
                  { id: "status", label: "Status", icon: "📊" },
                  { id: "info", label: "Info", icon: "ℹ️" }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex flex-col items-center py-2 px-6 rounded-xl transition-all ${
                      activeTab === tab.id 
                        ? "text-blue-600 bg-blue-50 scale-105" 
                        : "text-gray-500"
                    }`}
                  >
                    <span className="text-2xl mb-0.5">{tab.icon}</span>
                    <span className="text-xs font-bold">{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Home Indicator (iPhone style) */}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gray-600 rounded-full"></div>
        </div>

        {/* Side Buttons */}
        <div className="absolute left-0 top-32 w-1 h-12 bg-gray-700 rounded-r"></div>
        <div className="absolute left-0 top-48 w-1 h-16 bg-gray-700 rounded-r"></div>
        <div className="absolute right-0 top-48 w-1 h-20 bg-gray-700 rounded-l"></div>
      </div>

      
      <style>{`
        @keyframes bounce-in {
          0% { opacity: 0; transform: scale(0.8); }
          50% { transform: scale(1.05); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-bounce-in {
          animation: bounce-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}

export default App;
