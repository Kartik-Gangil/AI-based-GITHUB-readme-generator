import { useEffect, useRef } from "react";

export default function CursorGradient() {
    const dotRef = useRef(null);

    useEffect(() => {
        const moveDot = (e) => {
            if (dotRef.current) {
                dotRef.current.style.left = `${e.clientX}px`;
                dotRef.current.style.top = `${e.clientY}px`;
            }
        };

        window.addEventListener("mousemove", moveDot);
        return () => window.removeEventListener("mousemove", moveDot);
    }, []);

    return (
        <div
            ref={dotRef}
            className="fixed z-50 pointer-events-none w-20 h-20 bg-gradient-to-r from-[#38BDF8] via-[#7C3AED] to-[#38BDF8] opacity-80 rounded-full blur-xl transition-transform duration-100"
            style={{ transform: "translate(-50%, -50%)" }}
        ></div>
    );
}
