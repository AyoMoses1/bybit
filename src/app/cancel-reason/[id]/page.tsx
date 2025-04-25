"use client";
import { useEffect } from "react";
import { use } from "react";
import { useForm } from "react-hook-form";
import {
  useCancelReasons,
  useEditCancelReasons,
} from "@/lib/api/apiHandlers/useCancelReason";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import TextInput from "@/components/TextInput";

type FormValues = {
  label: string;
};

const UpdateCancelReason = ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = use(params);
  const router = useRouter();
  const { data } = useCancelReasons();
  const { mutate } = useEditCancelReasons();
  const { register, handleSubmit, reset } = useForm<FormValues>();

  useEffect(() => {
    if (data?.complex && id) {
      const reason = data.complex[parseInt(id)];
      if (reason) {
        reset({ label: reason.label });
      }
    }
  }, [data, id, reset]);

  const onSubmit = (values: FormValues) => {
    if (!data?.complex) return;

    const updatedReasons = data.complex.map((item, index) =>
      index === parseInt(id) ? { ...item, label: values.label } : item,
    );

    mutate(updatedReasons, {
      onSuccess: () => router.push("/cancel-reason"),
    });
  };

  return (
    <div className="p-6">
      <div className="w-1/2">
        <p className="pb-6 text-[32px] font-semibold text-[#202224]">
          Edit Cancellation Reason
        </p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col items-center rounded-lg bg-white px-8 pb-12 shadow-md">
            <TextInput
              label={""}
              type="text"
              {...register("label", { required: true })}
              className="mb-4 mt-10"
              placeholder="Enter reason"
            />

            <div className="flex justify-center">
              <Button
                type="submit"
                className="mt-8 w-full max-w-[287px] py-[10px]"
              >
                Update Reason
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateCancelReason;
