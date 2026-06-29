import { createAuthClient } from "better-auth/react";
import { expoClient } from "@better-auth/expo/client";
import * as SecureStore from "expo-secure-store";

// Use localhost:8000 as default or read from environment config
const SERVER_URL = process.env.EXPO_PUBLIC_SERVER_URL || "http://localhost:8000";

export const authClient = createAuthClient({
  baseURL: SERVER_URL,
  plugins: [
    expoClient({
      scheme: "mobile",
      storage: SecureStore,
    }),
  ],
});
