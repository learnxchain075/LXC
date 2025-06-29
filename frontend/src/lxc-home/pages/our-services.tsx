import Layout from "../Layout";
import Header from "../Sections/Header/Header";
import StartBuildingComponent from "../Components/StartBuilding/StartBuildingComponent";
import FooterTwo from "../Sections/Footer/FooterOne";
import Breadcumbs from "../Components/Breadcumbs/Breadcumbs";
import ServiceList from "../Sections/OurServices/ServiceList/ServiceList";
import OurSkil from "../Sections/OurServices/OurSkil/OurSkil";
import CoreFeature from "../Sections/OurServices/CoreFeature/CoreFeature";

const OurServices = () => {
  return (
    <Layout pageTitle="LearnXChain - Our Services">
      <Header variant="main-header" />
      <Breadcumbs title="Our Services" />
      <ServiceList />
      <OurSkil />
      <CoreFeature />
      <StartBuildingComponent />
      <FooterTwo />
    </Layout>
  );
};

export default OurServices;
