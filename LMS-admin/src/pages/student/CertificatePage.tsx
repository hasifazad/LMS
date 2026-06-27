
import React, { useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import certificate from '../../assets/certificate.png'

type CertificateProps = {
    studentName?: string;
    courseName?: string;
    issuedDate?: string;
    certificateId?: string;
    instructorName?: string;
};

const Certificate: React.FC<CertificateProps> = ({
    studentName = "Hasif Azad",
    courseName = "MERN Stack Development",
    issuedDate = "22 May 2026",
    certificateId = "CERT-2026-001",
    instructorName = "Job Junction",
}) => {
    const certificateRef = useRef<HTMLDivElement>(null);

    const downloadCertificate = async () => {
        if (!certificateRef.current) return;

        const canvas = await html2canvas(certificateRef.current, {
            scale: 2,
            useCORS: true,
        });

        const imgData = canvas.toDataURL("image/png");

        const pdf = new jsPDF({
            orientation: "landscape",
            unit: "px",
            format: [canvas.width, canvas.height],
        });

        pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);

        pdf.save(`${studentName}-certificate.pdf`);
    };

    return (
        <div
            className="flex flex-col items-center gap-6 p-6 min-h-screen"
            style={{ backgroundColor: "#f3f4f6" }}
        >
            {/* Certificate */}

            <div  ref={certificateRef} className="relative w-[1100px] h-[780px]">

                {/* Background Template */}
                <img
                    src={certificate}
                    alt="Certificate"
                    className="absolute inset-0 w-full h-full"
                />

                {/* Dynamic Name */}
                <h1 className="absolute top-[280px] left-1/2 -translate-x-1/2 text-5xl font-normal font-serif italic">
                    {studentName}
                </h1>

                {/* Course */}
                <p className="absolute top-[400px] left-1/2 -translate-x-1/2 text-2xl">
                    {courseName}
                </p>

            </div>

            {/* Download Button */}
            <button
                onClick={downloadCertificate}
                className="px-8 py-3 rounded-xl text-lg font-semibold shadow-lg transition-all text-white"
                style={{
                    backgroundColor: "#ca8a04",
                }}
            >
                Download Certificate
            </button>
        </div>
    );
};

export default Certificate;


//   <>

//                 <div
//                     ref={certificateRef}
//                     className="relative w-[1100px] h-[780px] shadow-2xl border-[16px] overflow-hidden"
//                     style={{
//                         backgroundColor: "#ffffff",
//                         borderColor: "#ca8a04",
//                     }}
//                 >
//                     {/* Decorative Background */}
//                     <div
//                         className="absolute inset-0 border-[10px] m-4 pointer-events-none"
//                         style={{
//                             borderColor: "#facc15",
//                         }}
//                     />

//                     {/* Top Section */}
//                     <div className="flex flex-col items-center mt-16">
//                         <h1
//                             className="text-6xl font-extrabold tracking-widest uppercase"
//                             style={{ color: "#a16207" }}
//                         >
//                             Certificate
//                         </h1>

//                         <p
//                             className="mt-4 text-xl tracking-[0.4em] uppercase"
//                             style={{ color: "#6b7280" }}
//                         >
//                             Of Completion
//                         </p>
//                     </div>

//                     {/* Content */}
//                     <div className="flex flex-col items-center justify-center mt-24 px-20 text-center">
//                         <p
//                             className="text-2xl"
//                             style={{ color: "#4b5563" }}
//                         >
//                             This certificate is proudly presented to
//                         </p>

//                         <h2
//                             className="mt-8 text-6xl font-bold font-serif"
//                             style={{ color: "#1f2937" }}
//                         >
//                             {studentName}
//                         </h2>

//                         <div
//                             className="w-2/3 border-b-2 mt-4"
//                             style={{ borderColor: "#9ca3af" }}
//                         />

//                         <p
//                             className="mt-10 text-2xl leading-relaxed max-w-4xl"
//                             style={{ color: "#4b5563" }}
//                         >
//                             For successfully completing the course
//                         </p>

//                         <h3
//                             className="mt-5 text-4xl font-bold"
//                             style={{ color: "#a16207" }}
//                         >
//                             {courseName}
//                         </h3>

//                         <p
//                             className="mt-10 text-lg max-w-3xl"
//                             style={{ color: "#6b7280" }}
//                         >
//                             Your dedication, hard work, and commitment towards learning are
//                             highly appreciated.
//                         </p>
//                     </div>

//                     {/* Bottom Section */}
//                     <div className="absolute bottom-16 left-0 right-0 px-20 flex justify-between items-end">
//                         {/* Date */}
//                         <div className="flex flex-col items-center">
//                             <p
//                                 className="border-t pt-2 w-52 text-center"
//                                 style={{
//                                     borderColor: "#6b7280",
//                                     color: "#374151",
//                                 }}
//                             >
//                                 Issued Date
//                             </p>

//                             <span className="mt-1 text-lg font-medium">
//                                 {issuedDate}
//                             </span>
//                         </div>

//                         {/* Seal */}
//                         <div
//                             className="flex items-center justify-center w-32 h-32 rounded-full border-4 font-bold text-center text-sm"
//                             style={{
//                                 borderColor: "#a16207",
//                                 color: "#a16207",
//                             }}
//                         >
//                             VERIFIED
//                             <br />
//                             CERTIFICATE
//                         </div>

//                         {/* Signature */}
//                         <div className="flex flex-col items-center">
//                             <p
//                                 className="text-3xl font-signature"
//                                 style={{ color: "#1f2937" }}
//                             >
//                                 {instructorName}
//                             </p>

//                             <p
//                                 className="border-t pt-2 w-52 text-center"
//                                 style={{
//                                     borderColor: "#6b7280",
//                                     color: "#374151",
//                                 }}
//                             >
//                                 Authorized Signature
//                             </p>
//                         </div>
//                     </div>

//                     {/* Certificate ID */}
//                     <div
//                         className="absolute bottom-5 left-10 text-sm tracking-wide"
//                         style={{ color: "#6b7280" }}
//                     >
//                         Certificate ID: {certificateId}
//                     </div>
//                 </div>

//             </>