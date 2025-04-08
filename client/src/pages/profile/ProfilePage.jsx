import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/authContext";
import request from "@/utils/request";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { logout } = useAuth();

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

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading profile...</div>;
  }

  return (
    <div className="min-h-screen p-4 md:p-8 flex items-center">
      <div className="max-w-4xl mx-auto">
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
    </div>
  );
};

// Same getUserData function from the original file
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
      role: user.position
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