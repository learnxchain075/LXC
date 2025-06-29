import { useEffect, useRef } from "react";
import HomeMarketingStyleWrapper from "./HomeMarketing.style";
import SectionTitle from "../../../Components/SectionTitle/SectionTitle";

import TitleStyleWrapper from "../../../Components/Title/Title.style";
import CustomPieProgress from "../../../Components/CustomPieProgress";

import ChartImage from "../../../assets/images/shape/chart-1.svg";
import EmojiIconsImage from "../../../assets/images/shape/emoji.svg";
import Star1Image from "../../../assets/images/shape/star1.svg";
import Star2Image from "../../../assets/images/shape/star2.svg";
import Star3Image from "../../../assets/images/shape/star3.svg";
import M1Image from "../../../assets/images/main-demo/m1.png";

import M2Image from "../../../assets/images/main-demo/m2.png";
import Star4Image from "../../../assets/images/shape/star-4.svg";
import ItemShapeImage from "../../../assets/images/shape/item-shape.svg";
import WaveShapeImage from "../../../assets/images/shape/wave-shape.svg";
import { FaCheck } from "react-icons/fa6";
import { GoArrowRight } from "react-icons/go";
import ScrollAnimate from "../../../Components/ScrollAnimate";

const HomeOneMarketingSection = () => {
  // counter up
  const sectionRef = useRef(null);

  useEffect(() => {
    let isAnimated = 0;
    function counterUp() {
      if (isAnimated == 0) {
        const counterItem = document.querySelectorAll(".counter");
        counterItem.forEach((item) => {
          var counterText = item.innerText;
          item.innerText = "0";
          const updateCounter = () => {
            let dataTarget = +item.getAttribute("datatarget");
            if (dataTarget > 999) {
              dataTarget = dataTarget / 1000;
            }
            counterText = +item.innerText;
            let increment = dataTarget / 1000;
            if (counterText < dataTarget) {
              item.innerText = `${Math.ceil(counterText + increment)}`;
              setTimeout(updateCounter, 1);
            }
          };
          updateCounter();
        });
      }
    }

    const handleScroll = () => {
      if (!sectionRef.current) return;
      const y = window.scrollY;
      const x = sectionRef.current.offsetTop - 400;
      if (y > x && y < x + window.innerHeight) {
        counterUp();
        isAnimated++;
      } else {
        isAnimated = 0;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <HomeMarketingStyleWrapper>
      {/* marketing section start */}
      <div className="marketing-section">
        <div className="container">
          <div className="row align-items-center justify-content-between">
            <div className="col-xl-5 col-lg-6">
              <ScrollAnimate delay={200}>
                <div className="marketing-img">
                  <div className="overlay">
                    <div className="overlay-item chart">
                      <img src={ChartImage} alt="chart-img" />
                    </div>
                    <div className="overlay-item emoji-icons">
                      <img src={EmojiIconsImage} alt="emoji-icons" />
                    </div>
                    <div className="overlay-item star-1">
                      <img src={Star1Image} alt="star" />
                    </div>
                    <div className="overlay-item star-2">
                      <img src={Star2Image} alt="star" />
                    </div>
                    <div className="overlay-item star-3">
                      <img src={Star3Image} alt="star" />
                    </div>
                  </div>
                  <img src={M1Image} alt="marketing-img" />
                </div>
              </ScrollAnimate>
            </div>
            <div className="col-xl-6 col-lg-6">
              <div className="marketing-content">
                <div className="marketing-content-title">
                  <TitleStyleWrapper>
                    <ScrollAnimate delay={250}>
                      <div className="section-title">
                        <span className="sub-title">Powerful alone</span>
                        <h2 className="title text-2xl sm:text-3xl md:text-4xl font-bold leading-tight mt-2">
                          Powerful alone,
                          <br className="hidden sm:block" />
                          Unbeatable{" "}
                          <span className="marketing-badge inline-block bg-blue-600 text-white px-2 py-1 rounded text-sm sm:text-base ml-1">
                            Collaboration
                          </span>
                        </h2>
                      </div>
                    </ScrollAnimate>
                  </TitleStyleWrapper>
                </div>
                <div className="marketing-content-body">
                  <ScrollAnimate delay={300}>
                    <p>
                      We’re transforming how schools operate — enabling students, teachers,
                      and institutions to excel independently, and thrive together with
                      cutting-edge technology.
                    </p>
                  </ScrollAnimate>
                  <ScrollAnimate delay={300}>
                    <ul className="list">
                      <li>
                        <div className="list-item">
                          <FaCheck />
                          <p className="w-700">
                            ✅ Share multiple screens during live classes
                          </p>
                        </div>
                      </li>
                      <li>
                        <div className="list-item">
                          <FaCheck />
                          <p className="w-700">✅ Crystal-clear interface across devices</p>
                        </div>
                      </li>
                    </ul>
                  </ScrollAnimate>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="marketing-section marketing-section2 md-pt-60"
        ref={sectionRef}
      >
        <div className="container">
          <div className="row align-items-center justify-content-between">
            <div className="col-xl-6 col-lg-6 order-lg-1 order-2">
              <div className="marketing-content">
                <ScrollAnimate delay={200}>
                  <SectionTitle
                    subtitle="TEAM COLLABORATION"
                    title="Empower your team, boost school-wide productivity"
                    parentClass="md-mb-0"
                  />
                </ScrollAnimate>

                <div className="marketing-content-body">
                  <ScrollAnimate delay={250}>
                    <div className="mb-30">
                      <p>
                        At <strong>LearnXChain</strong>, we redefine how schools function by
                        connecting administrators, teachers, and support staff through a
                        unified, blockchain-secured platform. Our decentralized ecosystem
                        enables real-time collaboration, data transparency, and task
                        automation — all contributing to faster workflows and smarter
                        decisions.
                      </p>
                      <p className="mt-20">
                        ✅ <strong>70% Reduction in Administrative Load</strong><br />
                        ✅ <strong>85% Success Rate in Academic Task Automation</strong>
                      </p>
                    </div>
                  </ScrollAnimate>
                  <ScrollAnimate delay={300}>
                    <a href="#" className="text-link">
                      <span>Explore Real Case Studies</span>
                      <GoArrowRight />
                    </a>
                  </ScrollAnimate>
                </div>
              </div>
            </div>
            <div className="col-xl-5 col-lg-6 order-lg-2 order-1">
              <div className="marketing-img v2">
                <img src={M2Image} alt="marketing-img" />
                <div className="overlay">
                  <div className="overlay-item reduction-time">
                    <div className="reduction-time-top">



                      <h2>
                        70%
                      </h2>




                      <img src={Star4Image} alt="star" />
                    </div>
                    <p>Reduction in Administrative Load</p>
                  </div>
                  <div className="overlay-item success-rate">
                    <img
                      className="rotate-icon"
                      src={ItemShapeImage}
                      alt="icon"
                    />
                    <div className="success-rate-content">
                      <div className="progress pie_progress">
                        <CustomPieProgress
                          Text="Success rate"
                          TextColor="#444444"
                          Percentage={85}
                          ValueColor="#000000"
                          PathColor="#00CEC9"
                          TrailColor="rgba(0, 206, 201, 0.2)"
                        />
                        <p>Automation</p>
                      </div>
                    </div>
                  </div>
                  <div className="overlay-item wave-shape">
                    <img src={WaveShapeImage} alt="shape" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* marketing section end */}
    </HomeMarketingStyleWrapper>
  );
};

export default HomeOneMarketingSection;
