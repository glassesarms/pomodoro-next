import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
    return (
	<main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
	    <h1 className="text-3xl font-bold">Welcome to Pomodoro</h1>
	    <Link
		href="/timer"
	    >
		<Button className="mt-4">Go to Timer</Button>
	    </Link>
	</main>
    );
}
