import { useEffect, useState } from "react";

export default function PageTransition({ children }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(t);
  }, []);

  return (
    <div
      className={`
        transition-opacity
        duration-300
        ease-out
        ${visible ? "opacity-100" : "opacity-0"}
      `}
    >
      {children}
    </div>
  );
}
