import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useAuth } from "@/context/authContext";
import request from "@/utils/request";
import {
  Dialog, 
  DialogHeader,
  DialogContent, 
  DialogTitle, 
  DialogTrigger, 
  DialogDescription, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AES } from "crypto-js";

const SuperviseeCard = ({ supervisee }) => {
  // get progress of supervisee
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);

  const { logout } = useAuth();
  const navigate = useNavigate();

  const { email, name, surname } = supervisee;

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await request({
          route: "/users/get/info/:email",
          type: "GET",
          routeParams: {
            email: encodeURIComponent(email),
          },
        });

        const KPIs = await request({
          route: "/users/get/completedKPIs/:email",
          type: "GET",
          routeParams: {
            email: encodeURIComponent(email),
          },
        }); // array of all KPI numbers
        
        const defaultKPIdata = response.data.kpiNumbers;
        const incompleteKPIs = defaultKPIdata.filter(kpi => !KPIs.data.completedKPIs.includes(kpi));
        const progressPercentage = ((defaultKPIdata.length - incompleteKPIs.length) / defaultKPIdata.length) * 100;

        setProgress(progressPercentage.toFixed(2)); // Set progress to 2 decimal places
      } catch (error) {
        console.error("Failed to fetch progress:", error);
        if (error.sessionExpired) {
          navigate('/');
          logout();
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  });

  return (
    <div className="flex justify-between items-center p-3 mb-2 border dark:border-primary cursor-pointer rounded-2xl font-semibold w-full">
      <p>{name} {surname}</p>
      <p className={`${progress < 50 ? "text-red-900" : (progress < 100 ? "text-orange-400" : "text-green-600")}`}>{progress}%</p>
    </div>
  );
}

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [supervisees, setSupervisees] = useState([]);
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const encryptedEmail = localStorage.getItem("encryptedEmail");
        const userData = await getUserData(encryptedEmail, navigate, logout);
        setUser(userData);

        const SECRET_KEY = import.meta.env.VITE_APP_ENCRYPTION_KEY || "default-secret-key";
  
        // Fetch detailed data for each supervisee
        const superviseeData = await Promise.all(
          userData.supervisees.map((supervisee) =>
            getUserData(AES.encrypt(supervisee, SECRET_KEY).toString(), navigate, logout)
          )
        );
        
        // remove the "test" user if found
        const filteredSuperviseeData = superviseeData.filter(s => s.name !== "Test" && s.surname !== "User");
        setSupervisees(filteredSuperviseeData);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [navigate, logout]);
  
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading profile...</div>;
  }

  return (
    <div className="min-h-screen p-8 flex items-center flex-row gap-4 justify-center max-md:flex-col">
      <div className="max-w-4xl">
        <Card className="w-full border shadow-lg dark:border-primary">
          <CardHeader className="border-b dark:border-primary">
            <div className="flex items-center justify-between">
              <CardTitle>Profile Information</CardTitle>
              <Button variant="outline" onClick={() => navigate(`/home/${user.role}`)}>
                Go Back Home
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
              <div className="flex flex-col items-center gap-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="" />
                  <AvatarFallback className="text-2xl">
                    {user.avatarFallback}
                  </AvatarFallback>
                </Avatar>
                <Button variant="outline" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
              <div className="flex-1 space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Name</h3>
                  <p className="dark:text-primary">{user.name} {user.surname}</p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Email</h3>
                  <p className="dark:text-primary">{user.email}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {supervisees.length > 0 && (
        <div className="p-6 flex flex-col gap-4 border dark:border-primary rounded-2xl shadow-lg max-w-xl w-2/5">
          <h3 className="text-lg font-medium">Supervisees</h3>
          <ScrollArea className="w-full mx-auto h-55 flex gap-4">
            {supervisees.map((s) => (
              <SuperviseeCard key={s.email} supervisee={s} />
            ))}
          </ScrollArea>
        </div>
      )}
    </div>
  );
};

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
      surname: user.surname,
      email: user.email,
      avatarFallback: user.name.charAt(0) + user.surname.charAt(0),
      role: user.position,
      supervisees: user.supervising,
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

export default ProfilePage;