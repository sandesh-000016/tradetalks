"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  MapPin,
  MonitorPlay,
  Calendar,
  Users,
  Clock,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

export default function Classes() {
  const [activeTab, setActiveTab] = useState<"online" | "offline">("online");

  const onlineClasses = [
    {
      id: "on-1",
      title: "Mastering Price Action",
      level: "Intermediate",
      duration: "4 Weeks",
      schedule: "Mon, Wed, Fri (Evening)",
      features: [
        "Live Zoom Sessions",
        "Lifetime Recording Access",
        "Private Discord Group",
        "Weekly Q&A",
      ],
      price: "$299",
      popular: true,
    },
    {
      id: "on-2",
      title: "Options Trading Blueprint",
      level: "Advanced",
      duration: "6 Weeks",
      schedule: "Tue, Thu (Evening)",
      features: [
        "Advanced Greeks",
        "Live Market Analysis",
        "Strategy Templates",
        "1-on-1 Mentoring Session",
      ],
      price: "$499",
      popular: false,
    },
    {
      id: "on-3",
      title: "Stock Market Basics",
      level: "Beginner",
      duration: "2 Weeks",
      schedule: "Weekends",
      features: [
        "Market Fundamentals",
        "Broker Setup",
        "Risk Management",
        "Study Materials",
      ],
      price: "$99",
      popular: false,
    },
  ];

  const offlineClasses = [
    {
      id: "off-1",
      title: "Intensive Trading Bootcamp",
      location: "New York City, NY",
      dates: "Oct 15 - Oct 17",
      seats: "5 Seats Left",
      features: [
        "In-person Mentorship",
        "Live Trading Floor Experience",
        "Networking Dinner",
        "Printed Materials",
      ],
      price: "$999",
      popular: true,
    },
    {
      id: "off-2",
      title: "Weekend Masterclass",
      location: "Chicago, IL",
      dates: "Nov 5 - Nov 6",
      seats: "12 Seats Left",
      features: [
        "2-Day Intensive",
        "Setup Optimization",
        "Q&A with Pro Traders",
        "Lunch Included",
      ],
      price: "$599",
      popular: false,
    },
  ];

  return (
    <div className="pt-24 pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
            Learning Programs
          </h1>
          <p className="text-lg text-slate-400">
            Choose the learning style that fits you best. Join our interactive
            online sessions or immerse yourself in our in-person bootcamps.
          </p>
        </div>

        {/* Toggle */}
        <div className="flex justify-center mb-16">
          <div className="inline-flex bg-slate-900/80 p-1.5 rounded-xl border border-slate-800 backdrop-blur-sm">
            <button
              onClick={() => setActiveTab("online")}
              className={`flex items-center gap-2 px-8 py-3 rounded-lg font-medium transition-all ${
                activeTab === "online"
                  ? "bg-brand-600 text-white shadow-lg shadow-brand-600/20"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              }`}
            >
              <MonitorPlay className="w-5 h-5" />
              Online Classes
            </button>
            <button
              onClick={() => setActiveTab("offline")}
              className={`flex items-center gap-2 px-8 py-3 rounded-lg font-medium transition-all ${
                activeTab === "offline"
                  ? "bg-brand-600 text-white shadow-lg shadow-brand-600/20"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              }`}
            >
              <MapPin className="w-5 h-5" />
              Offline Batches
            </button>
          </div>
        </div>

        {/* Class Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {(activeTab === "online" ? onlineClasses : offlineClasses).map(
            (course) => (
              <div
                key={course.id}
                className={`glass-panel rounded-2xl p-8 relative flex flex-col ${
                  course.popular
                    ? "border-brand-500/50 shadow-[0_0_30px_-15px_rgba(37,99,235,0.3)]"
                    : ""
                }`}
              >
                {course.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-brand-600 to-brand-400 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
                    Most Popular
                  </div>
                )}

                <div className="mb-6">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                      {"level" in course ? course.level : "In-Person"}
                    </span>
                  </div>
                  <h3 className="text-2xl font-display font-bold mb-2">
                    {course.title}
                  </h3>

                  <div className="space-y-2 mt-4 text-sm text-slate-400">
                    {"duration" in course && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-brand-400" />{" "}
                        {course.duration}
                      </div>
                    )}
                    {"schedule" in course && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-brand-400" />{" "}
                        {course.schedule}
                      </div>
                    )}
                    {"location" in course && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-brand-400" />{" "}
                        {course.location}
                      </div>
                    )}
                    {"dates" in course && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-brand-400" />{" "}
                        {course.dates}
                      </div>
                    )}
                    {"seats" in course && (
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-accent-500" />
                        <span className="text-accent-400 font-medium">
                          {course.seats}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex-grow">
                  <div className="h-px w-full bg-slate-800 mb-6"></div>
                  <ul className="space-y-3 mb-8">
                    {course.features.map((feature, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-sm text-slate-300"
                      >
                        <CheckCircle2 className="w-5 h-5 text-brand-500 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-auto pt-6 border-t border-slate-800">
                  <div className="flex items-end justify-between mb-6">
                    <div>
                      <span className="text-3xl font-display font-bold text-white">
                        {course.price}
                      </span>
                    </div>
                  </div>
                  <Link
                    href={`/register?class=${course.id}`}
                    className={`w-full py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
                      course.popular
                        ? "bg-brand-600 hover:bg-brand-500 text-white shadow-lg shadow-brand-600/25"
                        : "bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
                    }`}
                  >
                    Enroll Now <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
