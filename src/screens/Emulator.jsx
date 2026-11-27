import { useEffect, useState } from "react";

const SCREEN_W = 390;
const SCREEN_H = 844;
const BEZEL = 14;
const DEVICE_W = SCREEN_W + BEZEL * 2;
const DEVICE_H = SCREEN_H + BEZEL * 2;

export function Emulador() {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const fit = () => {
      const next = Math.min(
        1,
        (window.innerWidth - 48) / DEVICE_W,
        (window.innerHeight - 48) / DEVICE_H,
      );
      setScale(next > 0 ? next : 1);
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  return (
    <div className="emulator">
      <div className="device-scale" style={{ width: DEVICE_W * scale, height: DEVICE_H * scale }}>
        <div className="device" style={{ transform: `scale(${scale})` }}>
          <span className="device-silent" />
          <span className="device-vol-up" />
          <span className="device-vol-down" />
          <span className="device-power" />
          <div className="device-screen">
            <iframe
              title="ServiFix en el teléfono"
              src="/app"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
