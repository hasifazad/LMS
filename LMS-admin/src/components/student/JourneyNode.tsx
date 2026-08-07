import { Lock, Star } from "lucide-react";



export type JourneyStatus =
    | "completed"
    | "current"
    | "locked";

interface JourneyNodeProps {
    title: string;

    // technology image
    icon: string;

    // blue-base or emerald-base
    base: string;

    status: JourneyStatus;

    stars?: number;
}

export default function JourneyNode({
    title,
    icon,
    base,
    status,
    stars = 0,
}: JourneyNodeProps) {

    const completed = status === "completed";
    const current = status === "current";
    const locked = status === "locked";

    return (

        <div
            className={`
            flex
            flex-col
            items-center
            justify-center
            transition-all
            duration-300
            hover:-translate-y-2
            `}
        >

            {/* Node */}

            <div className="">

                {/* Glow */}

                {current && (

                    <div className="absolute inset-0 flex items-center justify-center">

                        <div className="h-32 w-32 animate-pulse rounded-full bg-cyan-400/40 blur-3xl" />

                    </div>

                )}

                {/* Floating Icon */}

                <img
                    src={icon}
                    alt={title}
                    className={`
                
                    z-20
                    h-20
                    w-20
                    -translate-x-1/2
                    object-contain

                    ${current
                            ? "animate-float"
                            : ""
                        }

                    ${locked
                            ? "opacity-50 grayscale"
                            : ""
                        }
                `}
                />

                {/* Lock */}

                {locked && (

                    <div
                        className="
                        absolute
                        right-6
                        top-4
                        z-30
                        rounded-full
                        bg-white
                        p-2
                        shadow-lg
                    "
                    >
                        <Lock
                            size={16}
                            className="text-slate-700"
                        />
                    </div>

                )}

                {/* Base */}

                <img
                    src={base}
                    alt=""
                    className={`
                    w-30
                    select-none

                    ${current
                            ? "animate-float"
                            : ""
                        }

                    ${completed
                            ? ""
                            : locked
                                ? "brightness-75 grayscale"
                                : ""
                        }
                `}
                    draggable={false}
                />

            </div>

            {/* Module */}

            <div className="rounded-full bg-white px-5 py-2 shadow-lg">

                <h3 className="font-semibold text-slate-800">

                    {title}

                </h3>

            </div>

            {/* Stars */}

            <div className="mt-2 flex gap-1">

                {[1, 2, 3].map((item) => (

                    <Star
                        key={item}
                        size={18}
                        className={
                            item <= stars
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                        }
                    />

                ))}

            </div>

        </div>

    );
}