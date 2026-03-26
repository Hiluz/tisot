import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#fff8f2] text-[#1e1b18] pb-24">
      <Navbar />
      <main className="pt-24 px-6 max-w-screen-xl mx-auto">
        {/* Hero Section */}
        <section className="mb-10">
          <div className="flex flex-col gap-2 mb-6">
            <h1 className="text-3xl font-extrabold tracking-tight leading-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              שלום, הרפתקן
            </h1>
            <p className="text-[#56423e] text-lg">לאן ננדוד הפעם?</p>
          </div>
          <div className="relative group">
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-[#9f402d]">travel_explore</span>
            </div>
            <input
              className="w-full bg-[#eee7e1] border-none rounded-xl py-4 pr-12 pl-4 focus:ring-2 focus:ring-[#9f402d]/20 focus:bg-white transition-all duration-300 placeholder:text-[#56423e]/60"
              placeholder="חפש יעד או סוג חופשה..."
              type="text"
            />
          </div>
        </section>

        {/* Quick Actions */}
        <section className="mb-14">
          <div className="flex justify-between items-end mb-6">
            <h2 className="text-xl font-bold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>תכנון מהיר</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#cb8241] text-[#462200] p-6 rounded-xl flex flex-col justify-between h-40 cursor-pointer active:scale-95 transition-transform">
              <span className="material-symbols-outlined text-3xl">auto_awesome</span>
              <span className="font-bold text-lg leading-tight">הצעת מסלול AI</span>
            </div>
            <div className="bg-[#e8e1dc] p-6 rounded-xl flex flex-col justify-between h-40 cursor-pointer active:scale-95 transition-transform">
              <span className="material-symbols-outlined text-3xl text-[#00677e]">map</span>
              <span className="font-bold text-lg leading-tight">יעד חדש</span>
            </div>
            <div className="bg-[#e8e1dc] p-6 rounded-xl flex flex-col justify-between h-40 cursor-pointer active:scale-95 transition-transform">
              <span className="material-symbols-outlined text-3xl text-[#9f402d]">calendar_month</span>
              <span className="font-bold text-lg leading-tight">בדיקת תאריכים</span>
            </div>
            <Link href="/new-trip" className="bg-[#9f402d]/10 p-6 rounded-xl border-2 border-dashed border-[#9f402d]/30 flex flex-col items-center justify-center h-40 cursor-pointer hover:bg-[#9f402d]/20 transition-colors">
              <span className="material-symbols-outlined text-4xl text-[#9f402d] mb-2">add_circle</span>
              <span className="font-bold">צור טיול</span>
            </Link>
          </div>
        </section>

        {/* My Trips */}
        <section className="mb-20">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>הטיולים שלי</h2>
            <Link href="/my-trips" className="text-[#00677e] font-medium flex items-center gap-1 hover:underline">
              כל הטיולים
              <span className="material-symbols-outlined text-sm">chevron_left</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Trip Card 1 */}
            <div className="relative flex flex-col group cursor-pointer">
              <div className="relative h-80 w-full overflow-hidden rounded-xl shadow-lg shadow-stone-200/50">
                <img
                  alt="Venice Italy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuD0_R03hNVNDheLLH0eHBikP-LHvN18r_aeMCfqWZiyIgDXMgYkcanGkO30_Wc_1ffhkzwhef3cWsRqYmXXqxnmjdeper12BtbAeGzypETcL6X4YvNi4EPQhDOMEHiJEzWHwEBZtBaeGcT49s8p7Waq3IaQA5bq9iEbNp5mqD26g6BczZ3CNWvDNFwrOJu_SUMhHBEDI4h_W4PINmhx2rJO4d-LuLB-MgCyB6XTBtshIeFMs3Hac45BY_2C_70pUw8vl5xsN2TeFZRz"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-[#9f402d] uppercase tracking-widest">
                  בקרוב
                </div>
              </div>
              <div className="mt-[-40px] relative z-10 bg-white mx-6 p-6 rounded-xl shadow-xl shadow-stone-200/20">
                <h3 className="text-xl font-bold mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>חופשה רומנטית בוונציה</h3>
                <div className="flex items-center gap-4 text-sm text-[#56423e]">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">calendar_today</span>
                    12-18 באוקטובר
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">group</span>
                    2 נוסעים
                  </span>
                </div>
              </div>
            </div>

            {/* Trip Card 2 */}
            <div className="relative flex flex-col group cursor-pointer">
              <div className="relative h-80 w-full overflow-hidden rounded-xl shadow-lg shadow-stone-200/50">
                <img
                  alt="Agra India"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBvkqa5d3294pZmXl2Pd8F6MELRmVrAMkJEDbr473taaj5E1ilq6CYblgfdhsUwr2-rq21LCZEorO9-zsyvTHUDKkJCNrrPz-4PbETvnqapjy4xqEdxjtf3J_Ej0psw1eRT4GLruQQchhCn9-IAfBkq31TszEuuD11JucHE75mPHphinzK4gGpHFZc8nLBlwfY_wl6SZ5Y-caiEJO6hixzns71O8CpGsxv4j7MkxC11YUh70rHxh9of7peak1dD5qV8op6l_0vU1sXl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-[#00677e] uppercase tracking-widest">
                  בתכנון
                </div>
              </div>
              <div className="mt-[-40px] relative z-10 bg-white mx-6 p-6 rounded-xl shadow-xl shadow-stone-200/20">
                <h3 className="text-xl font-bold mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>מסע קולינרי בהודו</h3>
                <div className="flex items-center gap-4 text-sm text-[#56423e]">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">calendar_today</span>
                    05-20 בדצמבר
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">group</span>
                    4 נוסעים
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Inspiration Banner */}
        <section className="mb-12">
          <div className="bg-[#f3ede7] rounded-xl p-8 flex flex-col md:flex-row items-center gap-8 overflow-hidden relative">
            <div className="flex-1 z-10">
              <h2 className="text-2xl font-bold mb-3 tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>זקוק להשראה?</h2>
              <p className="text-[#56423e] mb-6 max-w-md">
                גלה את פניני החמד הנסתרות של הים התיכון במדריך העריכה החדש שלנו לסתיו 2024.
              </p>
              <button className="bg-gradient-to-tr from-[#9f402d] to-[#e2725b] text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-[#9f402d]/20 hover:scale-105 transition-transform active:scale-95">
                קרא עוד במגזין
              </button>
            </div>
            <div className="w-full md:w-1/3 h-48 md:h-64 rounded-xl overflow-hidden shadow-2xl rotate-3 translate-x-4 md:translate-x-8">
              <img
                alt="Cinque Terre Italy"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBijxk012t7LR1K6zPGVtFU8smQ5dS1MKCVl4idKqpE0o24xA4eMIcR6k6xJO5P39yAD8kNOtzrmQPkr8gMAsKis4wSkeP-uI_5aZftYdvs35aFk6Pmyru_D7wMIxrc-6Jjz1fULYFQUh9hn9grK81yknhieWI19B3Uz7nnBE6DFXx5X0WCNTcKPSktPdsjxYfU0AYBV9s8vnqZfwrmJHBgkkObUypRasjeYY64S-YFDqJNb6TMYjzTX5HWkoaPeZbLKxgXPXFlFCbp"
              />
            </div>
          </div>
        </section>
      </main>
      <BottomNav />
    </div>
  );
}
