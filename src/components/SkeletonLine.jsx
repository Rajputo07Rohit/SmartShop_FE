import React from "react";
export default function SkeletonLine({ className = "h-4 w-full" }) {
  return <div className={`skeleton ${className}`} />;
}
