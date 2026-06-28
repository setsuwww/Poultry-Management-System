"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/_ui/tabs";
import { MasterDataTable } from "./MasterDataTable";

type Entity = { id: string; name?: string; plateNo?: string };

type Props = {
  farms: Entity[];
  drivers: Entity[];
  vehicles: Entity[];
};

export function MasterTabsUI({ farms, drivers, vehicles }: Props) {
  return (
    <div className="bg-white dark:bg-mist-950 p-6 rounded-xl border shadow-sm">
      <Tabs defaultValue="farms" className="w-full">
        <TabsList className="mb-6 bg-mist-100 dark:bg-mist-900">
          <TabsTrigger value="farms">Kandang (Farm)</TabsTrigger>
          <TabsTrigger value="drivers">Supir (Driver)</TabsTrigger>
          <TabsTrigger value="vehicles">Kendaraan (No. Polisi)</TabsTrigger>
        </TabsList>

        <TabsContent value="farms">
          <MasterDataTable 
            title="Data Kandang" 
            entityType="farm" 
            data={farms} 
            displayField="name" 
            displayLabel="Nama Kandang"
          />
        </TabsContent>

        <TabsContent value="drivers">
          <MasterDataTable 
            title="Data Supir" 
            entityType="driver" 
            data={drivers} 
            displayField="name" 
            displayLabel="Nama Supir"
          />
        </TabsContent>

        <TabsContent value="vehicles">
          <MasterDataTable 
            title="Data Kendaraan" 
            entityType="vehicle" 
            data={vehicles} 
            displayField="plateNo" 
            displayLabel="Nomor Polisi"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
