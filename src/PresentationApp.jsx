import React, { useState, useEffect, useRef } from "react";
import { parsePresentation } from "./utils/markdownParser.js";
import { Navigation } from "./components/Navigation.jsx";
import { ProgressBar } from "./components/ProgressBar.jsx";
import { SlideRenderer } from "./components/SlideRenderer.jsx";

export function PresentationApp({ data }) {
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const slideContainerRef = useRef(null);

  useEffect(() => {
    if (data) {
      try {
        const parsedSlides = parsePresentation(data);
        setSlides(parsedSlides);
      } catch (error) {
        console.error("Error parsing presentation:", error);
      }
    }
  }, [data]);

  useEffect(() => {
    if (slides.length > 0 && typeof gsap !== "undefined") {
      // Инициализируем GSAP анимации
      gsap.set(".slide", { autoAlpha: 0, y: 50 });
      animateSlideIn(currentSlide);
    }
  }, [slides]);

  const animateSlideIn = (slideIndex) => {
    if (typeof gsap === "undefined") return;

    const slideEl = slideContainerRef.current?.querySelector(
      `[data-slide="${slideIndex}"]`
    );
    if (!slideEl) return;

    const timeline = gsap.timeline();

    timeline
      .set(".slide", { autoAlpha: 0 })
      .set(slideEl, { autoAlpha: 1, y: 50, scale: 0.95 })
      .to(slideEl, {
        y: 0,
        scale: 1,
        duration: 0.6,
        ease: "power2.out",
      })
      .from(
        slideEl.querySelectorAll(".animate-item"),
        {
          y: 30,
          opacity: 0,
          duration: 0.4,
          stagger: 0.1,
          ease: "power2.out",
        },
        0.2
      );
  };

  const goToSlide = (index) => {
    if (
      index === currentSlide ||
      isAnimating ||
      index < 0 ||
      index >= slides.length
    )
      return;

    setIsAnimating(true);
    const currentEl = slideContainerRef.current?.querySelector(
      `[data-slide="${currentSlide}"]`
    );

    if (typeof gsap !== "undefined" && currentEl) {
      gsap.to(currentEl, {
        autoAlpha: 0,
        y: -30,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          setCurrentSlide(index);
          animateSlideIn(index);
          setIsAnimating(false);
        },
      });
    } else {
      // Fallback без анимации
      setCurrentSlide(index);
      setIsAnimating(false);
    }
  };

  const nextSlide = () => goToSlide(currentSlide + 1);
  const prevSlide = () => goToSlide(currentSlide - 1);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isAnimating) return;

      switch (e.key) {
        case "ArrowRight":
        case " ":
          e.preventDefault();
          nextSlide();
          break;
        case "ArrowLeft":
          e.preventDefault();
          prevSlide();
          break;
        case "Home":
          e.preventDefault();
          goToSlide(0);
          break;
        case "End":
          e.preventDefault();
          goToSlide(slides.length - 1);
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [currentSlide, slides.length, isAnimating]);

  if (slides.length === 0) {
    return (
      <div className="loading-screen">
        <div className="loader">
          <div className="spinner"></div>
          <p>Загрузка слайдов...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="presentation-container">
      <ProgressBar current={currentSlide + 1} total={slides.length} />

      <header className="presentation-header">
        <div className="logo">MedSystems</div>
        <div className="slide-counter">
          {currentSlide + 1} / {slides.length}
        </div>
      </header>

      <main className="slides-container" ref={slideContainerRef}>
        {slides.map((slide, index) => (
          <SlideRenderer
            key={index}
            slide={slide}
            isActive={index === currentSlide}
            slideIndex={index}
          />
        ))}
      </main>

      <Navigation
        onPrev={prevSlide}
        onNext={nextSlide}
        canGoPrev={currentSlide > 0}
        canGoNext={currentSlide < slides.length - 1}
        isAnimating={isAnimating}
      />
    </div>
  );
}
