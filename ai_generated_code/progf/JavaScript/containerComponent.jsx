// Supported via standard GitHub programming aids
import React, { useEffect, useRef, useState } from 'react';
  import './containerComponent.css';
  import { gsap } from 'gsap';

  function ContainerComponent() {
    const [activeIndex, setActiveIndex] = useState(0); 
    const cardsRef = useRef([]);
    const leftPartsRef = useRef([]);

    useEffect(() => {
      [0, 1, 2].forEach((i) => {
        if (i === activeIndex) {
          gsap.to(cardsRef.current[i], { width: 'var(--card-expanded-width)', duration: 0.4, ease: 'power2.out' });
          gsap.to(leftPartsRef.current[i], { width: '50%', duration: 0.4, ease: 'power2.out' });
        } else {
          gsap.to(cardsRef.current[i], { width: 'var(--card-collapsed-width)', duration: 0.4, ease: 'power2.inOut' });
          gsap.to(leftPartsRef.current[i], { width: '0%', duration: 0.4, ease: 'power2.inOut' });
        }
      });
    }, [activeIndex]);

    const handleMouseLeave = () => {
      setActiveIndex(0);
    };

    return (
      <div className="container">
        <div className="cards-flex" onMouseLeave={handleMouseLeave}>
          {[0, 1, 2].map((_, index) => (
            <div
              key={index}
              className="card"
              ref={(el) => (cardsRef.current[index] = el)}
              onMouseEnter={() => setActiveIndex(index)}
            >
              <div
                className="card-left"
                ref={(el) => (leftPartsRef.current[index] = el)}
              >
                <img src="/your-image.svg" alt="Visual" className="card-image" />
              </div>
              <div className="card-right">
                <h3>Sponsored Benefits</h3>
                <p>Exciting offers for your lifestyles</p>
                <div className="arrow">&rarr;</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  export default ContainerComponent;
  // This code defines a ContainerComponent that displays a series of cards with animations.