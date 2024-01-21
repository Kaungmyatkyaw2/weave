import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { Button } from "../ui/button";

interface Props {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
}

export default function PrivacySelectBox({ value, setValue }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[130px] text-[14px] h-[30px] justify-between text-black capitalize"
        >
          {value == "PRIVATE" ? "Private" : "Public"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[130px] p-0">
        <Command>
          <CommandGroup>
            {["Private", "Public"].map((val) => (
              <CommandItem
                key={val}
                value={val}
                onSelect={() => {
                  setValue(val.toLocaleUpperCase());
                  setOpen(false);
                }}
                className="capitalize"
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === val.toUpperCase() ? "opacity-100" : "opacity-0"
                  )}
                />
                {val}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
