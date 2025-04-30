"use client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useAddCancelReason } from "@/lib/api/apiHandlers/useCancelReason";
import TextInput from "@/components/TextInput";
import { Button } from "@/components/ui/button";
import { AuditAction } from "@/lib/api/apiHandlers/auditService";
import { useAuditLog } from "@/utils/useAuditLog";

type FormValues = {
  label: string;
};

const AddCancelReasonPage = () => {
  const router = useRouter();
  const { handleAudit } = useAuditLog();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  const { mutate, isPending } = useAddCancelReason();

  const onSubmit = (values: FormValues) => {
    mutate(
      { label: values.label },
      {
        onSuccess: () => {
          reset();
          handleAudit(
            "Cancellation Reason",
            "",
            AuditAction.CREATE,
            `Added new cancellation reason: ${values.label}`,
          );
          router.push("/settings");
        },
      },
    );
  };

  return (
    <div className="p-6">
      <div className="w-1/2">
        <p className="pb-6 text-[32px] font-semibold text-[#202224]">
          Add New Cancellation Reason
        </p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col items-center rounded-lg bg-white px-8 pb-12 shadow-md">
            <TextInput
              label={""}
              type="text"
              {...register("label", { required: "Reason is required" })}
              placeholder="Enter reason"
              className="mb-4 mt-10"
            />
            {errors.label && (
              <p className="mt-1 text-sm text-red-500">
                {errors.label.message}
              </p>
            )}
            <div className="flex justify-center">
              <Button
                type="submit"
                className="mt-8 w-full max-w-[287px] py-[10px]"
                disabled={isPending}
              >
                {isPending ? "Adding..." : "Add Reason"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCancelReasonPage;
