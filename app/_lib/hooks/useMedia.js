import { useEffect, useState } from "react";

export default function useMedia() {
  const [isMd, setIsMdUp] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia("(min-width: 768px)");
    const update = () => setIsMdUp(mql.matches);
    update();
    mql.addEventListener?.("change", update);
    return () => mql.removeEventListener?.("change", update);
  }, []);
  return isMd;
}

export function useMediaLarge() {
  const [isMdLarge, setIsMdLargeUp] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1600px)");
    const update = () => setIsMdLargeUp(mql.matches);
    update();
    mql.addEventListener?.("change", update);
    return () => mql.removeEventListener?.("change", update);
  }, []);
  return isMdLarge;
}
