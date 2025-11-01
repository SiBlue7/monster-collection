// src/components/BarcodeScanner.tsx
import { useEffect, useRef, useState, useCallback } from "react";
import { BrowserMultiFormatReader, BarcodeFormat } from "@zxing/browser";
import { DecodeHintType } from "@zxing/library";
import type { IScannerControls } from "@zxing/browser";

type Props = {
  onResult: (code: string) => void;
  onClose?: () => void;
};

export default function BarcodeScanner({ onResult, onClose }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const controlsRef = useRef<IScannerControls | null>(null);
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);

  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [deviceId, setDeviceId] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [active, setActive] = useState(false);

  const stop = useCallback(() => {
    controlsRef.current?.stop();
    controlsRef.current = null;
    setActive(false);
  }, []);

  useEffect(() => {
    readerRef.current = new BrowserMultiFormatReader();

    // Hints: EAN-13/EAN-8/UPC-A/UPC-E + Code128 (au cas où)
    const hints = new Map();
    hints.set(DecodeHintType.POSSIBLE_FORMATS, [
      BarcodeFormat.EAN_13,
      BarcodeFormat.EAN_8,
      BarcodeFormat.UPC_A,
      BarcodeFormat.UPC_E,
      BarcodeFormat.CODE_128,
    ]);
    readerRef.current.setHints(hints);

    // Lister caméras
    (async () => {
      try {
        // iOS/Chrome réclament souvent une 1ère permission
        await navigator.mediaDevices.getUserMedia({ video: true });
        const list = await BrowserMultiFormatReader.listVideoInputDevices();
        setDevices(list);

        // Choisir caméra arrière si possible
        const back = list.find(
          (d) =>
            /back|rear|environment/i.test(d.label) || /arrière/i.test(d.label)
        );
        setDeviceId((back ?? list[0])?.deviceId);
      } catch (e: any) {
        setError(e?.message ?? "Impossible d’accéder à la caméra.");
      }
    })();

    return () => {
      stop();
      (readerRef.current as any)?.reset?.();
      (readerRef.current as any)?.stopContinuousDecode?.();
      readerRef.current = null;
    };
  }, [stop]);

  useEffect(() => {
    if (!deviceId || !videoRef.current || !readerRef.current) return;

    setError(null);
    setActive(true);

    (async () => {
      try {
        // Important pour iOS: playsInline + muted (autoplay)
        videoRef.current!.setAttribute("playsinline", "true");
        videoRef.current!.muted = true;

        const retControls = await readerRef.current!.decodeFromVideoDevice(
          deviceId,
          videoRef.current!,
          (res, _err, cbControls) => {
            if (cbControls) controlsRef.current = cbControls;
            if (res) {
              onResult(res.getText());
              stop();
              onClose?.();
            }
            // err peut être fréquent pendant la recherche: on ne l’affiche pas
          }
        );
        if (retControls) controlsRef.current = retControls;
      } catch (e: any) {
        setError(e?.message ?? "Erreur lors du démarrage du scanner.");
        setActive(false);
      }
    })();

    return () => {
      stop();
    };
  }, [deviceId, onResult, onClose, stop]);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <label className="text-sm">Caméra</label>
        <select
          className="border rounded p-1 text-sm dark:bg-zinc-800 dark:border-zinc-700"
          value={deviceId}
          onChange={(e) => setDeviceId(e.target.value)}
        >
          {devices.map((d) => (
            <option key={d.deviceId} value={d.deviceId}>
              {d.label || d.deviceId}
            </option>
          ))}
        </select>
      </div>

      <div className="relative border rounded overflow-hidden dark:border-zinc-700">
        <video
          ref={videoRef}
          className="w-full h-64 object-cover bg-black"
          autoPlay
          muted
          playsInline
        />
      </div>

      <p className="text-xs text-gray-500">
        Aligne le code-barres dans le cadre. Autorise l’accès à la caméra.
      </p>

      {error && <p className="text-xs text-red-600">{error}</p>}

      <div className="flex gap-2">
        <button
          type="button"
          disabled={!active}
          onClick={stop}
          className="px-3 py-2 border rounded disabled:opacity-50
                     dark:bg-zinc-800 dark:border-zinc-700"
        >
          Arrêter
        </button>
        <button
          type="button"
          onClick={onClose}
          className="px-3 py-2 border rounded
                     dark:bg-zinc-800 dark:border-zinc-700"
        >
          Fermer
        </button>
      </div>
    </div>
  );
}
