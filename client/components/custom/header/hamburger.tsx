import Profile from "@/components/custom/header/profile"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet"
import { NAV, NavType } from "@/lib/constant"
import { AlignJustify } from "lucide-react"
import Link from "next/link"

export default function Hamburger() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="md:hidden" size="icon">
          <AlignJustify />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader></SheetHeader>
        <nav className="flex flex-col items-stretch justify-start p-6 md:hidden">
          {NAV.map((item: NavType, idx: number) => (
            <Button asChild key={idx} variant="ghost">
              <Link href={item.url}>{item.name}</Link>
            </Button>
          ))}
          <div className="flex justify-center items-center mt-2">
            <Profile />
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
