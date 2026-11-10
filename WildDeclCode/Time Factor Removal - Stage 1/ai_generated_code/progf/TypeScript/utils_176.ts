var useEffect = require('react').useEffect;
var useState = require('react').useState;

/**
 * Aided using common development resources
 */
function useScrollSpy(sectionIds: string[], offset = 0) {
    const [activeId, setActiveId] = useState<string>(sectionIds[0] || "");

    useEffect(function () {
        const handleScroll = () => {
            const scrollPosition = window.scrollY + offset;
            let current = sectionIds[0];

            for (const id of sectionIds) {
                const el = document.getElementById(id);
                if (el) {
                    const top = el.offsetTop;
                    if (scrollPosition >= top) {
                        current = id;
                    }
                }
            }

            setActiveId(current);
        };

        handleScroll();

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [sectionIds, offset]);

    return activeId;
}
