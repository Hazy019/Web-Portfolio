"use client";

import {
  Video,
  Building2,
  Hexagon,
  Lightbulb,
  ShieldCheck,
  Wand2,
  FolderCode,
} from "lucide-react";

interface ProjectIconProps {
  id: string;
  className?: string;
  style?: React.CSSProperties;
}

export function ProjectIcon({ id, className = "w-5 h-5", style }: ProjectIconProps) {
  switch (id) {
    case "yt-shorts":
      return <Video className={className} style={style} />;
    case "dti-queue":
      return <Building2 className={className} style={style} />;
    case "polycon":
      return <Hexagon className={className} style={style} />;
    case "idee-cli":
      return <Lightbulb className={className} style={style} />;
    case "sentinel-view":
      return <ShieldCheck className={className} style={style} />;
    case "spell-gate":
      return <Wand2 className={className} style={style} />;
    default:
      return <FolderCode className={className} style={style} />;
  }
}
