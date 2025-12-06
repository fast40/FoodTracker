import {
  useState,
  createContext,
  useContext,
  useEffect,
  ReactNode,
} from "react";

interface AuthContextType {
  user: string | null;
  message: string;
  login: (credentials: {
    username: string;
    password: string;
  }) => Promise<Response>;
  logout: () => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    (async () => {
      const response = await fetch(
        "http://localhost:8080/food-tracker/api/me",
        {
          credentials: "include",
        }
      );

      if (response.status === 200) {
        const json = await response.json();
        setUser(json.username);
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
    const response = await fetch(
      "http://localhost:8080/food-tracker/api/login",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      }
    );

    if (response.status === 200) {
      const json = await response.json();
      setUser(json.username);
    } else if (response.status == 401) {
      setMessage("*Incorrect credentials!");
    } else {
      setMessage("*Internal error - please try again.");
    }

    return response;
  };

  const logout = async () => {
    const response = await fetch(
      "http://localhost:8080/food-tracker/api/logout",
      {
        credentials: "include",
      }
    ).then((response) => response.json());

    setUser(null);

    return response;
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
