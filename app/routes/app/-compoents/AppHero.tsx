import { Link } from "react-router";
import HeroGrid from "./HeroGrid";

export default function AppHero() {
  return (
    <div className="min-h-155 flex w-full ">
      <>
        <div className="flex-1 container mx-auto grid lg:grid-cols-2 gap-12 px-4">
          <div className="flex-col flex justify-center prose *:m-0 gap-6 ">
            <h1 className="text-5xl  leading-tight">
              Define Your Style with Our Fashion Accessories.
            </h1>
            <p>
              Discover our diverse collection of meticulously curated fashion
              accessories for both men and women, designed to complement every
              look with sophistication and flair.
            </p>
            <div className="flex gap-2">
              <Link to="/app/products" className="btn flex-1 btn-primary">
                Explore Store
              </Link>
              <Link
                to="/app/faqs"
                className="btn btn-secondary flex-1 btn-outline"
              >
                More Info
              </Link>
            </div>
            {/*// collections*/}
            <div className="p-6 **:m-0 ring rounded-sleek fade flex gap-4 !mt-8 flex-col md:flex-row">
              <div className="self-center md:self-start flex gap-2 md:gap-0 items-center md:flex-col md:items-start">
                <h2 className="text-5xl md:text-2xl font-bold">500+</h2>
                <p>Styles</p>
              </div>
              <div className="divider md:divider-horizontal"></div>
              <div>
                <p>
                  From timeless classics to modern statement pieces. Find the
                  perfect accessory for every occasion and personality.
                </p>
              </div>
            </div>
          </div>
          <div className="flex">
            <HeroGrid />
          </div>
        </div>
      </>
    </div>
  );
}
