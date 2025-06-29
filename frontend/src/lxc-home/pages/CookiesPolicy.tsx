import Layout from "../Layout";
import Header from "../Sections/Header/Header";
import FooterOne from "../Sections/Footer/FooterOne";
import TermsAndPrivacy from "../Sections/TermsAndPrivacy/TermsAndPrivacy";
import { CookiesPolicyData } from "../../cookiesData/data/cookiesPolicy";

const CookiesPolicy = () => {
  return (
    <Layout pageTitle="LearnXChain - Cookies Policy">
      <Header variant={"main-header"} />
      <TermsAndPrivacy
        title="Cookies Policy"
        data={CookiesPolicyData}
      >
    
      </TermsAndPrivacy>
      <FooterOne />
    </Layout>
  );
};

export default CookiesPolicy;



export { CookiesPolicyData };
