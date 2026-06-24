import { createAuthClient } from "better-auth/react"
export const authClient = createAuthClient({
    baseURL: process.env.NODE_ENV !== "production" ? process.env.NEXT_PUBLIC_SERVER_URL : "https://kataserver.vercel.app",
    fetchOptions: {
        credentials: "include",
    },
})