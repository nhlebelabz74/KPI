import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const encryptedEmail = localStorage.getItem("encryptedEmail");
      setIsAuthenticated(!!(encryptedEmail && localStorage.getItem("accessToken")));
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = (encryptedEmail, accessToken) => {
    localStorage.setItem("encryptedEmail", encryptedEmail);
    localStorage.setItem("accessToken", accessToken);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("encryptedEmail");
    localStorage.removeItem("accessToken");
    setIsAuthenticated(false);
  };

  // Add this useEffect to sync logout across all tabs
  useEffect(() => {
    const syncLogout = (event) => {
      if ((event.key === "encryptedEmail" || event.key === "accessToken" ) && (!event.newValue)) {
        setIsAuthenticated(false);
      }
    };
    window.addEventListener("storage", syncLogout);
    return () => window.removeEventListener("storage", syncLogout);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);