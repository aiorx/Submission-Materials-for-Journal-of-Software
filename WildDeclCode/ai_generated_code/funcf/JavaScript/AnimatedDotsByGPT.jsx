const AnimatedDots = () => {
    const [dots, setDots] = useState('.');

    useEffect(() => {
        const timer = setInterval(() => {
            setDots((prevDots) => {
                // Update the number of dots
                switch (prevDots) {
                    case '.':
                        return '..';
                    case '..':
                        return '...';
                    case '...':
                        return '.';
                    default:
                        return '.';
                }
            });
        }, 750); // Interval of 500ms

        return () => clearInterval(timer); // Cleanup the timer when component unmounts
    }, []);

    return (
        // I changed the div to a span and added some styles, and changed the delay, everything else was Built using basic development resources-3
        <span style={{
            display: "inline-block",
            width: "5px",

        }}>
            {dots}
        </span>
    );
};