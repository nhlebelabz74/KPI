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

// Modified to receive logout as a parameter
const getUserData = async (encryptedEmail, navigate, logout) => {
  try {
    const response = await request({
      route: "/users/get/:email",
      type: "GET",
      routeParams: {
        email: encodeURIComponent(encryptedEmail),
      },
    });

    const user = response.data.user;

    return {
      name: user.name,
      email: user.email,
      avatarFallback: user.name.charAt(0) + user.surname.charAt(0),
      role: user.position,
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

const data = {
  navMain: [
    {
      title: "Productivity & Profit",
      url: "/profit",
      icon: LineChart,
      isActive: true,
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
      url: "/knowledge",
      icon: BookOpen,
    },
    {
      title: "Business Development",
      url: "/business",
      icon: Network,
    },
  ]
}

const AppSidebar = ({ ...props }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { logout } = useAuth(); // Moved the hook call here

  useEffect(() => {
    const fetchData = async () => {
      try {
        const encryptedEmail = localStorage.getItem("encryptedEmail");
        const userData = await getUserData(encryptedEmail, navigate, logout);
        setUser(userData);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate, logout]);

  return (
    <Sidebar collapsible="icon" {...props}>
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
    </Sidebar>
  );
}

export { AppSidebar };