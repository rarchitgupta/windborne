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
  const { data, isLoading, isError, error, refetch } = useLocationHour(hour);

  return (
    <SidebarProvider>
      <AppSidebar selectedHour={hour} onHourChange={setHour} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="font-medium">Hour Explorer — {hour}</div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-2">
          <div className="bg-muted/50 flex-1 min-h-0 rounded-xl md:min-h-min p-4">
            <WorldMap />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default HourExplorer;
