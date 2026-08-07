interface LoadingProps {
    message?: string;
}

const Loading = ({ message = "Loading..." }: LoadingProps) => {
    return (
        <div className="flex h-full items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="relative h-10 w-10">
                    <div className="absolute inset-0 rounded-full border-4 border-gray-200" />

                    <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-black" />
                </div>

                <p className="text-sm font-medium text-gray-500">
                    {message}
                </p>
            </div>
        </div>
    );
};

export default Loading;