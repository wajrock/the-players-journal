import { useState, useEffect, useRef } from 'react';

export function useOnScreen(ref: React.RefObject<any>) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: .3 // Se déclenche dès que l'élément intersecte les limites ajustées
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    // Nettoyage : désactive l'observateur lorsque le composant est démonté
    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref]);

  return isVisible;
}
