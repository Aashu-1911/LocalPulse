import { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "../utils/firebase"; // ✅ Use shared instance

function useReports() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const reportsRef = ref(database, "reports");

    const unsubscribe = onValue(reportsRef, (snapshot) => {
      const data = snapshot.val();
      console.log("🔥 Fetched data from Firebase:", data); 
      
      if (data) {
        const formatted = Object.entries(data).map(([id, value]) => ({
          id,
          ...value,
        }));
        setReports(formatted);
      } else {
        setReports([]);
      }
    });

    return () => unsubscribe();
  }, []);

  return reports;
}

export default useReports;
