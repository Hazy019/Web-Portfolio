"use client";

interface ContextPanelProps {
  sectionNum: string;
  typeText: string;
  titleText: string;
}

export function ContextPanel({ sectionNum, typeText, titleText }: ContextPanelProps) {
  return (
    <div className="p-4 rounded-xl border border-white/10 bg-slate-950/60 backdrop-blur-md text-xs font-mono text-slate-400 space-y-1 transition-all duration-300">
      <div className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        Currently Viewing
      </div>
      <div className="flex items-baseline justify-between pt-1">
        <span className="text-emerald-400 font-bold text-sm">
          [ {sectionNum || "01"} ]
        </span>
        <span className="text-[11px] text-slate-400 truncate max-w-[140px]">
          {typeText || "System Architecture"}
        </span>
      </div>
      <div className="text-white font-sans font-semibold text-sm truncate pt-0.5">
        {titleText || "HAZY Platform Overview"}
      </div>
    </div>
  );
}
