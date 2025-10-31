// BarcodeScanner.tsx
import { useEffect, useRef } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import type { IScannerControls } from "@zxing/browser"; // dispo dans @zxing/browser

type Props = {
  onResult: (code: string) => void;
  onClose?: () => void;
};

export default function BarcodeScanner({ onResult, onClose }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const reader = new BrowserMultiFormatReader();
    let active = true;
    let controls: IScannerControls | null = null;

    (async () => {
      try {
        const devices = await BrowserMultiFormatReader.listVideoInputDevices();
        const deviceId = devices?.[0]?.deviceId;
        if (!deviceId || !videoRef.current) return;

        const returnedControls = await reader.decodeFromVideoDevice(
          deviceId,
          videoRef.current,
          (res, _err, cbControls) => {
            if (cbControls) controls = cbControls;
            if (res && active) {
              onResult(res.getText());
              active = false;
              controls?.stop();
              onClose?.();
            }
          }
        );

        if (returnedControls) controls = returnedControls;
      } catch (e) {
        console.error("Scanner error:", e);
      }
    })();

    return () => {
      active = false;
      controls?.stop();
      (reader as any)?.reset?.();
      (reader as any)?.stopContinuousDecode?.();
    };
  }, [onResult, onClose]);

  return (
    <div className="space-y-2">
      <video ref={videoRef} className="w-full rounded-lg" />
      <div className="text-xs text-gray-400">
        Aligne le code-barres dans le cadre. Autorise l’accès à la caméra.
      </div>
      <button
        type="button"
        onClick={onClose}
        className="px-3 py-2 border rounded"
      >
        Fermer
      </button>
    </div>
  );
}
