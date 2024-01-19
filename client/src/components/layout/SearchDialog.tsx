import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { DialogProps } from "@radix-ui/react-dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SearchDialog({ onOpenChange, ...props }: DialogProps) {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  return (
    <Dialog {...props} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Search Everything</DialogTitle>
        </DialogHeader>
        <div className="py-[20px] flex space-x-[10px]">
          <Input
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search...."
          />
          <Button
            onClick={() => {
              onOpenChange?.(false);
              navigate(`/search?context=${search}`);
            }}
          >
            Search
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
