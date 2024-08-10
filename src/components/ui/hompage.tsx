"use client";
import { useForm, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Combobox } from "@/components/ui/combobox";
import { Merchant } from "@/lib/db/schema";
import { useRecoilValue } from "recoil";
import { valueAtom } from "@/lib/atoms";
import { sendlinkAction } from "@/actions";

export default function Home({
    merchants,
}: {
    merchants: Merchant[];
}): JSX.Element {
    const value = useRecoilValue(valueAtom);
    const { control, handleSubmit, watch } = useForm<FormValues>({
        defaultValues: {
            selectedMerchant: "",
            inputValue: "",
        },
    });

    const inputValue = watch("inputValue");

    const onSubmit = async (data: FormValues) => {
        await sendlinkAction(data, value);
        console.log("Selected Merchant:");
        console.log("Input Value:", data.inputValue);
    };

    return (
        <div className="p-4 max-w-md mx-auto">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Input Box using shadcn Input component */}
                <div className="flex flex-col">
                    <label htmlFor="inputValue" className="mb-2 text-lg font-medium">
                        Input Box
                    </label>
                    <Controller
                        name="inputValue"
                        control={control}
                        render={({ field }) => (
                            <Input
                                id="inputValue"
                                className="p-2 border border-gray-300 rounded-lg"
                                {...field}
                            />
                        )}
                    />
                </div>

                {/* Combobox for selecting merchant */}
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
                        render={({ field }): JSX.Element => (
                            <Combobox merchants={merchants} />
                        )}
                    />
                </div>

                <button
                    type="submit"
                    className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
                >
                    Submit
                </button>
            </form>

            <div className="mt-4">
                <p>
                    <strong>Selected Merchant:</strong> {value}
                </p>
                <p>
                    <strong>Input Value:</strong> {inputValue}
                </p>
            </div>
        </div>
    );
}
