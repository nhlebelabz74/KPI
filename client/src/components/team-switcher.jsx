import * as React from "react"
import { Scroll } from "lucide-react"

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const TeamSwitcher = () => {

  return (
    (<SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <div
            className="bg-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-sm"
          >
            <Scroll className="size-4"/>
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">KPI Tracker</span>
            <span className="truncate text-xs">LNP Beyond Legal</span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>)
  );
}

export { TeamSwitcher };