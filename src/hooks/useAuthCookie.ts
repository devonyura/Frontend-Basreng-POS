import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useHistory } from "react-router-dom";

const COOKIE_EXPIRATION_HOURS = 15;
const COOKIE_EXPIRATION_MINUTES = COOKIE_EXPIRATION_HOURS * 60;

export const useAuth = () => {
  const [token, setToken] = useState(Cookies.get("token") || null);
  const [role, setRole] = useState(Cookies.get("role") || null);
  const history = useHistory();

  const login = (jwtToken: string) => {
    Cookies.set("token", jwtToken, { expires: COOKIE_EXPIRATION_MINUTES / (24 * 60) });
    const payload = JSON.parse(atob(jwtToken.split(".")[1]));
    Cookies.set("role", payload.data.role, { expires: COOKIE_EXPIRATION_MINUTES / (24 * 60) });
    setToken(jwtToken);
    setRole(payload.data.role);
    history.push("/student-list");
  };

  const logout = () => {
    Cookies.remove("token");
    Cookies.remove("role");
    setToken(null);
    setRole(null);
  }

  useEffect(() => {
    if (!token) {
      history.replace("/login", { isTokenExpired: true });
    }
  }, [token]);

  return { token, role, login, logout };
};
