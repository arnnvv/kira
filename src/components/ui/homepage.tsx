"use client";

import { useState } from "react";
import {
  Controller,
  type ControllerFieldState,
  type ControllerRenderProps,
  type UseFormStateReturn,
  useForm,
} from "react-hook-form";
import { useRecoilValue } from "recoil";
import { toast } from "sonner";
import { sendlinkAction } from "@/actions";
import { Combobox } from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { valueAtom } from "@/lib/atoms";
import type { Merchant } from "@/lib/db/schema";
import { Button } from "./button";

interface FormValues {
  upiId: string;
  selectedMerchant: string;
  inputValue: string;
}

export const Homepage = ({
  merchants,
}: {
  merchants: Merchant[];
}): JSX.Element => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const value = useRecoilValue(valueAtom);
  const { control, handleSubmit, watch, reset } = useForm<FormValues>({
    defaultValues: {
      selectedMerchant: "",
      inputValue: "",
      upiId: "",
    },
  });

  const inputValue = watch("inputValue");
  const upiIdValue = watch("upiId");

  const onSubmit = async (data: FormValues) => {
    try {
      if (!data.inputValue) {
        toast.error("Input value is required", {
          id: "1",
          action: {
            label: "Close",
            onClick: (): string | number => toast.dismiss("1"),
          },
        });
        return;
      }
      if (!data.upiId) {
        toast.error("UPI ID is required", {
          id: "2",
          action: {
            label: "Close",
            onClick: (): string | number => toast.dismiss("2"),
          },
        });
        return;
      }
      if (value === "") {
        toast.error("Please select a merchant", {
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
      if ("success" in res) {
        toast.success(res.success, {
          id: "4",
          action: {
            label: "Close",
            onClick: (): string | number => toast.dismiss("4"),
          },
        });
        reset(); // Reset form fields on successful submission
      } else if (res.error) {
        toast.error(res.error, {
          id: "5",
          action: {
            label: "Close",
            onClick: (): string | number => toast.dismiss("5"),
          },
        });
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
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
              Report a Link/Number
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
                  placeholder="Enter spam URL or phone number"
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
              Your UPI ID
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
                  placeholder="yourname@bank"
                  className="p-2 border border-gray-300 rounded-lg w-full"
                  {...field}
                />
              )}
            />
          </div>

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
            <span className="font-normal">{value || "None"}</span>
          </p>
          <p className="text-gray-700 text-sm">
            <strong>Input Value:</strong>{" "}
            <span className="font-normal">{inputValue || "None"}</span>
          </p>
          <p className="text-gray-700 text-sm">
            <strong>UPI ID:</strong>{" "}
            <span className="font-normal">{upiIdValue || "None"}</span>
          </p>
        </div>
      </div>
    </div>
  );
};
