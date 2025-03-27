"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import deleteIcon from "../assets/svgs/Vector (1).svg";
import Image from "next/image";

const DeleteConfirmation = ({
  text,
  onClick,
}: {
  text: string;
  onClick: () => void;
}) => {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="">
          <Image
            src={deleteIcon}
            alt="Delete Icon"
            width={10}
            height={10}
            className="rounded-full"
          />
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-md transition-opacity" />
        <Dialog.Content className="fixed left-1/2 top-1/2 w-[340px] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-xl transition-all">
          <div className="flex items-center justify-between">
            <Dialog.Title className="text-lg font-semibold text-gray-900">
              Confirm Deletion
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </Dialog.Close>
          </div>

          <p className="mt-2 text-sm text-gray-600">{text}</p>

          <div className="mt-4 flex justify-end gap-3">
            <Dialog.Close asChild>
              <Button
                variant="outline"
                className="rounded-[8px] px-3 py-2 text-sm"
              >
                Cancel
              </Button>
            </Dialog.Close>
            <Button
              className="rounded-[8px] px-3 py-2 text-sm"
              variant="destructive"
              onClick={onClick}
            >
              Delete
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default DeleteConfirmation;
