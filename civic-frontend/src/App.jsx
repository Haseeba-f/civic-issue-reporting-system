import { useState } from "react";

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!file) {
      alert("Please upload an image");
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(async (position) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("latitude", position.coords.latitude);
      formData.append("longitude", position.coords.longitude);
      formData.append("address", "Auto-detected");

      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/submit-report",
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await response.json();
        setResult(data);
      } catch (error) {
        console.error(error);
        alert("Error submitting report");
      }

      setLoading(false);
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">
        Civic Issue Reporting
      </h1>

      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="mb-4"
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          {loading ? "Submitting..." : "Submit Report"}
        </button>
      </div>

      {result && (
        <div className="mt-6 bg-white p-6 rounded-xl shadow-md w-full max-w-md">
          <h2 className="text-xl font-semibold mb-2">Report Result</h2>
          <p><strong>Report ID:</strong> {result.data?.report_id}</p>
          <p><strong>Issue:</strong> {result.data?.issue?.type}</p>
          <p><strong>Priority:</strong> {result.data?.issue?.priority}</p>
          <p><strong>Timeline:</strong> {result.data?.resolution_timeline}</p>
        </div>
      )}
    </div>
  );
}

export default App;
