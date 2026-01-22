import { get_image } from "@/helpers/client";
import useEmblaCarousel from "embla-carousel-react";
import { useEffect, useState } from "react";

export default function Carousel({ item }: { item: any }) {
  const images = item.images;
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleImageClick = (index: number) => {
    if (emblaApi) emblaApi.scrollTo(index);
  };

  const selected_index = () => {
    if (emblaApi) setSelectedIndex(emblaApi.selectedScrollSnap());
  };

  useEffect(() => {
    if (emblaApi) {
      emblaApi.on("select", selected_index);
      return () => {
        emblaApi.off("select", selected_index);
      };
    }
  }, [emblaApi]);

  return (
    <>
      <div className="w-full  h-100 flex">
        <figure className="embla flex-1  bg-base-300/50 rounded-sleek ring fade">
          <div className="embla__viewport h-full" ref={emblaRef}>
            <div className="embla__container h-full">
              {images.length > 0 ? (
                images.map((imageName, index) => (
                  <div className="embla__slide h-full relative" key={index}>
                    {/* Using a regular img tag instead of Next.js Image component */}
                    <img
                      src={get_image(item, imageName)}
                      alt={`${item.name} image ${index + 1}`}
                      style={{
                        objectFit: "contain",
                        width: "100%",
                        height: "100%",
                      }}
                      className="rounded-md"
                    />
                  </div>
                ))
              ) : (
                <div className="embla__slide h-full flex items-center justify-center text-gray-500">
                  No Image Available
                </div>
              )}
            </div>
          </div>
        </figure>
      </div>{" "}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(72px,1fr))] gap-2">
        {images.map((imageName, index) => (
          <button
            key={index}
            onClick={() => handleImageClick(index)}
            className={`btn h-18 aspect-video w-full btn-soft ring rounded-sleek p-0 overflow-hidden ${
              index === selectedIndex
                ? "btn-accent ring-2 ring-accent"
                : "btn-ghost"
            }`}
          >
            {/* Using a regular img tag instead of Next.js Image component */}
            <img
              src={get_image(item, imageName)}
              alt={`Thumbnail ${index + 1}`}
              style={{ objectFit: "cover", width: "100%", height: "100%" }}
              className="rounded-sleek"
            />
          </button>
        ))}
      </div>
    </>
  );
}
