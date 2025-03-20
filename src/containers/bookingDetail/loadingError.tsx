import React from "react";

export const LoadingState = () => {
  return (
    <div className="container mx-auto p-5">
      <div className="flex h-64 items-center justify-center">
        <p>Loading booking details...</p>
      </div>
    </div>
  );
};

export const ErrorState = ({ onGoBack }: { onGoBack: () => void }) => {
  return (
    <div className="container mx-auto p-5">
      <div className="flex h-64 flex-col items-center justify-center gap-4">
        <p className="text-red-500">
          Error loading booking details. Please try again.
        </p>
        <button
          onClick={onGoBack}
          className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Back to Booking History
        </button>
      </div>
    </div>
  );
};

export default { LoadingState, ErrorState };
