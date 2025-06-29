import CoreFeatureStyle from "./CoreFeature.style";
import TitleStyleWrapper from "../../../Components/Title/Title.style";
import { coreFeatures } from "../../../assets/data/OurServicesData/CoreFeatureData";

import layoutIcon from "../../../assets/images/icons/layout.svg";
import shapeLayoutIcon from "../../../assets/images/icons/shape-layout.svg";
import ScrollAnimate from "../../../Components/ScrollAnimate";
import { useEffect, useRef } from "react";

const CoreFeature = () => {
  const coreFeatureRef = useRef(null);
  const rotateIconRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!coreFeatureRef.current || !rotateIconRef.current) return;

      const y = window.scrollY;
      const x = coreFeatureRef.current.offsetTop - 200;
      let animationValue = (y - x) / 4;
      const animationStop = 45;
      animationValue = Math.max(0, Math.min(animationValue, animationStop));
      rotateIconRef.current.style.transform =
        y > x
          ? `rotate(-${animationValue}deg)`
          : `rotate(${animationValue}deg)`;
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <CoreFeatureStyle className="core-feature-section" ref={coreFeatureRef}>
      <div className="container">
        <div className="row justify-content-between">
          <div className="col-lg-5">
            <div className="core-feature-content">
              <ScrollAnimate delay={200}>
                <TitleStyleWrapper>
                  <div className="section-title">
                    <span className="sub-title">Core feature</span>
                    <h2 className="title xl-mb-40 md-mb-20">
                      We Provide
                      <br />
                      Our Best Service
                    </h2>
                    <p>
                      It is a long established fact that a reader will be
                      distracted by the readable content of a page when looking
                      at its layout. but also the leap into electronic
                      typesetting.
                    </p>
                  </div>
                </TitleStyleWrapper>
              </ScrollAnimate>
              <ScrollAnimate delay={250}>
                <div className="core-feature-actions">
                  <a href="#" className="text-link">
                    <span>View Case Studies</span>
                    <span
                      className="iconify"
                      data-icon="akar-icons:arrow-right"
                    />
                  </a>
                  <a href="#" className="rotate-icon-btn">
                    <img
                      className="rotate-icon"
                      src={shapeLayoutIcon}
                      alt="layout-icon"
                      ref={rotateIconRef}
                    />
                    <span className="icon">
                      <img src={layoutIcon} alt="shape-layout-icon" />
                    </span>
                  </a>
                </div>
              </ScrollAnimate>
            </div>
          </div>
          <div className="col-lg-7">
            <div className="row">
              {coreFeatures.map((feature, index) => (
                <div key={index} className="col-md-6">
                  <ScrollAnimate delay={feature.delay}>
                    <div className="core-feature-item">
                      <div className="core-feature-item-icon">
                        <img src={feature.iconSrc} alt="core-feature-icon" />
                      </div>
                      <div className="core-feature-item-text">
                        <h5>{feature.title}</h5>
                        <p>{feature.description}</p>
                      </div>
                    </div>
                  </ScrollAnimate>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </CoreFeatureStyle>
  );
};

export default CoreFeature;
