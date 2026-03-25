"use client";

import { Button } from "@/components/ui/button";
import { Plane } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold">
          <Plane className="h-6 w-6 text-primary" />
          <span>מתכנן טיולים</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/my-trips">
            <Button variant="ghost" size="sm">
              הטיולים שלי
            </Button>
          </Link>
          <Button variant="outline" size="sm">
            התחברות
          </Button>
        </div>
      </div>
    </nav>
  );
}
