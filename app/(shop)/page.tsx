import { HeroSlider } from "./components/HeroSlider";
import { FeaturedCategories } from "./components/FeaturedCategories";
import { FeaturedProducts } from "./components/FeaturedProducts";
import { PromoBanner } from "./components/PromoBanner";
import { WhyChooseUs } from "./components/WhyChooseUs";

export default function Home() {
  return (
    <>
      <HeroSlider />
      <FeaturedCategories />
      <FeaturedProducts />
      <PromoBanner />
      <WhyChooseUs />
    </>
  );
}
