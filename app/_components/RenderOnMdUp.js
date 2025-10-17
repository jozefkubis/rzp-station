"use client";

import { useEffect, useState } from "react";

export default function RenderOnMdUp({ children }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 768px)");
    const handle = () => setShow(mql.matches);
    handle();
    mql.addEventListener("change", handle);
    return () => mql.removeEventListener("change", handle);
  }, []);

  return show ? children : null;
}
