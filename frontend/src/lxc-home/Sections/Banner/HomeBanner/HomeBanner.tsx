import HomeBannerStyle from "./HomeBanner.style";
import { FaCheck } from "react-icons/fa6";

import bannerShape1 from "../../../assets/images/main-demo/banner-shape1.png";
import bannerShape2 from "../../../assets/images/main-demo/banner-shape2.png";
import bannerShape3 from "../../../assets/images/main-demo/banner-shape3.png";
import getDemoSvg from "../../../assets/images/main-demo/get-demo.svg";
import arrowRightSvg from "../../../assets/images/icons/arrow-right.svg";
import heroImg from "../../../assets/images/main-demo/hero-img.png";
import ScrollAnimate from "../../../Components/ScrollAnimate";
import { Link } from "react-router-dom";

const HomeBanner = () => {
  return (
    <HomeBannerStyle className="hero-section">
      <div className="bg-shape">
        <div className="shape-img img-1">
          <ScrollAnimate delay={250}><img src={bannerShape1} alt="shpae1" /></ScrollAnimate>
        </div>
        <div className="shape-img img-2">
          <ScrollAnimate delay={220}><img src={bannerShape2} alt="shape2" /></ScrollAnimate>
        </div>
        <div className="shape-img img-3">
          <ScrollAnimate delay={240}><img src={bannerShape3} alt="shape3" /></ScrollAnimate>
        </div>
      </div>
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-7 col-md-12">
            <div className="hero-content">
              <div className="hero-content-text">
                <ScrollAnimate>
                  <h1 className="uig-banner-title white-color">
                    One <span className="hero-badge">Platform</span>
                    <br />
                   Your Complete School  Solution
                  </h1>
                </ScrollAnimate>

                <ScrollAnimate delay={200}>
                  <p>
                    LearnXChain is the dedicated platform for school management that
                    helps to grow your school digitally
                  </p>
                </ScrollAnimate>
              </div>
              <div className="hero-content-button mb-30">
                <ScrollAnimate delay={250}>
                  <Link to="/schedule-demo" className="bg-blue-btn">
                    <span className="btn-inner">
                      <span className="btn-normal-text">
                        Get Start for Free
                      </span>
                      <span className="btn-hover-text">Get Start for Free</span>
                    </span>
                  </Link>
                </ScrollAnimate>
              </div>
              <ScrollAnimate delay={300}>
                <ul className="hero-content-list">
                  <li>
                    <div className="list-item">
                      <FaCheck />
                      <p className="wt-700">No cards required</p>
                    </div>
                  </li>
                  <li>
                    <div className="list-item">
                      <FaCheck />
                      <p className="wt-700">30 day free trial</p>
                    </div>
                  </li>
                </ul>
              </ScrollAnimate>
            </div>
          </div>
          <div className="col-lg-5 col-md12">
            <ScrollAnimate>
              <div className="hero-img">
                <div className="overlay">
                  <a href="#" className="get-demo-btn">
                    <img src={getDemoSvg} alt="get-demo" />
                    <span className="icon">
                      <img src={arrowRightSvg} alt="icon" />
                    </span>
                  </a>
                </div>
                <img src={heroImg} alt="hero-img" />
              </div>
            </ScrollAnimate>
          </div>
        </div>
      </div>
    </HomeBannerStyle>
  );
};

export default HomeBanner;
