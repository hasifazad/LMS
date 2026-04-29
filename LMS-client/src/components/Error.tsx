import { AlertTriangle } from 'lucide-react';

interface ErrorMessageProps {
  message?: string;
  description?: string;
}

const Error = ({
  message = 'Something went wrong',
  description = 'Please try again or contact support.',
}: ErrorMessageProps) => {
  return (
    <div className="flex flex-col items-center justify-center text-center bg-red-50 border border-red-300 text-red-700 rounded-xl p-6 shadow-sm">
      <AlertTriangle size={40} className="text-red-500 mb-2" />
      <h2 className="text-lg font-semibold">{message}</h2>
      <p className="text-sm mt-1 text-red-600">{description}</p>
    </div>
  );
};

export default Error;
