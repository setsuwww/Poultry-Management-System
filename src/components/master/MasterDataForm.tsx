"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/_ui/dialog";
import { Button } from "@/components/_ui/button";
import { Input } from "@/components/_ui/input";
import { Label } from "@/components/_ui/label";
import { 
  createFarmAction, updateFarmAction, 
  createDriverAction, updateDriverAction, 
  createVehicleAction, updateVehicleAction 
} from "@/actions/master";

type Entity = { id: string; [key: string]: any };

type Props = {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  entityType: "farm" | "driver" | "vehicle";
  editItem: Entity | null;
  displayField: string;
  displayLabel: string;
};

export function MasterDataForm({ isOpen, setIsOpen, entityType, editItem, displayField, displayLabel }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    if (editItem) {
      formData.append("id", editItem.id);
    }

    let res;
    if (entityType === "farm") {
      res = editItem ? await updateFarmAction(formData) : await createFarmAction(formData);
    } else if (entityType === "driver") {
      res = editItem ? await updateDriverAction(formData) : await createDriverAction(formData);
    } else if (entityType === "vehicle") {
      res = editItem ? await updateVehicleAction(formData) : await createVehicleAction(formData);
    }

    if (res?.error) {
      setError(res.error);
      setIsSubmitting(false);
    } else {
      setIsSubmitting(false);
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editItem ? `Edit ${displayLabel}` : `Tambah ${displayLabel}`}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {error && (
            <div className="p-3 text-sm bg-red-50 text-red-600 rounded-md border border-red-200">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor={displayField}>{displayLabel}</Label>
            <Input
              id={displayField}
              name={displayField} // name refers to the specific field like "name" or "plateNo"
              defaultValue={editItem ? editItem[displayField] : ""}
              placeholder={`Masukkan ${displayLabel}...`}
              required
            />
          </div>

          <DialogFooter className="mt-6">
            <DialogClose asChild>
              <Button type="button" variant="outline">Batal</Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting} className="bg-orange-600 hover:bg-orange-700 text-white">
              {isSubmitting ? "Menyimpan..." : "Simpan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
