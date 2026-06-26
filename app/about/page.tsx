import React from "react";
import { FounderImage } from "@/components/FounderImage";

export const metadata = {
  title: "About Us | Trade Talks",
  description: "Learn about Sunil Mathai, the founder of Trade Talks, and our core trading mission.",
};

export default function About() {
  return (
    <div className="relative pt-24 pb-32 overflow-hidden bg-slate-950">
      {/* Background glow matching the new light blue theme */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-950/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 tracking-tight">
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-brand-200">Trade Talks</span>
          </h1>
          <p className="text-lg text-slate-400">
            Empowering traders through structured education, mentorship, and access to our ecosystem.
          </p>
        </div>

        {/* 3-Column Layout matching the screenshot */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Sunil's Story (col-span 5) */}
          <div className="lg:col-span-5 space-y-6 text-slate-300 leading-relaxed text-sm md:text-base">
            <p className="font-semibold text-white text-base md:text-lg border-l-2 border-brand-500 pl-4 py-1">
              At Trade Talks, we believe that trading is not gambling—it is a skill that can transform lives when approached with knowledge, discipline, and the right mindset.
            </p>
            <p>
              Our founder, <strong className="text-white">Sunil Mathai</strong>, began his journey as a civil engineering graduate from Adi Shankara Institute of Engineering. Like many middle-class students, he started with limited resources and big dreams. After a brief career in software development, Sunil discovered the stock market. What started as curiosity soon became his true calling.
            </p>
            <p>
              In the early days, trading felt like a lottery ticket—wins and losses without clarity. But with persistence, Sunil realized that success in the stock market requires structured learning, risk management, and emotional control. He invested time in mastering strategies, understanding market psychology, and building financial discipline.
            </p>
          </div>

          {/* Center Column: Sunil's Profile Picture (col-span 3) */}
          <div className="lg:col-span-3 flex justify-center py-6 lg:py-0">
            <FounderImage />
          </div>

          {/* Right Column: Trade Talks Highlights (col-span 4) */}
          <div className="lg:col-span-4 space-y-8">
            <div className="glass-panel p-6 rounded-2xl hover:border-brand-500/20 transition-all duration-300">
              <h3 className="text-base font-semibold text-brand-300 mb-2 font-display uppercase tracking-wider">
                Learn Stocks, Options
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                If you wish to be financially safe and have a bright future, you should consider learning about Stocks, Options Trading because who doesn&apos;t like to save a little?
              </p>
            </div>

            <div className="glass-panel p-6 rounded-2xl hover:border-brand-500/20 transition-all duration-300">
              <h3 className="text-base font-semibold text-brand-300 mb-2 font-display uppercase tracking-wider">
                Live Sessions On Youtube
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                We go live on our youtube channel regarding anything related to trading, and our intraday live sessions will be helpful to you as a trader or a person who dreams of being a trader.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-2xl hover:border-brand-500/20 transition-all duration-300">
              <h3 className="text-base font-semibold text-brand-300 mb-2 font-display uppercase tracking-wider">
                Access To Trade Talks Eco System
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                We invite our passionate traders to our Trade Talks community and will have the opportunity to use the trading floor. Even face-to-face in-office interaction and doubt clearance sessions.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
