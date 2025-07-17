import { useState } from "react";
import { getDatabase, ref, push, set } from "firebase/database";
import { auth } from "../utils/firebase";

function ReportForm({ onClose }) {
    
    
  const [category, setCategory] = useState("General");
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("Medium");


  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("🚀 Submit button clicked");

    // Get user location
    navigator.geolocation.getCurrentPosition((position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      const now = new Date();
      console.log("👤 UID:", auth.currentUser?.uid);

      const reportData = {
        uid: auth.currentUser.uid, // Required due to new rules
        category,
        message,
        severity,
        lat,
        lng,
        date: now.toLocaleDateString(),
        time: now.toLocaleTimeString(),
        timestamp: new Date().toISOString(),
      };

      console.log("📝 Prepared reportData:", reportData);

      const db = getDatabase();
      const reportRef = ref(db, "reports");
      const newReport = push(reportRef);

      console.log("UIDs match?", auth.currentUser.uid === reportData.uid);

      console.log("📦 Writing this to Firebase:", reportData);

      set(newReport, reportData)
        .then(() => {
        console.log("✅ Report submitted successfully!");
        alert("Report submitted successfully!");
        onClose();
        })
        .catch((err) => {
        console.error("❌ Firebase Error:", err.message);
        console.error(err); // full object
        alert("❌ Failed to submit report: " + err.message);
      });
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
      >
        <h2 className="text-xl font-bold mb-4">Submit a Report</h2>

        <label className="block mb-2 text-sm">Category</label>
        <select
          className="w-full mb-4 p-2 border rounded"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="General">General</option>
          <option value="Traffic">Traffic</option>
          <option value="Crime">Crime</option>
          <option value="Alert">Alert</option>
        </select>

        <label className="block mb-2 text-sm">Severity</label>
        <select
          className="w-full mb-4 p-2 border rounded"
          value={severity}
          onChange={(e) => setSeverity(e.target.value)}
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>


        <label className="block mb-2 text-sm">Message</label>
        <textarea
          className="w-full mb-4 p-2 border rounded"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Describe the situation..."
        ></textarea>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            className="bg-gray-300 text-sm px-4 py-2 rounded"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white text-sm px-4 py-2 rounded"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default ReportForm;
