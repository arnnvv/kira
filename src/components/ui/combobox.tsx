"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Merchant } from "@/lib/db/schema";
import { useRecoilState } from "recoil";
import { valueAtom } from "@/lib/atoms";
import { useState } from "react";

export function Combobox({
  merchants,
}: {
  merchants: Merchant[];
}): JSX.Element {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useRecoilState(valueAtom);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? merchants.find(
                (merchant: Merchant): boolean => merchant.name === value,
              )?.email
            : "Select framework..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search framework..." />
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {merchants.map(
                (merchant: Merchant): JSX.Element => (
                  <CommandItem
                    key={merchant.id}
                    value={merchant.name!}
                    onSelect={(currentValue: string): void => {
                      setValue(currentValue === value ? "" : currentValue);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === merchant.name ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {merchant.name}
                  </CommandItem>
                ),
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
