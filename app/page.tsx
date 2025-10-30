"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 bg-background text-foreground">

      <main className="flex flex-col items-center justify-center flex-1 px-4 md:px-8 text-center container mx-auto">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
          TacTics & Toes
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl">
          Explore a collection of classic and unique Tic-Tac-Toe experiences. Challenge your mind with different dimensions and strategic depths.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl w-full">
          <Card className="group w-full h-64 flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] hover:shadow-xl animate-in fade-in-up border-2 group-hover:border-primary">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Classic Tic-Tac-Toe</CardTitle>
              <CardDescription>The original 3x3 grid game.</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-muted-foreground">Play against a friend or the AI in the timeless classic.</p>
            </CardContent>
            <CardFooter>
              <Button className="w-full max-w-xs mx-auto hover:bg-primary/80" onClick={() => router.push("/classic")}>
                Play Now
              </Button>
            </CardFooter>
          </Card>

          <Card className="group w-full h-64 flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] hover:shadow-xl animate-in fade-in-up delay-100 border-2 group-hover:border-primary">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Tic-Tac-Poof</CardTitle>
              <CardDescription>Disappearing moves, no draws. Master new strategies.</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-muted-foreground">Disappearing moves, no draws. Master new strategies.</p>
            </CardContent>
            <CardFooter>
              <Button className="w-full max-w-xs mx-auto hover:bg-primary/80" onClick={() => router.push("/poof")}>
                Play Now
              </Button>
            </CardFooter>
          </Card>

          <Card className="group w-full h-64 flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] hover:shadow-xl animate-in fade-in-up delay-200 border-2 group-hover:border-primary">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Criss Cross</CardTitle>
              <CardDescription>Build crosses, connect three. A strategic 2D challenge.</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-muted-foreground">Master the grid, one diagonal at a time.</p>
            </CardContent>
            <CardFooter>
              <Button className="w-full max-w-xs mx-auto hover:bg-primary/80" onClick={() => router.push("/crisscross")}>
                Play Now
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>

      <footer className="w-full py-6 text-center text-muted-foreground text-sm">
        <p>&copy; {new Date().getFullYear()} TacTics & Toes. All rights reserved.</p>
      </footer>
    </div>
  );
}
