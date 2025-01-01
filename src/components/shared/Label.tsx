import React from "react";
export const Label = ({ children }: { children: React.ReactNode }) => {
  return (
    <label className="block text-xs mb-2 font-medium text-gray-500">
      {children}
    </label>
  );
};
