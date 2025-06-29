import Layout from "../Layout";
import Header from "../Sections/Header/Header";
import StartBuildingComponent from "./../Components/StartBuilding/StartBuildingComponent";
import FooterOne from "./../Sections/Footer/FooterOne";
import ParallaxComponent from "../Components/Peralax/ParallaxComponent";
import Breadcumbs from "../Components/Breadcumbs/Breadcumbs";
import PeopleUsing from "../Sections/AboutUs/PeopleUsing/PeopleUsing";
import AboutUsContent from "../Sections/AboutUs/AboutUsContent/AboutUsContent";
import Team from "../Sections/Team/Team";
import TestimonialsOne from "../Sections/Testimonials/TestimonialsOne";

const AboutUs = () => {
  return (
    <Layout pageTitle="LearnXChain - About us">
      <Header variant="main-header" />
      <Breadcumbs title="About Us" />
      <PeopleUsing />
      <ParallaxComponent />
      <AboutUsContent />
      <TestimonialsOne />
      <Team />
      <StartBuildingComponent />
      <FooterOne />
    </Layout>
  );
};

export default AboutUs;
