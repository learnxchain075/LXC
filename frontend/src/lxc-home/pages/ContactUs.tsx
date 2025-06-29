import Layout from "../Layout";
import Header from "../Sections/Header/Header";
import Breadcumbs from "../Components/Breadcumbs/Breadcumbs";
import SayHello from "../Sections/ContactUs/SayHello/SayHello";
import StartBuildingComponent from "../Components/StartBuilding/StartBuildingComponent";
import FooterOne from "../Sections/Footer/FooterOne";
import ContactLocation from "../Sections/ContactUs/ContactLocation/ContactLocation";

const ContactUs = () => {
  return (
    <Layout pageTitle="LearnXChain - Contact Us">
      <Header variant="main-header" />
      <Breadcumbs title="Contact Us" />
      <SayHello />
      <ContactLocation />
      <StartBuildingComponent />
      <FooterOne />
    </Layout>
  );
};

export default ContactUs;
