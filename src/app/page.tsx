// 'use client'

// import { Html5QrcodeScanner, Html5QrcodeScanType } from 'html5-qrcode';
// import { useState } from 'react';

// export default function Home() {
//   const [result, setResult] = useState<string>('');
//   const [scanning, setScanning] = useState(false);
//   const [scanner, setScanner] = useState<Html5QrcodeScanner | null>(null);

//   const startScanning = () => {
//     if (scanning) return;

//     const newScanner = new Html5QrcodeScanner(
//       'reader',
//       {
//         qrbox: { width: 250, height: 250 },
//         fps: 5,
//         supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
//       },
//       false
//     );

//     newScanner.render(
//       (decodedText) => {
//         newScanner.clear();
//         setResult(decodedText);
//         setScanning(false);
//       },
//       (errorMessage) => {
//         console.warn(errorMessage);
//       }
//     );

//     setScanner(newScanner);
//     setScanning(true);
//   };

//   const stopScanning = () => {
//     if (scanner) {
//       scanner.clear().then(() => {
//         setScanning(false);
//         setScanner(null);
//       }).catch(err => {
//         console.error('Failed to clear scanner', err);
//       });
//     }
//   };

//   return (
//     <div>
//       <h1>QR Code Scanner</h1>
//       <button onClick={startScanning} disabled={scanning}>
//         {scanning ? 'Scanning...' : 'Start Scan'}
//       </button>
//       {scanning && (
//         <button onClick={stopScanning}>Stop Scan</button>
//       )}
//       <div id="reader" style={{ width: '300px', marginTop: '20px' }}></div>
//       <p>Result: {result}</p>
//     </div>
//   );
// }

// "use client";

// import { BrowserMultiFormatReader, IScannerControls } from "@zxing/browser";
// import { DecodeHintType, BarcodeFormat } from '@zxing/library';
// import { useEffect, useRef, useState } from "react";

// export default function Home() {
//   const videoRef = useRef<HTMLVideoElement | null>(null);
//   const readerRef = useRef<BrowserMultiFormatReader | null>(null);
//   const controlsRef = useRef<IScannerControls | null>(null);

//   const hasScannedRef = useRef(false);

//   const [result, setResult] = useState("");
//   const [scanning, setScanning] = useState(false);

//   useEffect(() => {
//     const hints = new Map();
//     hints.set(DecodeHintType.POSSIBLE_FORMATS, [BarcodeFormat.CODE_128]);
//     readerRef.current = new BrowserMultiFormatReader(hints);

//     return () => {
//       controlsRef.current?.stop();
//     };
//   }, []);

//   const startScanning = async () => {
//     if (scanning) return;

//     setScanning(true);
//     setResult("");
//     hasScannedRef.current = false;

//     setTimeout(async () => {
//       if (!videoRef.current) return;

//       try {
//         const devices = await BrowserMultiFormatReader.listVideoInputDevices();
//         const backCamera =
//           devices.find((d) => /back|rear|environment/i.test(d.label)) || devices[0];

//         controlsRef.current = await readerRef.current!.decodeFromConstraints(
//           {
//             video: {
//               deviceId: backCamera.deviceId,
//               width: { ideal: 640 },
//               height: { ideal: 240 },
//               facingMode: "environment",
//             }
//           },
//           videoRef.current,
//           (result) => {
//             if (!result || hasScannedRef.current) return;

//             hasScannedRef.current = true;
//             setResult(result.getText());
//             stopScanning();
//           }
//         );
//       } catch (err) {
//         console.error("Camera error:", err);
//         setScanning(false);
//       }
//     }, 0);
//   };

//   const stopScanning = () => {
//     controlsRef.current?.stop();
//     controlsRef.current = null;
//     setScanning(false);
//   };

//   return (
//     <div>
//       <h1>ZXing Barcode / QR Scanner</h1>

//       <button onClick={startScanning} disabled={scanning}>
//         Open Camera
//       </button>

//       {scanning && (
//         <button onClick={stopScanning} style={{ marginLeft: 10 }}>
//           Close Camera
//         </button>
//       )}

//       {scanning && (
//         <div className="relative w-full h-[140px] overflow-hidden rounded border bg-black">
//           <video
//             ref={videoRef}
//             className="absolute inset-0 w-full h-full object-cover"
//             autoPlay
//             muted
//             playsInline
//           />
//           <div className="absolute inset-x-0 top-1/2 h-[2px] bg-red-500 animate-pulse" />
//         </div>
//       )}

//       <p>Result: {result}</p>
//     </div>
//   );
// }


"use client";

import { BrowserMultiFormatReader, IScannerControls } from "@zxing/browser";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);
  const controlsRef = useRef<IScannerControls | null>(null);

  const hasScannedRef = useRef(false);

  const [result, setResult] = useState("");
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    readerRef.current = new BrowserMultiFormatReader();

    return () => {
      controlsRef.current?.stop();
    };
  }, []);

  const startScanning = async () => {
    if (scanning) return;

    setScanning(true);
    setResult("");
    hasScannedRef.current = false;

    // wait for <video> to be mounted
    setTimeout(async () => {
      if (!videoRef.current) return;

      try {
        const devices = await BrowserMultiFormatReader.listVideoInputDevices();
        const backCamera =
          devices.find((d) => /back|rear|environment/i.test(d.label)) ||
          devices[0];

        readerRef.current = new BrowserMultiFormatReader();

        controlsRef.current = await readerRef.current!.decodeFromVideoDevice(
          backCamera.deviceId,
          videoRef.current,
          (result) => {
            if (!result || hasScannedRef.current) return;

            hasScannedRef.current = true;
            const decodedText = result.getText();

            setResult(decodedText);
            stopScanning();
          },
        );
      } catch (err) {
        console.error("Camera error:", err);
        setScanning(false);
      }
    }, 0);
  };

  const stopScanning = () => {
    controlsRef.current?.stop();
    controlsRef.current = null;
    setScanning(false);
  };

  return (
    <div>
      <h1>ZXing Barcode / QR Scanner</h1>

      <button onClick={startScanning} disabled={scanning}>
        Open Camera
      </button>

      {scanning && (
        <button onClick={stopScanning} style={{ marginLeft: 10 }}>
          Close Camera
        </button>
      )}

      {scanning && (
        <div className="relative w-full h-[140px] overflow-hidden rounded border bg-black">
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            muted
            playsInline
          />

          {/* Scan guide line */}
          <div className="absolute inset-x-0 top-1/2 h-[2px] bg-red-500 animate-pulse" />
        </div>
      )}

      <p>Result: {result}</p>
    </div>
  );
}



