"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarFooter,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { EarthIcon, Github } from "lucide-react";
import { HourSelector } from "./custom/hour-selector";

export function AppSidebar({
  selectedHour,
  onHourChange,
  selectedDataset,
  onDatasetChange,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  selectedHour?: number;
  onHourChange?: (h: number) => void;
  selectedDataset?: "food" | "water" | "vulnerability";
  onDatasetChange?: (d: "food" | "water" | "vulnerability") => void;
}) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
            <EarthIcon className="size-4" />
          </div>
          <div className="flex flex-col gap-0.5 leading-none">
            <span className="font-medium">ND-GAIN</span>
          </div>
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenuItem>
            <h4 className="font-medium my-2 mx-2">Hour</h4>
            <HourSelector value={selectedHour} onChange={onHourChange} />
          </SidebarMenuItem>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarMenuItem>
            <h4 className="font-medium my-2 mx-2">Vulnerability</h4>
            <div className="flex flex-col gap-2 px-2">
              <SidebarMenuButton
                onClick={() => onDatasetChange?.("vulnerability")}
                data-active={selectedDataset === "vulnerability"}
              >
                Vulnerability
              </SidebarMenuButton>
              <p className="text-xs text-gray-500 mt-1">
                Overall country susceptibility to climate and other shocks —
                combines exposure, sensitivity and adaptive capacity.
              </p>
              <SidebarMenuButton
                onClick={() => onDatasetChange?.("food")}
                data-active={selectedDataset === "food"}
              >
                Food
              </SidebarMenuButton>
              <p className="text-xs text-gray-500 mt-1">
                Food sector vulnerability: agriculture, nutrition and food
                systems resilience.
              </p>
              <SidebarMenuButton
                onClick={() => onDatasetChange?.("water")}
                data-active={selectedDataset === "water"}
              >
                Water
              </SidebarMenuButton>
              <p className="text-xs text-gray-500 mt-1">
                Water sector vulnerability: water availability, access, and
                infrastructure resilience.
              </p>
            </div>
          </SidebarMenuItem>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="items-center justify-between gap-2 p-2">
          <a
            href="#"
            className="flex items-center gap-2 text-sm text-sidebar-foreground/80 hover:underline justify-center my-4"
          >
            <Github className="size-6" />
          </a>
          <div className="text-sm text-sidebar-foreground/70 flex items-center gap-2 justify-center">
            built with <span aria-hidden>❤️</span> by{" "}
            <a href="#" className="underline">
              Archit Gupta
            </a>
          </div>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
