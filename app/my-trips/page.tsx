"use client";

import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plane } from "lucide-react";

export default function MyTripsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-8">
          <h1 className="mb-6 text-2xl font-bold">הטיולים שלי</h1>
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Plane className="mb-4 h-12 w-12 text-muted-foreground" />
              <p className="mb-4 text-muted-foreground">
                עדיין אין טיולים שמורים. תכננו טיול חדש!
              </p>
              <Link href="/">
                <Button>תכננו טיול</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
