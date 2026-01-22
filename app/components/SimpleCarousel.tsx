import useEmblaCarousel from "embla-carousel-react";
import { useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SimpleCarouselProps {
  children: React.ReactNode[];
}

export default function SimpleCarousel(props: SimpleCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel();

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <div className="embla w-full relative">
      <div className="embla__viewport overflow-hidden" ref={emblaRef}>
        <div className="embla__container flex">
          {props.children.map((child, index) => (
            <div key={index} className="embla__slide h-fit">
              {child}
            </div>
          ))}
        </div>
      </div>
      <button
        type="button"
        className="embla__prev btn btn-circle absolute top-1/2 left-2 -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full opacity-75 hover:opacity-100 transition-opacity btn-btn-circle"
        onClick={scrollPrev}
      >
        <ChevronLeft />
      </button>
      <button
        type="button"
        className="embla__next absolute top-1/2 right-2 -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full opacity-75 hover:opacity-100 transition-opacity btn btn-circle"
        onClick={scrollNext}
      >
        <ChevronRight />
      </button>
    </div>
  );
}
