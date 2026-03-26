import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";
import TripForm from "@/components/TripForm";

export default function NewTripPage() {
  return (
    <div className="min-h-screen bg-[#fff8f2] text-[#1e1b18] pb-24">
      <Navbar />
      <main className="pt-24 px-4 max-w-4xl mx-auto">
        {/* Hero */}
        <section className="mb-10 text-right">
          <span className="text-[#00677e] font-bold tracking-widest text-xs uppercase mb-2 block">התחלה חדשה</span>
          <h2
            className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            תכנן את המסע הבא שלך
          </h2>
          <p className="text-[#56423e] text-lg max-w-2xl leading-relaxed">
            צרו זיכרונות חדשים. הגדירו את היעד, המועד והסגנון של ההרפתקה הבאה שלכם בתוך רגעים ספורים.
          </p>
        </section>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-12 border border-[#ddc0ba]/20">
          <div className="grid grid-cols-1 md:grid-cols-5 h-full">
            {/* Decorative Image */}
            <div className="md:col-span-2 relative hidden md:block overflow-hidden">
              <img
                alt="Tropical Beach"
                className="absolute inset-0 w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDGsDbMO_tfT7_-o19Ze1IUQ4BGBaWek0m9fbXzbZ4jP7-LhpyJPeAWdHffbw8sXhEPaEO6rBJizao0O0JbXbtt-iBXzOwO21M04RycaEwssvqrG9lPT3IyROJ_6Ompf5dMC6hin9uR9o27OB73Qj0SB2YZOZtLiyTwpLzTn3RyKImOn0yAO30PyasPHyNfE2LUL4s5AdhbusfNMo7Ex0Lx7kUnHxuReCfyI7KkOs3Q79Hm-ekExmGK9kKgOdcAxwDPeTQGaK67HkLS"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#9f402d]/60 to-transparent flex flex-col justify-end p-8 text-white">
                <span className="material-symbols-outlined text-4xl mb-4">explore</span>
                <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  לאן נטייל הפעם?
                </h3>
                <p className="text-sm opacity-90 leading-relaxed">
                  &ldquo;העולם הוא ספר, ואלו שאינם מטיילים קוראים רק דף אחד.&rdquo;
                </p>
              </div>
            </div>

            {/* Form */}
            <div className="md:col-span-3 p-8 md:p-12">
              <TripForm />
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-[#cb8241] p-6 rounded-xl text-[#462200] md:col-span-2 flex flex-col justify-between min-h-[160px]">
            <div>
              <span className="material-symbols-outlined text-3xl mb-2">auto_awesome</span>
              <h4 className="text-xl font-bold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>הצעה חכמה</h4>
              <p className="text-sm opacity-80">בציר הזמן של פירנצה מומלץ להוסיף ביקור בגלריית אופיצי בשעות הבוקר המוקדמות.</p>
            </div>
          </div>
          <div className="bg-[#f3ede7] p-6 rounded-xl flex flex-col items-center justify-center text-center">
            <span className="material-symbols-outlined text-[#00677e] text-4xl mb-2">cloud</span>
            <p className="text-sm font-medium">מזג אוויר צפוי</p>
            <p className="text-2xl font-bold">24°C</p>
            <p className="text-xs text-[#56423e]">שמשי ונעים</p>
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
