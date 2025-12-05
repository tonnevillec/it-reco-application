import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function useScrollToAnchor(anchor) {
    const location = useLocation();

    useEffect(() => {
        if (!anchor) return;

        // Delay pour s'assurer que la page est rendue
        const timer = setTimeout(() => {
            const element = document.getElementById(anchor);
            if (element) {
                element.scrollIntoView({ behavior: "smooth" });
            }
        }, 50);

        return () => clearTimeout(timer);
    }, [anchor, location.pathname]);
}
