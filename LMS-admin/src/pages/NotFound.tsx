import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <div>
            <h1 className="text-3xl font-bold">404 - Page Not Found</h1>
            <Link to="/" className="text-blue-600">Go Home</Link>
        </div>
    );
}