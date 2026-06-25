import LatestStories from "@/app/(root)/_components/latest-stories"
import Hero from "@/components/custom/hero/hero"
import TopUsers from "@/app/(root)/_components/user"

export default function Page() {
  return (
    <>
      <Hero />
      <LatestStories />
      <TopUsers />
    </>
  )
}
