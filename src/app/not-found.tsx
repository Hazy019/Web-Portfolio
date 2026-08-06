import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#07090E] text-white flex flex-col items-center justify-center p-6 text-center space-y-6">
      <div className="font-mono text-[#8cff2e] text-sm uppercase tracking-widest">
        [ 404 // NOT FOUND ]
      </div>
      <h1 className="font-display text-4xl sm:text-6xl font-extrabold">
        Page Not Found
      </h1>
      <p className="text-slate-400 max-w-md text-sm sm:text-base leading-relaxed">
        The requested system path does not exist or has been relocated.
      </p>
      <Link
        href="/"
        className="px-6 py-3 rounded-xl bg-white text-[#07090E] font-mono font-bold text-xs hover:bg-[#8cff2e] transition-colors shadow-lg"
      >
        Return to Core →
      </Link>
    </div>
  );
}
