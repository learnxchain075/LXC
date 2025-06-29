import TermsAndPrivacy from "./TermsAndPrivacy";
import Data from "../../assets/data/terms";
import ScrollAnimate from "../../Components/ScrollAnimate";

const Terms = () => {
  return (
    <TermsAndPrivacy title="Terms of Service" data={Data}>
      <ScrollAnimate delay={200}>
        <p>
          Welcome to LearnXChain (<b>“we”</b>, <b>“our”</b>, or <b>“us”</b>). These Terms of Service (<b>“Terms”</b>) govern your use of our platform, website, and services (collectively referred to as the <b>“Service”</b>). By accessing or using the Service, you agree to comply with and be bound by these Terms.
        </p>
      </ScrollAnimate>
      <ScrollAnimate delay={250}>
        <p>
          Some features of the Service may require a paid subscription (<b>“Subscription”</b>). If you choose to subscribe, you agree to pay the applicable fees in advance on a recurring basis, based on the plan you select.
        </p>
      </ScrollAnimate>
      <ScrollAnimate delay={300}>
        <p>
          If you do not agree with any part of these Terms, you should not access or use the Service.
        </p>
      </ScrollAnimate>
    </TermsAndPrivacy>
  );
};

export default Terms;
