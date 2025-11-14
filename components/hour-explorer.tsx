"use client";

import React, { useState } from "react";
import { AppSidebar } from "./app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useLocationHour } from "@/lib/queries/location-data";
import WorldMap from "./react-map";

export function HourExplorer() {
  const [hour, setHour] = useState<number>(0);
  const [dataset, setDataset] = useState<"food" | "water" | "vulnerability">(
    "vulnerability"
  );
  const { data } = useLocationHour(hour);

  return (
    <SidebarProvider>
      <AppSidebar
        selectedHour={hour}
        onHourChange={setHour}
        selectedDataset={dataset}
        onDatasetChange={(d) => setDataset(d)}
      />
      <SidebarInset className="max-h-screen overflow-hidden flex flex-col">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="font-medium">
            Notre Dame Global Adaptation Initiative Country Index
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-2 max-h-screen">
          <div className="bg-muted/50 flex-1 min-h-0 rounded-xl md:min-h-min p-4 overflow-hidden">
            <WorldMap points={data ?? []} dataset={dataset} />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default HourExplorer;
