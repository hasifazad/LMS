import React from "react";
import {
    Users,
    GraduationCap,
    BookOpen,
    ClipboardList,
    ChevronRight,
} from "lucide-react";

const navigationCards = [
    {
        title: "Students",
        description: "Manage student profiles, attendance, progress, and records.",
        icon: Users,
        href: "/admin/students",
    },
    {
        title: "Trainers",
        description: "View trainer details, schedules, and assigned batches.",
        icon: GraduationCap,
        href: "/admin/trainers",
    },
    {
        title: "Courses",
        description: "Explore available courses and learning programs.",
        icon: BookOpen,
        href: "/admin/courses",
    },
    {
        title: "Reports",
        description: "Track performance, analytics, and activity reports.",
        icon: ClipboardList,
        href: "/admin/reports",
    },
];

export default function HomePage() {
    return (
        <div className="min-h-screen bg-[#fafafa] text-gray-800">
            {/* Navbar */}
            {/* <header className="border-b border-gray-200 bg-white/80 backdrop-blur">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                    <div>
                        <h1 className="text-xl font-semibold tracking-tight">
                            Learning Portal
                        </h1>
                        <p className="text-sm text-gray-500">
                            Simple management dashboard
                        </p>
                    </div>

                    <button className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium transition hover:bg-gray-50">
                        Profile
                    </button>
                </div>
            </header> */}

            {/* Hero Section */}
            <section className="mx-auto max-w-7xl px-6">
                <div className="max-w-3xl">
                    {/* <span className="rounded-full border border-gray-200 bg-white px-4 py-1 text-sm text-gray-600 shadow-sm">
                        Dashboard
                    </span> */}

                    <h2 className="text-4xl font-bold leading-tight tracking-tight md:text-5xl">
                        Manage your institution with clarity and simplicity.
                    </h2>

                    <p className="mt-5 text-lg leading-relaxed text-gray-500">
                        Access students, trainers, reports, and course management from one
                        clean and organized workspace.
                    </p>
                </div>

                {/* Navigation Cards */}
                <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {navigationCards.map((card) => {
                        const Icon = card.icon;

                        return (
                            <a
                                key={card.title}
                                href={card.href}
                                className="group rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                            >
                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100">
                                    <Icon className="h-7 w-7 text-gray-700" />
                                </div>

                                <div className="mt-6">
                                    <h3 className="text-lg font-semibold">{card.title}</h3>

                                    <p className="mt-2 text-sm leading-relaxed text-gray-500">
                                        {card.description}
                                    </p>
                                </div>

                                <div className="mt-6 flex items-center text-sm font-medium text-gray-700">
                                    Open
                                    <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </div>
                            </a>
                        );
                    })}
                </div>
            </section>
        </div>
    );
}