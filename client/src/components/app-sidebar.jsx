import * as React from "react"
import {
  AudioWaveform,
  Command,
  GalleryVerticalEnd,
} from "lucide-react"

import { 
  LineChart,
  CalendarCheck,
  FileText,
  Award,
  Users,
  Building,
  BookOpen,
  Network 
} from "lucide-react";

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Productivity & Profit",
      url: "#",
      icon: LineChart,
      isActive: true,
    },
    {
      title: "Forecasting",
      url: "#",
      icon: CalendarCheck,
    },
    {
      title: "Technical Expertise",
      url: "#",
      icon: FileText,
    },
    {
      title: "Leadership",
      url: "#",
      icon: Award,
    },
    {
      title: "Teamwork",
      url: "#",
      icon: Users,
    },
    {
      title: "Firm Development",
      url: "#",
      icon: Building,
    },
    {
      title: "Knowledge Management",
      url: "#",
      icon: BookOpen,
    },
    {
      title: "Business Development",
      url: "#",
      icon: Network,
    },
  ],
  // projects: [
  //   {
  //     name: "Design Engineering",
  //     url: "#",
  //     icon: Frame,
  //   },
  //   {
  //     name: "Sales & Marketing",
  //     url: "#",
  //     icon: PieChart,
  //   },
  //   {
  //     name: "Travel",
  //     url: "#",
  //     icon: Map,
  //   },
  // ],
}

export function AppSidebar({
  ...props
}) {
  return (
    (<Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        {/* <TeamSwitcher teams={data.teams} /> */}
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>)
  );
}
