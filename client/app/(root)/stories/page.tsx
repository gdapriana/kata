import { Input } from "@/components/ui/input";

export default function Page() {
    return (
        <main className="p-6 pt-44">
            <div className="container">
                <header className="flex flex-col justify-center items-center gap-4">
                    <h1 className="font-serif font-bold text-lg">Explore the <i>Unseen</i></h1>
                    <Input className="max-w-sm" autoFocus placeholder="Type anything" />
                </header>
            </div>
        </main>
    )
}
