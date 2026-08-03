"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";

function LazyMap({ src, title }: { src: string; title: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={ref} className="relative w-full h-32 overflow-hidden rounded-xl border border-slate-800/80 shadow-md bg-slate-900">
      {visible ? (
        <iframe
          src={src}
          title={title}
          className="absolute inset-0 w-full h-full border-0"
          allowFullScreen
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-slate-600 text-xs">Map loading...</div>
      )}
    </div>
  );
}

export function Footer() {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return null;
  }
  return (
    <footer className="relative z-10 border-t border-slate-800/80 bg-slate-950/80 mt-auto">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center mb-4">
              <Logo className="h-7" />
            </Link>
            <p className="text-slate-400 text-sm max-w-sm">
              Master the markets with professional guidance. Join our online
              or offline batches and prove your skills in our trading
              challenges.
            </p>
          </div>
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-slate-200 tracking-wider uppercase mb-4">
              Kochi Branch
            </h3>
            <LazyMap
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3927.212819308246!2d76.36767917451024!3d10.163349170203691!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b0807c7b0e94c2b%3A0x5063d5823da7bb9e!2sTrade%20Talks%20Stock%20Market%20Trading%20Courses%20Kochi!5e0!3m2!1sen!2sin!4v1782625191798!5m2!1sen!2sin"
              title="Kochi Branch Map"
            />
          </div>
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-slate-200 tracking-wider uppercase mb-4">
              Kozhikode Branch
            </h3>
            <LazyMap
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3912.9044635197156!2d75.77647617452314!3d11.268432849926953!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba659e0fc895955%3A0xfc623bdd54154e1e!2sTrade%20Talks%20Stock%20Market%20Trading%20Courses%20in%20Kozhikode!5e0!3m2!1sen!2sin!4v1782625282390!5m2!1sen!2sin"
              title="Kozhikode Branch Map"
            />
          </div>
        </div>
        <div className="mt-12 border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
            <p className="text-sm text-slate-500">
              &copy; {new Date().getFullYear()} Trade Talks. All rights reserved.
            </p>
            <div className="hidden md:block text-slate-700">|</div>
            <div className="flex gap-4">
              <Link href="/how-it-works" className="text-xs text-slate-500 hover:text-brand-450 transition-colors">
                How it Works
              </Link>
              <Link href="/terms" className="text-xs text-slate-500 hover:text-brand-450 transition-colors">
                Terms & Conditions
              </Link>
            </div>
          </div>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a
              href="https://wa.me/919072722294"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-emerald-400 transition-colors"
            >
              <span className="sr-only">WhatsApp</span>
              <svg
                className="h-6 w-6"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.458L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.968C16.29 2.012 13.82 1.006 11.996 1.006c-5.438 0-9.863 4.37-9.867 9.801 0 1.956.513 3.868 1.488 5.56l-.974 3.556 3.644-.949-.24-.143z" />
              </svg>
            </a>
            <a
              href="https://www.instagram.com/tradetalksofficial?igsh=NTRxa3FjNGRjZTUy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-pink-500 transition-colors"
            >
              <span className="sr-only">Instagram</span>
              <svg
                className="h-6 w-6"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
