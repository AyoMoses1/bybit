import React from "react";
import { Input } from "@/components/ui/input";
import { SearchIcon, X } from "lucide-react";
import { SearchBarProps } from "../../containers/bookingDetail/bookingTypes";

const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  handleSearchChange,
  handleClearSearch,
}) => {
  return (
    <div className="relative flex items-center overflow-hidden rounded-full border border-gray-200 bg-white">
      <Input
        placeholder="Search in table..."
        value={searchQuery}
        onChange={handleSearchChange}
        className="border-none pl-10 pr-12 shadow-none focus:ring-0"
      />

      <div className="pointer-events-none absolute left-3">
        <SearchIcon className="h-5 w-5 text-gray-400" />
      </div>

      {searchQuery && (
        <button
          className="absolute right-10 flex items-center"
          onClick={handleClearSearch}
        >
          <X size={16} className="text-gray-400 hover:text-gray-600" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
