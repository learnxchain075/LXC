import HomeIntegrateStyleWrapper from "./HomeIntegrate.style";

import SlackImage from "../../../assets/images/brands/slack.svg";
import ZapierImage from "../../../assets/images/brands/zapier.svg";
import XeroImage from "../../../assets/images/brands/xero.svg";
import HubspotImage from "../../../assets/images/brands/hubspot.svg";
import Ellipse1Image from "../../../assets/images/main-demo/ellipse1.png";
import Ellipse2Image from "../../../assets/images/main-demo/ellipse2.png";
import Ellipse3Image from "../../../assets/images/main-demo/ellipse3.png";
import Ellipse4Image from "../../../assets/images/main-demo/ellipse4.png";
import ManImage from "../../../assets/images/main-demo/man.png";
import ScrollAnimate from "../../../Components/ScrollAnimate";

const HomeIntegrate = () => {
  return (
    <HomeIntegrateStyleWrapper>
      <div className="container">
        <div className="row">
          {/* Left Section */}
          <div className="col-lg-6">
            <ScrollAnimate delay={200}>
              <div className="integrate-card">
                <div className="integrate-card-header">
                  <ScrollAnimate delay={240}>
                    <h3>
                      Seamless integration
                      <br />
                      with education platforms
                    </h3>
                    <p>
                      LearnXChain connects effortlessly with your favorite ed-tech tools —
                      from Google Classroom and Zoom to Slack and Tally. Automate tasks and
                      simplify school operations through decentralized APIs.
                    </p>
                  </ScrollAnimate>
                </div>
                <ScrollAnimate delay={270}>
                  <div className="integrate-slider">
                    <div className="integrate-slider-container">
                      <div className="slider-item">
                        <img src={SlackImage} alt="Slack" />
                      </div>
                      <div className="slider-item">
                        <img src={ZapierImage} alt="Zapier" />
                      </div>
                      <div className="slider-item">
                        <img src={XeroImage} alt="Xero" />
                      </div>
                      <div className="slider-item">
                        <img src={HubspotImage} alt="Hubspot" />
                      </div>
                      <div className="slider-item">
                        <img src={SlackImage} alt="Slack" />
                      </div>
                      <div className="slider-item">
                        <img src={ZapierImage} alt="Zapier" />
                      </div>
                      <div className="slider-item">
                        <img src={XeroImage} alt="Xero" />
                      </div>
                      <div className="slider-item">
                        <img src={HubspotImage} alt="Hubspot" />
                      </div>
                    </div>
                  </div>
                </ScrollAnimate>
              </div>
            </ScrollAnimate>
          </div>

          {/* Right Section */}
          <div className="col-lg-6">
            <ScrollAnimate delay={250}>
              <div className="integrate-card v2">
                <div className="bg-shape">
                  <div className="shape-img img-1">
                    <img src={Ellipse1Image} alt="shape" />
                  </div>
                  <div className="shape-img img-2">
                    <img src={Ellipse2Image} alt="shape" />
                  </div>
                  <div className="shape-img img-3">
                    <img src={Ellipse3Image} alt="shape" />
                  </div>
                  <div className="shape-img img-4">
                    <img className="rotate-icon" src={Ellipse4Image} alt="shape" />
                  </div>
                  <div className="shape-img img-5">
                    <ScrollAnimate delay={280}>
                      <img src={ManImage} alt="illustration" />
                    </ScrollAnimate>
                  </div>
                </div>
                <div className="integrate-card-header">
                  <ScrollAnimate delay={270}>
                    <h3>
                      Built for simplicity,
                      <br />
                      designed for impact
                    </h3>
                    <p>
                      Our interface is made for educators and school admins — with zero
                      learning curve, mobile-friendly layouts, and personalized tools
                      tailored for the Indian education system.
                    </p>
                  </ScrollAnimate>
                </div>
              </div>
            </ScrollAnimate>
          </div>
        </div>
      </div>
    </HomeIntegrateStyleWrapper>
  );
};

export default HomeIntegrate;
