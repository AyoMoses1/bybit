import { Search } from "lucide-react";
import React from "react";

type SearchType = {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const SearchComponent = ({ value, onChange }: SearchType) => {
  return (
    <div>
      {" "}
      <div className="relative flex h-[38px] w-[234px] items-center gap-2 rounded-[19px] border-[0.6px] border-[#D5D5D5] bg-[#FAFAFA] px-3">
        <Search className="size-4 text-[#00000080]" />
        <input
          type="text"
          value={value}
          onChange={onChange}
          className="w-full border-none bg-transparent text-sm text-[#6E7079] outline-none placeholder:text-[#00000080]"
          placeholder="Search in table..."
        />
      </div>
    </div>
  );
};

export default SearchComponent;
