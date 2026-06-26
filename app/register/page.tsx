"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, ArrowLeft, Shield, CreditCard } from "lucide-react";

function RegisterContent() {
  const searchParams = useSearchParams();
  const classId = searchParams.get("class");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const classesData: Record<
    string,
    { title: string; price: string; details: string }
  > = {
    "on-1": {
      title: "Mastering Price Action",
      price: "$299.00",
      details: "Online • 4 Weeks",
    },
    "on-2": {
      title: "Options Trading Blueprint",
      price: "$499.00",
      details: "Online • 6 Weeks",
    },
    "on-3": {
      title: "Stock Market Basics",
      price: "$99.00",
      details: "Online • 2 Weeks",
    },
    "off-1": {
      title: "Intensive Trading Bootcamp",
      price: "$999.00",
      details: "New York • In-Person",
    },
    "off-2": {
      title: "Weekend Masterclass",
      price: "$599.00",
      details: "Chicago • In-Person",
    },
  };

  const selectedClass =
    (classId && classesData[classId]) || classesData["on-1"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTimeout(() => {
      setIsSubmitted(true);
    }, 1000);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center py-20 px-4">
        <div className="glass-panel p-10 rounded-3xl max-w-md w-full text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-400 to-brand-600"></div>
          <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
          </div>
          <h2 className="text-3xl font-display font-bold mb-4">
            Registration Complete!
          </h2>
          <p className="text-slate-400 mb-8">
            Welcome to Trade Talks. We&apos;ve sent your enrollment details and
            receipt to your email address.
          </p>
          <Link
            href="/classes"
            className="inline-flex w-full items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-brand-600 hover:bg-brand-500 transition-all"
          >
            Return to Classes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-12 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/classes"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-brand-400 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Classes
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="md:col-span-2 glass-panel p-8 rounded-3xl">
            <h1 className="text-3xl font-display font-bold mb-2">
              Complete Registration
            </h1>
            <p className="text-slate-400 mb-8">
              Fill in your details to secure your spot.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-slate-300"
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    required
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                    placeholder="John"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-slate-300"
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    required
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-slate-300"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                  placeholder="john@example.com"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-slate-300"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  required
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              <div className="pt-6 border-t border-slate-800">
                <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-brand-400" /> Payment
                  Details
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="card"
                      className="block text-sm font-medium text-slate-300"
                    >
                      Card Number
                    </label>
                    <input
                      type="text"
                      id="card"
                      required
                      className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                      placeholder="0000 0000 0000 0000"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label
                        htmlFor="expiry"
                        className="block text-sm font-medium text-slate-300"
                      >
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        id="expiry"
                        required
                        className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                        placeholder="MM/YY"
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="cvc"
                        className="block text-sm font-medium text-slate-300"
                      >
                        CVC
                      </label>
                      <input
                        type="text"
                        id="cvc"
                        required
                        className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                        placeholder="123"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-xl font-semibold text-white bg-brand-600 hover:bg-brand-500 shadow-lg shadow-brand-600/25 transition-all mt-8"
              >
                Complete Enrollment
              </button>

              <div className="flex items-center justify-center gap-2 text-xs text-slate-500 mt-4">
                <Shield className="w-4 h-4" /> Secure 256-bit SSL encryption
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="md:col-span-1">
            <div className="glass-panel p-6 rounded-3xl sticky top-24">
              <h3 className="text-lg font-display font-bold mb-4">
                Order Summary
              </h3>

              <div className="flex flex-col gap-4 mb-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-white">
                      {selectedClass.title}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      {selectedClass.details}
                    </p>
                  </div>
                  <span className="font-medium">{selectedClass.price}</span>
                </div>
              </div>

              <div className="border-t border-slate-800 pt-4 space-y-3 mb-6">
                <div className="flex justify-between text-sm text-slate-400">
                  <span>Subtotal</span>
                  <span>{selectedClass.price}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-400">
                  <span>Tax</span>
                  <span>$0.00</span>
                </div>
              </div>

              <div className="border-t border-slate-800 pt-4 flex justify-between items-center">
                <span className="font-medium text-white">Total</span>
                <span className="text-2xl font-display font-bold text-white">
                  {selectedClass.price}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Register() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-slate-400">
          Loading registration details...
        </div>
      }
    >
      <RegisterContent />
    </Suspense>
  );
}
