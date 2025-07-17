import { useState } from "react";
import { database, auth } from "../utils/firebase";
import { push, ref, serverTimestamp } from "firebase/database";

function PostForm({ position, onClose }) {
  const [category, setCategory] = useState("General");
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("Medium");


  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = auth.currentUser;
    if (!user) return alert("You must be logged in to post");

    try {
      const now = new Date();

      await push(ref(database, "reports"), {
        uid: user.uid,
        category,
        message,
        severity,
        lat: position[0],
        lng: position[1],
        date: now.toLocaleDateString(),
        time: now.toLocaleTimeString(),
        timestamp: now.toISOString(),
      });


      onClose(); // close popup after submission
    } catch (error) {
      console.error("Error posting report:", error);
      alert("Failed to post report");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2 text-sm">
      <div>
        <label className="block font-semibold">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border p-1 rounded"
        >
          <option value="General">General</option>
          <option value="Traffic">Traffic</option>
          <option value="Crime">Crime</option>
          <option value="Alert">Alert</option>
        </select>
      </div>

      <div>
      <label className="block font-semibold">Severity</label>
      <select
          value={severity}
          onChange={(e) => setSeverity(e.target.value)}
          className="w-full border p-1 rounded"
      >
      <option value="Low">Low</option>
      <option value="Medium">Medium</option>
      <option value="High">High</option>
      </select>
      </div>


      <div>
        <label className="block font-semibold">Message</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full border p-1 rounded"
          rows={3}
          required
        />
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
      >
        Submit
      </button>
    </form>
  );
}

export default PostForm;
