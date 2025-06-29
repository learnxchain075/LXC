import { useEffect } from "react";
import Layout from "../Layout";
import HomeBanner from "../Sections/Banner/HomeBanner/HomeBanner";
import Header from "../Sections/Header/Header";
import BrandSlider from "../Components/BrandSlider/BrandSlider";
import HomeOneFeatures from "../Sections/Home/Features/HomeOneFeatures";
import UsabilitySlider from "../Sections/Home/UsabilitySlider/UsabilitySlider";
import HomeOneMarketingSection from "../Sections/Home/HomeMarketing/HomeMarketingSection";
import HomeIntegrate from "../Sections/Home/HomeIntegrate/HomeIntegrate";
import TestimonialsOne from "../Sections/Testimonials/TestimonialsOne";
import FaqHome from "../Sections/Home/FaqHome/FaqHome";
import FooterOne from "../Sections/Footer/FooterOne";
import HomePricing from "../Sections/Home/HomePricing/HomePricing";

const Home = () => {
  return (
    <Layout pageTitle="LearnXChain - Home">
      <div className="body-container">
        <Header variant="v1" />
        <HomeBanner />
       
        <BrandSlider titleClass={"brands-section-title"} />

        <HomeOneFeatures />
        <UsabilitySlider />
        <HomeOneMarketingSection />
        <TestimonialsOne />
        <HomeIntegrate />
        <FaqHome />
        <HomePricing />
        <FooterOne />
      </div>
    </Layout>
  );
};

export default Home;
