import * as React from "react"

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

import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { TeamSwitcher } from "@/components/team-switcher"
import request from "@/utils/request";

import { useAuth } from "@/context/authContext";


const getUserData = async (navigate) => {
  const encryptedEmail = localStorage.getItem("encryptedEmail");
  const { logout } = useAuth();
  
  try {
    const response = await request({
      route: "/api/users/get/:email",
      type: "GET",
      routeParams: {
        email: encodeURIComponent(encryptedEmail),
      },
    });

    return {
      name: response.data.name,
      email: response.data.email,
      avatarFallback: response.data.name.charAt(0) + response.data.surname.charAt(0),
    };
  } catch (error) {
    console.error(error);

    if (error.sessionExpired) {
      navigate('/');
      logout();
    }

    return {
      name: "Test",
      email: "User",
      avatarFallback: "TU",
    };
  }
};

// This is sample data.
const data = {
  navMain: [
    {
      title: "Productivity & Profit",
      url: "/profit",
      icon: LineChart,
      isActive: true,
    },
    {
      title: "Forecasting",
      url: "/forecasting",
      icon: CalendarCheck,
    },
    {
      title: "Technical Expertise",
      url: "/technical",
      icon: FileText,
    },
    {
      title: "Leadership",
      url: "/leadership",
      icon: Award,
    },
    {
      title: "Teamwork",
      url: "/teamwork",
      icon: Users,
    },
    {
      title: "Firm Development",
      url: "/firm-dev",
      icon: Building,
    },
    {
      title: "Knowledge Management",
      url: "/knowledge-management",
      icon: BookOpen,
    },
    {
      title: "Business Development",
      url: "/business-dev",
      icon: Network,
    },
  ]
}

const AppSidebar = ({ ...props }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await getUserData(navigate);
        setUser(userData);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  return (
    (<Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        {loading ? (
          <div>Loading user data...</div>
        ) : (
          <NavUser user={user} />
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>)
  );
}

export { AppSidebar };