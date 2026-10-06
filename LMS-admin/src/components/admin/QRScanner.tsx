import { useEffect, useRef, useState } from "react";
import { X, Camera, AlertCircle } from "lucide-react";
import {
    Html5Qrcode,
    Html5QrcodeScannerState,
} from "html5-qrcode";

interface QRScannerProps {
    onScan: (decodedText: string) => void;
    onClose?: () => void;
}

const QRScanner = ({ onScan, onClose }: QRScannerProps) => {
    const scannerRef = useRef<Html5Qrcode | null>(null);
    const hasScannedRef = useRef(false);

    const [error, setError] = useState<string | null>(null);
    const [isStarting, setIsStarting] = useState(true);

    useEffect(() => {
        const scannerId = "lms-qr-reader";

        const startScanner = async () => {
            try {
                setIsStarting(true);

                const scanner = new Html5Qrcode(scannerId);
                scannerRef.current = scanner;

                await scanner.start(
                    { facingMode: "environment" },
                    {
                        fps: 10,
                        qrbox: {
                            width: 250,
                            height: 250,
                        },
                        aspectRatio: 1,
                    },
                    (decodedText) => {
                        if (hasScannedRef.current) return;

                        hasScannedRef.current = true;

                        onScan(decodedText);
                    },
                    () => {
                        // QR not found yet.
                        // We don't need to show an error for every failed frame.
                    }
                );

                setIsStarting(false);
            } catch (err) {
                console.error("QR scanner error:", err);

                setIsStarting(false);
                setError(
                    "Unable to access the camera. Please allow camera permission and try again."
                );
            }
        };

        startScanner();

        return () => {
            const scanner = scannerRef.current;

            if (
                scanner &&
                scanner.getState() === Html5QrcodeScannerState.SCANNING
            ) {
                scanner
                    .stop()
                    .then(() => {
                        scanner.clear();
                    })
                    .catch((err) => {
                        console.error("Failed to stop QR scanner:", err);
                    });
            }
        };
    }, [onScan]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md">
            {/* Scanner Card */}
            <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                            Scan Student QR
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Position the QR code inside the frame
                        </p>
                    </div>

                    {onClose && (
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
                            aria-label="Close scanner"
                        >
                            <X size={20} />
                        </button>
                    )}
                </div>

                {/* Scanner */}
                <div className="relative bg-black">
                    <div
                        id="lms-qr-reader"
                        className="min-h-[350px] w-full"
                    />

                    {/* Scanner overlay */}
                    {!error && (
                        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                            <div className="relative h-[250px] w-[250px]">
                                {/* Dark overlay around scanning area */}
                                <div className="absolute -inset-[1000px] bg-black/20" />

                                {/* Corners */}
                                <div className="absolute left-0 top-0 h-10 w-10 border-l-4 border-t-4 border-white" />
                                <div className="absolute right-0 top-0 h-10 w-10 border-r-4 border-t-4 border-white" />
                                <div className="absolute bottom-0 left-0 h-10 w-10 border-b-4 border-l-4 border-white" />
                                <div className="absolute bottom-0 right-0 h-10 w-10 border-b-4 border-r-4 border-white" />

                                {/* Scanning line */}
                                <div className="absolute left-2 right-2 top-1/2 h-0.5 animate-pulse bg-white" />
                            </div>
                        </div>
                    )}

                    {/* Loading */}
                    {isStarting && !error && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white">
                            <Camera className="mb-3 animate-pulse" size={32} />

                            <p className="text-sm">
                                Starting camera...
                            </p>
                        </div>
                    )}

                    {/* Error */}
                    {error && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black px-6 text-center text-white">
                            <AlertCircle size={40} className="mb-4 text-red-400" />

                            <p className="text-sm">
                                {error}
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-5 py-4 text-center">
                    <p className="text-sm text-gray-500">
                        Scan the student's QR code to open their profile.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default QRScanner;