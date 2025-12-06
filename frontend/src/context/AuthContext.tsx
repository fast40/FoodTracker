import {
  useState,
  createContext,
  useContext,
  useEffect,
  ReactNode,
} from "react";

import { User } from "@/types";
import { api } from "@/services/api";

interface AuthContextType {
  user: User | null;
  message: string;
  login: (credentials: { username: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const user = await api.auth.me();
        setUser(user);
      } catch (e) {
        // Not logged in
      }
    })();
  }, []);

  const login = async ({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) => {
    try {
      const user = await api.auth.login({ username, password });
      setUser(user);
      setMessage("");
    } catch (e: any) {
      if (e.message.includes("401")) {
        setMessage("*Incorrect credentials!");
      } else {
        setMessage("*Internal error - please try again.");
      }
      throw e;
    }
  };

  const logout = async () => {
    await api.auth.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, message, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) throw new Error("useAuth can only be used inside AuthProvider");

  return context;
}
