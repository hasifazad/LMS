
import React from "react";
import { Link } from "react-router-dom";
import {
    ArrowRight,
    BookOpen,
    ClipboardCheck,
    GraduationCap,
    LayoutDashboard,
    Sparkles,
} from "lucide-react";

import logo from "../assets/jj_logo.svg"

const Home = () => {
    return (
        <div className="min-h-screen bg-white text-slate-900">
            {/* Navbar */}
            <header className="border-b border-slate-100 bg-white/90 backdrop-blur">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-sm">
                            {/* <GraduationCap size={22} /> */}
                            <img src={logo} alt="logo" />
                        </div>

                        <div>
                            <h1 className="text-lg font-bold tracking-tight">
                                Job Junction
                            </h1>
                            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-400">
                                by Eduguild
                            </p>
                        </div>
                    </Link>

                    {/* Navigation */}
                    <nav className="hidden items-center gap-8 md:flex">
                        <a
                            href="#features"
                            className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
                        >
                            Features
                        </a>

                        <a
                            href="#about"
                            className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
                        >
                            About
                        </a>

                        <Link
                            to="/student/login"
                            className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-600"
                        >
                            Student Login
                        </Link>
                    </nav>
                </div>
            </header>

            {/* Hero */}
            <main>
                <section className="relative overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute -left-40 top-20 h-80 w-80 rounded-full bg-blue-100/60 blur-3xl" />
                    <div className="absolute -right-40 top-10 h-96 w-96 rounded-full bg-indigo-100/50 blur-3xl" />

                    <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-6 py-20 lg:grid-cols-2 lg:px-8 lg:py-28">
                        {/* Hero content */}
                        <div>
                            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
                                <Sparkles size={15} />
                                Learning. Skills. Career.
                            </div>

                            <h2 className="max-w-3xl text-5xl font-bold leading-[1.08] tracking-tight text-slate-950 sm:text-6xl">
                                Build your skills.
                                <span className="block text-blue-600">
                                    Shape your future.
                                </span>
                            </h2>

                            <p className="mt-7 max-w-xl text-lg leading-8 text-slate-500">
                                Welcome to the JobJunction Learning Management
                                System. Access your courses, assignments,
                                attendance, projects and certificates — all in
                                one place.
                            </p>

                            {/* CTA buttons */}
                            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                                <Link
                                    to="/student"
                                    className="group inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
                                >
                                    Student
                                    <ArrowRight
                                        size={17}
                                        className="transition-transform group-hover:translate-x-1"
                                    />
                                </Link>

                                {/* <Link
                                    to="/student"
                                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                                >
                                    <LayoutDashboard size={17} />
                                    Student Dashboard
                                </Link> */}
                            </div>

                            <p className="mt-5 text-xs text-slate-400">
                                Your learning journey, organized in one place.
                            </p>
                        </div>

                        {/* Hero visual */}
                        <div className="relative">
                            <div className="relative mx-auto max-w-md">
                                {/* Main card */}
                                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl shadow-slate-200/70">
                                    <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                                        <div>
                                            <p className="text-xs font-medium text-slate-400">
                                                STUDENT PORTAL
                                            </p>
                                            <h3 className="mt-1 text-lg font-bold text-slate-900">
                                                My Learning
                                            </h3>
                                        </div>

                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                            <BookOpen size={20} />
                                        </div>
                                    </div>

                                    {/* Progress */}
                                    <div className="mt-6">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-slate-600">
                                                Course Progress
                                            </span>
                                            <span className="text-sm font-bold text-blue-600">
                                                72%
                                            </span>
                                        </div>

                                        <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                                            <div className="h-full w-[72%] rounded-full bg-blue-600" />
                                        </div>
                                    </div>

                                    {/* Course cards */}
                                    <div className="mt-6 space-y-3">
                                        <div className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4">
                                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                                                <BookOpen size={19} />
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-semibold text-slate-800">
                                                    Current Course
                                                </p>
                                                <p className="mt-1 text-xs text-slate-400">
                                                    Learning modules
                                                </p>
                                            </div>

                                            <span className="text-xs font-semibold text-blue-600">
                                                72%
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4">
                                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
                                                <ClipboardCheck size={19} />
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-semibold text-slate-800">
                                                    Assignments
                                                </p>
                                                <p className="mt-1 text-xs text-slate-400">
                                                    Track your submissions
                                                </p>
                                            </div>

                                            <span className="text-xs font-semibold text-emerald-600">
                                                Active
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4">
                                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-violet-600 shadow-sm">
                                                <GraduationCap size={19} />
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-semibold text-slate-800">
                                                    Certification
                                                </p>
                                                <p className="mt-1 text-xs text-slate-400">
                                                    Track your achievements
                                                </p>
                                            </div>

                                            <span className="text-xs font-semibold text-violet-600">
                                                Progress
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Floating badge */}
                                <div className="absolute -bottom-6 -left-8 hidden rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-xl sm:block">
                                    <p className="text-xs text-slate-400">
                                        Powered by
                                    </p>
                                    <p className="mt-1 text-sm font-bold text-slate-800">
                                        Eduguild
                                    </p>
                                </div>

                                {/* Floating progress badge */}
                                <div className="absolute -right-6 -top-6 hidden rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-xl sm:block">
                                    <p className="text-xs text-slate-400">
                                        Learning
                                    </p>
                                    <p className="mt-1 text-sm font-bold text-blue-600">
                                        Keep growing →
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features */}
                <section
                    id="features"
                    className="border-y border-slate-100 bg-slate-50/70"
                >
                    <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
                        <div className="mx-auto max-w-2xl text-center">
                            <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
                                Everything in one place
                            </p>

                            <h3 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                                Your learning journey, simplified
                            </h3>

                            <p className="mt-4 text-slate-500">
                                Stay connected with your course and keep track
                                of your progress from a single platform.
                            </p>
                        </div>

                        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                            <FeatureCard
                                icon={<BookOpen size={21} />}
                                title="Courses"
                                description="Access your course modules and learning resources."
                            />

                            <FeatureCard
                                icon={<ClipboardCheck size={21} />}
                                title="Assignments"
                                description="View, submit and track your assignments."
                            />

                            <FeatureCard
                                icon={<LayoutDashboard size={21} />}
                                title="Progress"
                                description="Monitor your attendance and learning progress."
                            />

                            <FeatureCard
                                icon={<GraduationCap size={21} />}
                                title="Certificates"
                                description="Track your achievements and certifications."
                            />
                        </div>
                    </div>
                </section>

                {/* About */}
                <section id="about" className="bg-white">
                    <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
                        <div className="rounded-3xl bg-slate-900 px-8 py-12 text-center sm:px-12 lg:py-16">
                            <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
                                JobJunction LMS
                            </p>

                            <h3 className="mx-auto mt-4 max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
                                Learn today. Build tomorrow.
                            </h3>

                            <p className="mx-auto mt-5 max-w-xl leading-7 text-slate-400">
                                JobJunction is a learning platform designed
                                to help students stay organized, build
                                practical skills and move confidently toward
                                their careers.
                            </p>

                            <Link
                                to="/student/login"
                                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-slate-900 transition hover:bg-blue-50 hover:text-blue-700"
                            >
                                Enter Student Portal
                                <ArrowRight size={17} />
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="border-t border-slate-100 bg-white">
                <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-7 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left lg:px-8">
                    <div>
                        <p className="text-sm font-semibold text-slate-800">
                            JobJunction
                        </p>
                        <p className="text-xs text-slate-400">
                            Powered by Eduguild
                        </p>
                    </div>

                    <p className="text-xs text-slate-400">
                        © {new Date().getFullYear()} JobJunction. All rights
                        reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
};

interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
}

const FeatureCard = ({
    icon,
    title,
    description,
}: FeatureCardProps) => {
    return (
        <div className="group rounded-2xl border border-slate-200 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg hover:shadow-slate-200/50">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                {icon}
            </div>

            <h4 className="mt-5 font-semibold text-slate-900">
                {title}
            </h4>

            <p className="mt-2 text-sm leading-6 text-slate-500">
                {description}
            </p>
        </div>
    );
};

export default Home;

