import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useAuth } from "@/context/authContext";
import request from "@/utils/request";
import {
  AlertDialog, 
  AlertDialogHeader,
  AlertDialogContent, 
  AlertDialogTitle, 
  AlertDialogTrigger, 
  AlertDialogFooter,
  AlertDialogCancel, 
  AlertDialogAction
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

import { Progress } from "@/components/ui/progress";
import CryptoJS, { AES } from "crypto-js";

const SuperviseeCard = ({ supervisee }) => {
  // get progress of supervisee
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [kpiProgressCards, setKpiProgressCards] = useState([]);

  // get email from local storage
  const encryptedEmail = localStorage.getItem("encryptedEmail");
  const SECRET_KEY = import.meta.env.VITE_APP_ENCRYPTION_KEY || "default-secret-key";
  const decryptedEmail = AES.decrypt(encryptedEmail, SECRET_KEY).toString(CryptoJS.enc.Utf8);

  const cards = [
    {
      title: "Profitability",
      number: 1,
      progress: 0
    },
    {
      title: "Teamwork",
      number: 2,
      progress: 0
    },
    {
      title: "Technical Skills",
      number: 3,
      progress: 0
    },
    {
      title: "Leadership",
      number: 5,
      progress: 0
    },
    {
      title: "Firm Development",
      number: 6,
      progress: 0
    },
    {
      title: "Knowledge",
      number: 7,
      progress: 0
    },
    {
      title: "Business Development",
      number: 8,
      progress: 0
    }
  ];

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
        
        // Calculate progress for each KPI category
        const updatedCards = cards.map(card => {
          // Find all KPIs that start with the card's number
          const categoryKPIs = defaultKPIdata.filter(kpi => 
            kpi.startsWith(`${card.number}.`)
          );
          
          const completedCategoryKPIs = categoryKPIs.filter(kpi => 
            KPIs.data.completedKPIs.includes(kpi)
          );
          
          const cardProgress = categoryKPIs.length > 0 
            ? (completedCategoryKPIs.length / categoryKPIs.length) * 100 
            : 0;
            
          return {
            ...card,
            progress: cardProgress.toFixed(0),
            total: categoryKPIs.length,
            completed: completedCategoryKPIs.length
          };
        });
        
        setKpiProgressCards(updatedCards);
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
  }, [email, request, logout, navigate]); // Added dependencies to avoid lint warnings

  // Function to get color based on progress
  const getProgressColor = (progress) => {
    if (progress < 50) return "text-red-600";
    if (progress < 100) return "text-orange-400";
    return "text-green-600";
  };

  const handleNudge = async ({ kpiName, kpiProgress }) => {
    try {
      await request({
        route: "/users/nudge",
        type: "POST",
        body: {
          kpiName: kpiName,
          kpiProgress: kpiProgress, // number
          from: decryptedEmail,
          to: email,
        }
      });
    } catch (error) {
      console.error("Failed to nudge user:", error);
      if (error.sessionExpired) {
        navigate('/');
        logout();
      }
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <div className="flex justify-between items-center p-3 mb-2 border dark:border-primary cursor-pointer rounded-2xl font-semibold w-full">
          <p>{name} {surname}</p>
          <p className={`${progress < 50 ? "text-red-600" : (progress < 100 ? "text-orange-400" : "text-green-600")}`}>{progress}%</p>
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-4xl h-auto">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center text-2xl font-semibold">
            {name} {surname}
          </AlertDialogTitle>
        </AlertDialogHeader>
        <div className="flex overflow-x-auto gap-4 py-4 pb-6 px-1">
          {kpiProgressCards.map((card) => (
            <Card key={card.number} className="border dark:border-primary min-w-64 flex-shrink-0">
              <CardContent className="p-4">
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span>{card.title}</span>
                    <span className={getProgressColor(card.progress)}>
                      {card.progress}%
                    </span>
                  </div>
                  <Progress value={card.progress} className="h-2" />
                  <Button 
                    className="mt-3 px-4 py-2 hover:bg-primary/90 rounded-md w-1/2 text-sm font-medium cursor-pointer"
                    variant="secondary"
                    onClick={() => handleNudge({ kpiName: card.title, kpiProgress: card.progress })}
                  >
                    Nudge
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer">Close</AlertDialogCancel>
          <AlertDialogAction className="cursor-pointer" onClick={() => navigate(`/appraisal/${encodeURIComponent(supervisee.email)}`)}>Open Details</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

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
      supervisors: [...user.supervisor].sort((a, b) => a.localeCompare(b)),
      supervisees: [...user.supervising].sort((a, b) => a.localeCompare(b))
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