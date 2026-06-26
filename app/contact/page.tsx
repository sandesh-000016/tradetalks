"use client";

import React, { useState } from "react";
import { Mail, MapPin, Phone, MessageSquare } from "lucide-react";

export default function Contact() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="pt-20 pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
            Get in Touch
          </h1>
          <p className="text-lg text-slate-400">
            Have questions about our classes or trading challenges? Our team is
            here to help you navigate your trading journey.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-1 space-y-6">
            <div className="glass-panel p-6 rounded-2xl flex items-start gap-4 border border-emerald-500/20 shadow-[0_0_15px_-5px_rgba(16,185,129,0.2)]">
              <div className="w-10 h-10 rounded-lg bg-emerald-950/50 border border-emerald-500/20 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.02-.007-.115-.062-.307-.158-.19-.096-.1.1-.399-.189-.09-.048-.165-.071-.24-.071-.077 0-.154.024-.223.078l-.348.271c-.087.067-.179.099-.275.099-.071 0-.142-.016-.21-.049-.607-.282-1.077-.661-1.399-1.026-.307-.348-.521-.734-.632-1.127-.024-.087-.015-.173.024-.249.04-.078.118-.172.2-.266.082-.093.125-.157.18-.266.059-.109.03-.223-.015-.318-.045-.096-.399-.96-.548-1.318-.145-.349-.292-.3-.399-.3-.105-.005-.226-.005-.348-.005-.122 0-.323.045-.491.229-.168.183-.642.628-.642 1.532 0 .903.659 1.776.751 1.9.092.122 1.293 1.975 3.13 2.768.437.19.779.303 1.045.387.439.14.839.12 1.156.073.353-.052 1.085-.444 1.238-.87.153-.427.153-.793.108-.87-.046-.078-.17-.123-.323-.198l-.008-.004zM12 2C6.477 2 2 6.477 2 12c0 2.01.597 3.882 1.621 5.449L2 22l4.73-.834C8.167 21.848 9.99 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.25c-1.834 0-3.52-.489-4.97-1.341l-.356-.211-2.955.521.531-2.834-.231-.368c-.933-1.488-1.435-3.219-1.435-5.017 0-4.99 4.06-9.05 9.05-9.05 4.99 0 9.05 4.06 9.05 9.05 0 4.99-4.06 9.05-9.05 9.05z" fillRule="evenodd" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold mb-1 text-emerald-400">WhatsApp Support</h3>
                <p className="text-sm text-slate-400 mb-2">
                  Connect with us instantly.
                </p>
                <a
                  href="https://wa.me/919072722294"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:text-emerald-300 text-sm font-semibold flex items-center gap-1"
                >
                  Chat Now &rarr;
                </a>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-brand-900/50 border border-brand-500/20 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-brand-400" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Email Us</h3>
                <p className="text-sm text-slate-400 mb-2">
                  For general inquiries and support.
                </p>
                <a
                  href="mailto:support@tradetalks.in"
                  className="text-brand-400 hover:text-brand-300 text-sm font-medium"
                >
                  support@tradetalks.in
                </a>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-brand-900/50 border border-brand-500/20 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5 text-brand-400" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Call Us</h3>
                <p className="text-sm text-slate-400 mb-2">
                  Direct support during business hours.
                </p>
                <a
                  href="tel:+919072722294"
                  className="text-brand-400 hover:text-brand-300 text-sm font-medium"
                >
                  +91 90727 22294
                </a>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-brand-900/50 border border-brand-500/20 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-brand-400" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Our Offices</h3>
                <p className="text-sm text-slate-400">
                  Angamaly & Kozhikode,
                  <br />
                  Kerala, India
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 glass-panel p-8 rounded-3xl">
            {isSubmitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6">
                  <MessageSquare className="w-8 h-8 text-emerald-500" />
                </div>
                <h3 className="text-2xl font-display font-bold mb-2">
                  Message Sent!
                </h3>
                <p className="text-slate-400">
                  We&apos;ll get back to you within 24 hours.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="mt-8 text-brand-400 hover:text-brand-300 font-medium"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-slate-300"
                    >
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-slate-300"
                    >
                      Your Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-slate-300"
                  >
                    Subject
                  </label>
                  <select
                    id="subject"
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all appearance-none"
                  >
                    <option value="general">General Inquiry</option>
                    <option value="classes">Classes & Enrollment</option>
                    <option value="challenge">Trading Challenge</option>
                    <option value="support">Technical Support</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-slate-300"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={5}
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all resize-none"
                    placeholder="How can we help you?"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-xl font-semibold text-white bg-brand-600 hover:bg-brand-500 shadow-lg shadow-brand-600/25 transition-all"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
