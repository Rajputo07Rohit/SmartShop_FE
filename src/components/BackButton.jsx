import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function BackButton() {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(-1)}
      className="btn-ghost flex items-center gap-1 mb-4"
    >
      <ArrowLeft size={18} />
      Back
    </button>
  );
}
