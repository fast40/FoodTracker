import { FoodLogEntry, User } from "@/types";

const API_BASE = "http://localhost:8080/food-tracker/api";

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    credentials: "include",
  });

  if (!response.ok) {
    // Try to parse error message from JSON
    try {
      const errorJson = await response.json();
      throw new Error(errorJson.message || `HTTP ${response.status}`);
    } catch (e) {
      throw new Error(`HTTP ${response.status}`);
    }
  }

  // Handle empty responses (like logout)
  const text = await response.text();
  return (text ? JSON.parse(text) : {}) as T;
}

export const api = {
  auth: {
    me: () => request<User>("/me"),
    login: (credentials: any) =>
      request<User>("/login", {
        method: "POST",
        body: JSON.stringify(credentials),
      }),
    register: (data: any) =>
      request<void>("/register", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    logout: () => request<void>("/logout"),
  },
  food: {
    log: (entry: FoodLogEntry) =>
      request<{ message: string }>("/log-item", {
        method: "POST",
        body: JSON.stringify(entry),
      }),
  },
};
