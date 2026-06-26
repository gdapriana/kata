"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import dynamic from "next/dynamic"

const HeroCanvas = dynamic(() => import("./hero-canvas"), {
  ssr: false,
  loading: () => (
    <div className="relative flex h-[350px] w-full items-center justify-center md:h-[450px]">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
    </div>
  ),
})

export default function Hero() {
  return (
    <div className="w-full p-6 pt-42 md:pt-30">
      <div className="container">
        <div className="flex flex-col items-stretch justify-start gap-12 md:flex-row md:items-center md:justify-center">
          <div className="flex flex-col items-start justify-center gap-4 md:w-1/2">
            <h1 className="font-serif text-3xl font-black">
              The Architecture of Silence: Reclaiming Deep Focus.
            </h1>
            <p className="text-muted-foreground">
              In an age of persistent digital fragmentation, how do we rebuild
              the cognitive spaces required for profound thought and creative
              breakthrough?
            </p>
            <div className="mt-2 flex items-center justify-center gap-1">
              <Button className="px-4">Start Writing</Button>
              <Button className="px-4" variant="outline">
                Explore <ArrowRight />
              </Button>
            </div>
          </div>
          <div className="md:w-1/2">
            <HeroCanvas scale={0.8} />
          </div>
        </div>
      </div>
    </div>
  )
}
