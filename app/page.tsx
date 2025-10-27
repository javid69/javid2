import CTASection from "@/components/CTASection";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-[-30%] h-[480px] bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.35),rgba(14,165,233,0.08),transparent)] blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 w-[42%] max-w-[560px] bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.12),transparent)] blur-[140px]"
      />
      <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col items-center justify-center px-6 py-16 sm:px-10">
        <CTASection />
      </main>
    </div>
  );
}
