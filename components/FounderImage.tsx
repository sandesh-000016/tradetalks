"use client";

import React, { useState } from "react";
import Image from "next/image";
import { User } from "lucide-react";

export function FounderImage() {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <div className="relative group w-64 h-80 rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl flex items-center justify-center">
      {/* Animated glowing background */}
      <div className="absolute inset-0 bg-gradient-to-t from-brand-900/40 via-transparent to-transparent z-10 opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {!imgFailed ? (
        <Image
          src="/about.avif"
          alt="Sunil Mathai - Founder"
          fill
          sizes="(max-width: 768px) 100vw, 256px"
          className="object-cover object-center relative z-0 transition-transform duration-500 group-hover:scale-105"
          onError={() => setImgFailed(true)}
          priority
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900/90 text-slate-500 group-hover:text-brand-400 transition-colors p-6">
          <div className="w-16 h-16 rounded-full bg-slate-800/80 flex items-center justify-center border border-slate-700/50 mb-3 shadow-inner">
            <User className="w-8 h-8 opacity-40 text-slate-400 group-hover:text-brand-400 transition-colors" />
          </div>
          <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-1">Photo Placeholder</p>
          <p className="text-[11px] text-slate-500 text-center leading-normal">
            Upload <code className="text-brand-400">about.avif</code> to the <code className="text-slate-400">public/</code> directory
          </p>
        </div>
      )}
      
      <div className="absolute bottom-4 left-4 right-4 z-20 bg-slate-950/80 backdrop-blur-md border border-slate-800/80 px-4 py-2.5 rounded-xl text-center">
        <p className="text-sm font-semibold text-white">Sunil Mathai</p>
        <p className="text-xs text-brand-400 font-medium">Founder, Trade Talks</p>
      </div>
    </div>
  );
}
