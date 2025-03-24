import React from "react";
import { Download } from "lucide-react";
import { ExportButtonProps } from "../../containers/bookingDetail/bookingTypes";

const ExportButton: React.FC<ExportButtonProps> = ({
  exportToCSV,
  disabled,
}) => {
  return (
    <div className="flex h-full items-center justify-center border-l border-gray-200 px-3">
      <button
        onClick={exportToCSV}
        className="text-gray-500"
        disabled={disabled}
        title="Export to CSV"
      >
        <Download size={26} />
      </button>
    </div>
  );
};

export default ExportButton;
