import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export default function Hero() {
  return (
    <div className="w-full p-6 pt-30">
      <div className="container">
        <div className="flex flex-col gap-4 justify-start items-stretch md:flex-row md:justify-center md:items-center">
            <div className="flex md:w-1/2 gap-4 flex-col justify-center items-start">
                <h1 className="font-serif text-3xl font-black">The Architecture of Silence: Reclaiming Deep Focus.</h1>
                <p className="text-muted-foreground">In an age of persistent digital fragmentation, how do we rebuild the cognitive spaces required for profound thought and creative breakthrough?</p>
                <div className="flex justify-center gap-1 mt-2 items-center">
                    <Button className="px-4">Start Writing</Button>
                    <Button className="px-4" variant="outline">Explore <ArrowRight /></Button>
                </div>
            </div>
            <div className="md:w-1/2">
                <Image src="https://images.unsplash.com/photo-1595411425732-e69c1abe2763?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="hero" width={500} height={800} className="w-full aspect-square" priority />
            </div>
        </div>
      </div>
    </div>
  )
}
