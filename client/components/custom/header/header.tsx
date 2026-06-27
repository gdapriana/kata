import Hamburger from "@/components/custom/header/hamburger"
import Profile from "@/components/custom/header/profile"
import { Button } from "@/components/ui/button"
import { NAV, NavType } from "@/lib/constant"
import { AlignJustify } from "lucide-react"
import Link from "next/link"

export default function Header() {
  return (
    <header className="fixed top-0 z-99 w-full border-b bg-background p-6">
      <div className="container">
        <div className="flex items-center justify-between">
          <h1 className="font-serif text-xl font-black">kata.</h1>

          <nav className="hidden items-center justify-center md:flex">
            {NAV.map((item: NavType, idx: number) => (
              <Button asChild key={idx} variant="ghost">
                <Link href={item.url}>{item.name}</Link>
              </Button>
            ))}

            <Profile />
          </nav>

          <Hamburger />
        </div>
      </div>
    </header>
  )
}
