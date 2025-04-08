import { useAuth } from "@/context/authContext";
import request from "@/utils/request";
import { useNavigate } from "react-router-dom";

const logout = async () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  try {
    await request({
      route: "/auth/logout",
      type: "POST",
    });

    logout();
    navigate("/"); // to be used in other apps
  } catch (error) {
    console.error("Logout error:", error.message);
  }
};

export default logout;