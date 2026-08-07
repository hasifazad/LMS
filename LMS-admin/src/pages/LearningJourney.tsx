import { motion } from "framer-motion";
import {
    Atom,
    Braces,
    Check,
    Code2,
    Database,
    Flag,
    Lock,
    Palette,
    Rocket,
    Server,
    Trophy,
} from "lucide-react";
import JourneyNode from "../components/student/JourneyNode";

type Status = "completed" | "current" | "locked";

interface Milestone {
    id: number;
    title: string;
    icon: React.ElementType;
    status: Status;
    top: number;
    left: number;
}

const milestones: Milestone[] = [
    {
        id: 1,
        title: "HTML",
        icon: Code2,
        status: "completed",
        top: 520,
        left: 120,
    },
    {
        id: 2,
        title: "CSS",
        icon: Palette,
        status: "completed",
        top: 420,
        left: 70,
    },
    {
        id: 3,
        title: "JavaScript",
        icon: Braces,
        status: "completed",
        top: 320,
        left: 180,
    },
    {
        id: 4,
        title: "TypeScript",
        icon: Braces,
        status: "locked",
        top: 220,
        left: 90,
    },
    {
        id: 5,
        title: "React",
        icon: Atom,
        status: "current",
        top: 120,
        left: 220,
    },
    {
        id: 6,
        title: "Node.js",
        icon: Server,
        status: "locked",
        top: 40,
        left: 120,
    },
    {
        id: 7,
        title: "Database",
        icon: Database,
        status: "locked",
        top: -40,
        left: 220,
    },
];


import green from '../assets/green.png'
import blue from '../assets/blue.png'
import normal from '../assets/normal.png'
import react from '../assets/react.svg'

export default function LearningJourney() {
    return (
        <>


            <JourneyNode
                title="HTML"
                icon={react}
                status="completed"
                stars={3}
                base={blue}
            />
            {/* <JourneyNode
                title="HTML"
                icon={Code2}
                status="completed"
                stars={3}
                base={green}
            /> */}


        </>
    );
}