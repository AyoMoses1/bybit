"use client";

import Image from "next/image";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { assetLib } from "@/lib/assets";
import { Button } from "./button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@radix-ui/react-select";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function CustomTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const pageSize = table.getState().pagination.pageSize;

  return (
    <div className="rounded-[20px] border-x border-x-border bg-card font-nunito">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead className="text-sm font-extrabold" key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody className="bg-[#FCFDFD] text-[#6E7079]">
          {data?.length > 0 ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-[310px] text-center"
              >
                <div className="flex h-full items-center justify-center gap-20">
                  <div>
                    {/* <Image
                      src={assetLib.canadaFlag}
                      alt="No Transactions yet"
                      width={120}
                      height={120}
                    /> */}
                  </div>
                  <div className="flex flex-col items-start">
                    <p className="mb-[4px] text-base font-medium text-[#6E7079] text-foreground">
                      No data for this table yet
                    </p>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="mb-[60px] flex items-center justify-center">
        <div className="flex items-center justify-between gap-4 p-5">
          <div className="font-roboto flex items-center gap-2 text-[#6E7079]">
            <div className="relative flex items-center gap-2 rounded-[8px] border-[0.4px] border-[#D5D5D5] bg-[#FAFBFD] px-2 py-1">
              <select
                className={`cursor-pointer appearance-none bg-[#FAFBFD] bg-transparent text-sm font-semibold outline-none ${pageSize > 8 ? "pr-5" : "pr-3"}`}
                value={table.getState().pagination.pageSize}
                onChange={(e) => table.setPageSize(Number(e.target.value))}
              >
                {[5, 8, 10, 15, 20].map((size) => (
                  <option key={size} value={size}>
                    {size} rows
                  </option>
                ))}
              </select>

              <div className="pointer-events-none absolute right-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-gray-600"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 111.08 1.04l-4.24 4.37a.75.75 0 01-1.08 0L5.23 8.27a.75.75 0 01.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>

            <span className="text-sm font-semibold">per page</span>
          </div>

          <div className="font-roboto flex items-center gap-4 text-[#6E7079]">
            <button
              className="font-roboto flex items-center gap-1 rounded-[8px] border-[0.6px] border-[#D5D5D5] bg-[#FAFBFD] px-3 py-1 text-sm font-semibold text-[#6E7079]"
              disabled={!table.getCanPreviousPage()}
              onClick={() => table.previousPage()}
            >
              <span>
                <ChevronLeft className="size-[18px] text-[#6E7079]" />
              </span>
              Prev
            </button>
            <span className="text-sm font-semibold text-[#6E7079]">
              {table.getState().pagination.pageIndex *
                table.getState().pagination.pageSize +
                1}
              -
              {Math.min(
                (table.getState().pagination.pageIndex + 1) *
                  table.getState().pagination.pageSize,
                data.length,
              )}{" "}
              of {data.length}
            </span>
            <button
              className="font-roboto flex items-center gap-1 rounded-[8px] border-[0.6px] border-[#D5D5D5] bg-[#FAFBFD] px-3 py-1 text-sm font-semibold text-[#6E7079]"
              disabled={!table.getCanNextPage()}
              onClick={() => table.nextPage()}
            >
              Next
              <span>
                <ChevronRight className="size-[18px] text-[#6E7079]" />
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
