import Layout from "../Layout";
import Header from "../Sections/Header/Header";
import StartBuildingComponent from "../Components/StartBuilding/StartBuildingComponent";
import FooterOne from "../Sections/Footer/FooterOne";
import RefundPolicySection from "../Sections/TermsAndPrivacy/RefundPolicy";

const RefundPolicy = () => {
  return (
    <Layout pageTitle="LearnXChain - Refund Policy">
      <Header variant={"main-header"} />
      <RefundPolicySection />
      <StartBuildingComponent />
      <FooterOne />
    </Layout>
  );
};

export default RefundPolicy; 