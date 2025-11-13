"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
  rating: number;
  avatar?: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Rajesh Kumar",
    role: "Property Buyer",
    content:
      "ASYLEN VENTURES made my dream home a reality. Their professional agents and seamless process made property buying so easy!",
    rating: 5,
  },
  {
    id: 2,
    name: "Priya Sharma",
    role: "Real Estate Investor",
    content:
      "Excellent service and great property options. I've invested in multiple properties through ASYLEN VENTURES and couldn't be happier.",
    rating: 5,
  },
  {
    id: 3,
    name: "Amit Patel",
    role: "First-time Buyer",
    content:
      "As a first-time buyer, I was nervous, but the team at ASYLEN VENTURES guided me through every step. Highly recommended!",
    rating: 5,
  },
  {
    id: 4,
    name: "Neha Gupta",
    role: "Property Seller",
    content:
      "Sold my property within weeks! The marketing and reach of ASYLEN VENTURES is impressive. Great experience overall.",
    rating: 5,
  },
];

export function TestimonialsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1,
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev === testimonials.length - 1 ? 0 : prev + 1,
    );
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <div className="relative max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-xl p-8 md:p-12">
        <div className="flex justify-center mb-4">
          {[...Array(currentTestimonial.rating)].map((_, i) => (
            <Star
              key={i}
              className="w-5 h-5 text-secondary fill-secondary"
            />
          ))}
        </div>

        <blockquote className="text-xl text-gray-700 text-center mb-6 italic">
          &ldquo;{currentTestimonial.content}&rdquo;
        </blockquote>

        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-3">
            <span className="text-2xl font-semibold text-primary">
              {currentTestimonial.name.charAt(0)}
            </span>
          </div>
          <div className="text-center">
            <div className="font-semibold text-primary">
              {currentTestimonial.name}
            </div>
            <div className="text-sm text-muted-foreground">
              {currentTestimonial.role}
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={handlePrev}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
        aria-label="Previous testimonial"
      >
        <ChevronLeft className="w-6 h-6 text-primary" />
      </button>

      <button
        onClick={handleNext}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
        aria-label="Next testimonial"
      >
        <ChevronRight className="w-6 h-6 text-primary" />
      </button>

      <div className="flex justify-center gap-2 mt-6">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex
                ? "bg-primary w-8"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
