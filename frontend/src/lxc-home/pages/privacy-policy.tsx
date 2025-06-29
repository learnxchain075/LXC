import Layout from "../Layout";
import Header from "../Sections/Header/Header";
import StartBuildingComponent from "../Components/StartBuilding/StartBuildingComponent";
import FooterOne from "../Sections/Footer/FooterOne";
import PrivacyPolicySection from "../Sections/TermsAndPrivacy/PrivacyPolicy";

const PrivacyPolicy = () => {
  return (
    <Layout pageTitle="LearnXChain - Privacy Policy">
      <Header variant={"main-header"} />
      <PrivacyPolicySection />
      <StartBuildingComponent />
      <FooterOne />
    </Layout>
  );
};

export default PrivacyPolicy;
