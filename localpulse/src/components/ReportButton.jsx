import { useState } from "react";
import ReportForm from "./ReportForm";



function ReportButton() {

  const [open, setOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 bg-red-600 text-white px-4 py-3 rounded-full shadow-lg z-40">
      +
    </button>

    {open && <ReportForm onClose={() => setOpen(false)} />}
    </>
    
  );
}

export default ReportButton;
