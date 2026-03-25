import Navbar from "@/components/Navbar";
import TripForm from "@/components/TripForm";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              ✈️ לאן הטיול הבא?
            </h1>
            <p className="mt-3 text-lg text-muted-foreground">
              הזינו יעד, תקציב ותאריכים — ונבנה לכם מסלול טיול מושלם
            </p>
          </div>
          <TripForm />
        </div>
      </main>
    </div>
  );
}
