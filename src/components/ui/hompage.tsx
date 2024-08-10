"use client";

import { useForm, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Combobox } from "@/components/ui/combobox";
import { Merchant } from "@/lib/db/schema";

// Define the interface for props
interface HomeProps {
    merchants: Merchant[];
}

// Define the types for form values
interface FormValues {
    selectedMerchant: string;
    inputValue: string;
}

export default function Home({ merchants }: HomeProps) {
    // Initialize React Hook Form
    const { control, handleSubmit, watch, setValue } = useForm<FormValues>({
        defaultValues: {
            selectedMerchant: "",
            inputValue: ""
        }
    });

    // Watch the form values
    const inputValue = watch("inputValue");

    // Handle form submission
    const onSubmit = (data: FormValues) => {
        console.log("Selected Merchant:", data.selectedMerchant);
        console.log("Input Value:", data.inputValue);
    };

    return (
        <div className="p-4 max-w-md mx-auto">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Input Box using shadcn Input component */}
                <div className="flex flex-col">
                    <label htmlFor="inputValue" className="mb-2 text-lg font-medium">Input Box</label>
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
                    <label htmlFor="selectedMerchant" className="mb-2 text-lg font-medium">Select Merchant</label>
                    <Controller
                        name="selectedMerchant"
                        control={control}
                        render={({ field }) => (
                            <Combobox
                                merchants={merchants}
                            />
                        )}
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
                >
                    Submit
                </button>
            </form>

            {/* Display Values (Optional) */}
            <div className="mt-4">
                <p><strong>Selected Merchant:</strong> {watch("selectedMerchant")}</p>
                <p><strong>Input Value:</strong> {inputValue}</p>
            </div>
        </div>
    );
}
