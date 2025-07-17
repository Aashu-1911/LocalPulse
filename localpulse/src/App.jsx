import { useEffect, useState } from 'react'
import MapView from './components/Mapview';
import ReportButton from './components/ReportButton'
import { signInAnonymously } from 'firebase/auth';
import { auth } from "./utils/firebase";
import { onAuthStateChanged } from "firebase/auth";



function App() {
  
  // To see UserID in console
  const [userId, setUserId] =useState(null);
  

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("Firebase User UID:", user.uid);
        setUserId(user.uid);
      }else{
        console.log("User not signed in")
      }
    })

    return () => unsubscribe();
  }, [])

   // To see User is loggedIn 
  useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("Firebase User UID:", user.uid);
      setUserId(user.uid);
    } else {
      console.log("User not signed in. Signing in anonymously...");
      signInAnonymously(auth).catch((error) => {
        console.error("Anon sign-in failed", error);
      });
    }
  });

  return () => unsubscribe();
}, []);


  return (
    <>
      <div className="relative">
      <MapView />
      <ReportButton />
    </div>

    {userId && (
      <div className="absolute top-4 right-4 bg-white border border-gray-300 text-gray-700 text-sm px-3 py-1 rounded shadow">
        UID: {userId.slice(0, 8)}...
      </div>
    )}


    </>
  )
}

export default App
