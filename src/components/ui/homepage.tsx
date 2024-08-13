"use client";

import {
  useForm,
  Controller,
  ControllerRenderProps,
  ControllerFieldState,
  UseFormStateReturn,
} from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Combobox } from "@/components/ui/combobox";
import { Merchant } from "@/lib/db/schema";
import { useRecoilValue } from "recoil";
import { valueAtom } from "@/lib/atoms";
import { sendlinkAction } from "@/actions";
import { Button } from "./button";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const Homepage = ({
  merchants,
}: {
  merchants: Merchant[];
}): JSX.Element => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const value = useRecoilValue(valueAtom);
  const { control, handleSubmit, watch } = useForm<FormValues>({
    defaultValues: {
      selectedMerchant: "",
      inputValue: "",
      upiId: "",
    },
  });

  const inputValue = watch("inputValue");

  const onSubmit = async (data: FormValues) => {
    try {
      if (!data.inputValue) {
        toast.error("select input value", {
          id: "1",
          action: {
            label: "Close",
            onClick: (): string | number => toast.dismiss("1"),
          },
        });
        return;
      }
      if (!data.upiId) {
        toast.error("select upi id", {
          id: "2",
          action: {
            label: "Close",
            onClick: (): string | number => toast.dismiss("2"),
          },
        });
        return;
      }
      if (value === "") {
        toast.error("select merchant", {
          id: "3",
          action: {
            label: "Close",
            onClick: (): string | number => toast.dismiss("3"),
          },
        });
        return;
      }
      setIsLoading(true);
      const res = await sendlinkAction(data, value);
      if ("success" in res)
        toast.success(res.success, {
          id: "4",
          action: {
            label: "Close",
            onClick: (): string | number => toast.dismiss("4"),
          },
        });
    } catch (err) {
      toast.error(`something went wrong: {e}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-md w-full">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex flex-col">
            <label htmlFor="inputValue" className="mb-2 text-lg font-medium">
              Input Box
            </label>
            <Controller
              name="inputValue"
              control={control}
              render={({
                field,
              }: {
                field: ControllerRenderProps<FormValues, "inputValue">;
                fieldState: ControllerFieldState;
                formState: UseFormStateReturn<FormValues>;
              }): JSX.Element => (
                <Input
                  id="inputValue"
                  className="p-2 border border-gray-300 rounded-lg w-full"
                  {...field}
                />
              )}
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="selectedMerchant"
              className="mb-2 text-lg font-medium"
            >
              Select Merchant
            </label>
            <Controller
              name="selectedMerchant"
              control={control}
              render={(): JSX.Element => <Combobox merchants={merchants} />}
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="upiId" className="mb-2 text-lg font-medium">
              UPI ID
            </label>
            <Controller
              name="upiId"
              control={control}
              render={({
                field,
              }: {
                field: ControllerRenderProps<FormValues, "upiId">;
                fieldState: ControllerFieldState;
                formState: UseFormStateReturn<FormValues>;
              }): JSX.Element => (
                <Input
                  id="upiId"
                  className="p-2 border border-gray-300 rounded-lg w-full"
                  {...field}
                />
              )}
            />
          </div>
          <Button
            type="button"
            onClick={(): void => router.push("/checkout")}
            className="bg-blue-600 text-white p-2 rounded-lg w-full hover:bg-blue-700 mb-2"
          >
            Pay
          </Button>
          <Button
            isLoading={isLoading}
            type="submit"
            className="bg-gray-800 text-white p-2 rounded-lg w-full hover:bg-gray-900"
          >
            Submit
          </Button>
        </form>

        <div className="mt-6 space-y-2">
          <p className="text-gray-700 text-sm">
            <strong>Selected Merchant:</strong>{" "}
            <span className="font-normal">{value}</span>
          </p>
          <p className="text-gray-700 text-sm">
            <strong>Input Value:</strong>{" "}
            <span className="font-normal">{inputValue}</span>
          </p>
          <p className="text-gray-700 text-sm">
            <strong>UPI ID:</strong>{" "}
            <span className="font-normal">{watch("upiId")}</span>
          </p>
        </div>
      </div>
    </div>
  );
};
