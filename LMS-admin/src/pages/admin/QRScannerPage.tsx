import { useNavigate } from "react-router-dom";
import QRScanner from "../../components/admin/QRScanner";

const QRScannerPage = () => {
    const navigate = useNavigate();

    const handleScan = (decodedText: string) => {
        console.log("Scanned QR:", decodedText);

        navigate(`/admin/student/${decodedText}`);
    };

    const handleClose = () => {
        navigate(-1);
    };

    return (
        <QRScanner
            onScan={handleScan}
            onClose={handleClose}
        />
    );
};

export default QRScannerPage;