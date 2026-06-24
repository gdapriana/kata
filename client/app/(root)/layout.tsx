"use client"

import Header from "@/components/custom/header/header"
import { ReactNode } from "react"

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <main>
      <Header />
      {children}
    </main>
  )
}
