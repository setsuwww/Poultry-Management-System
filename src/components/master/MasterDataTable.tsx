"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { MasterDataForm } from "./MasterDataForm";
import { 
  deleteFarmAction, 
  deleteDriverAction, 
  deleteVehicleAction 
} from "@/actions/master";

type Entity = { id: string; [key: string]: any };

type Props = {
  title: string;
  entityType: "farm" | "driver" | "vehicle";
  data: Entity[];
  displayField: string;
  displayLabel: string;
};

export function MasterDataTable({ title, entityType, data, displayField, displayLabel }: Props) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editItem, setEditItem] = useState<Entity | null>(null);

  const handleEdit = (item: Entity) => {
    setEditItem(item);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setEditItem(null);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus data ini?")) return;

    let res;
    if (entityType === "farm") res = await deleteFarmAction(id);
    else if (entityType === "driver") res = await deleteDriverAction(id);
    else if (entityType === "vehicle") res = await deleteVehicleAction(id);

    if (res?.error) {
      alert(res.error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{title}</h2>
        <button
          onClick={handleAddNew}
          className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus className="h-4 w-4" />
          Tambah Baru
        </button>
      </div>

      <div className="border rounded-xl overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-mist-700 uppercase bg-mist-50 dark:bg-mist-900/50 dark:text-mist-400">
            <tr>
              <th className="px-6 py-4 font-medium w-16 text-center">No</th>
              <th className="px-6 py-4 font-medium">{displayLabel}</th>
              <th className="px-6 py-4 font-medium w-32 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-mist-500">
                  Data masih kosong.
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr key={item.id} className="border-t dark:border-mist-800 hover:bg-mist-50 dark:hover:bg-mist-900/50">
                  <td className="px-6 py-4 text-center text-mist-500">{index + 1}</td>
                  <td className="px-6 py-4 font-medium">{item[displayField]}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors dark:text-blue-400 dark:hover:bg-blue-900/30"
                        title="Edit"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors dark:text-red-400 dark:hover:bg-red-900/30"
                        title="Hapus"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <MasterDataForm
        isOpen={isFormOpen}
        setIsOpen={setIsFormOpen}
        entityType={entityType}
        editItem={editItem}
        displayField={displayField}
        displayLabel={displayLabel}
      />
    </div>
  );
}
