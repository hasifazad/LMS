import { Link } from "react-router-dom";

const PageNotFound = () => {
    return (
        <div className="flex h-full items-center justify-center bg-gray-50 px-6">
            <div className="text-center">
                <p className="text-sm font-semibold uppercase tracking-widest text-gray-400">
                    Error 404
                </p>

                <h1 className="mt-4 text-7xl font-bold tracking-tight text-gray-900">
                    404
                </h1>

                <h2 className="mt-4 text-2xl font-semibold text-gray-800">
                    Page not found
                </h2>

                <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-500">
                    Sorry, we couldn't find the page you're looking for.
                    It may have been moved, deleted, or the URL may be
                    incorrect.
                </p>

                <div className="mt-8 flex justify-center gap-3">
                    <Link
                        to="/"
                        className="rounded-xl bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
                    >
                        Go Home
                    </Link>

                    <button
                        onClick={() => window.history.back()}
                        className="rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PageNotFound;