import FeaturesStyleWrapper from "./Features.style";
import SectionTitle from "../../../Components/SectionTitle/SectionTitle";
import { homeOneFeaturesData } from "../../../assets/data/HomeData/FeatureData";

import FrameImage from "../../../assets/images/main-demo/Frame.svg";
import ScrollAnimate from "../../../Components/ScrollAnimate";

const HomeOneFeatures = () => {
  return (
    <FeaturesStyleWrapper className="feature-section md-pt-40 md-pb-0">
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <ScrollAnimate delay={200}>
              <SectionTitle
                subtitle="Features"
                title="Get amazing benefits"
                parentClass="md-mb-0 text-center"
              />
            </ScrollAnimate>

          </div>
        </div>
        <div className="row LearnXChain-hover-effect">
          {homeOneFeaturesData?.map((info, i) => {
            return (
              <div key={i} className="col-lg-4 col-md-6">
                <ScrollAnimate delay={info?.animetiondelay}>
                  <div className={info?.cardclassName}>
                    <div className="feature-card-shape">
                      <img src={FrameImage} alt="card-shape" />
                    </div>
                    <div className="feature-card-icon">
                      <img src={info?.icon} alt="feature-img" />
                    </div>
                    <div className="feature-card-text">
                      <h5 className="wt-700">{info?.cardTitle}</h5>
                      <p>{info?.cardText}</p>
                    </div>
                  </div>
                </ScrollAnimate>
              </div>
            );
          })}
        </div>
      </div>
    </FeaturesStyleWrapper>
  );
};

export default HomeOneFeatures;
