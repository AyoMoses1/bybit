import { Search } from "lucide-react";
import Image from "next/image";
import React from "react";
import importIcon from "../assets/svgs/import.svg";

type SearchType = {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClick?: () => void;
  importTable?: boolean;
};

const SearchComponent = ({
  value,
  onChange,
  onClick,
  importTable,
}: SearchType) => {
  return (
    <div className="flex items-center gap-4">
      {importTable && (
        <div onClick={onClick}>
          <Image
            src={importIcon}
            alt="Import Icon"
            width={24}
            height={24}
            className="cursor-pointer object-contain"
          />
        </div>
      )}

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
