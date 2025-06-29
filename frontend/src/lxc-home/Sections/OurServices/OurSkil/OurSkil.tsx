import OurSkilStyle from "./OurSkil.style";
import TitleStyleWrapper from "../../../Components/Title/Title.style";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { easeQuadInOut } from "d3-ease"; // Update path accordingly
import { skillsData } from "../../../assets/data/OurServicesData/SkilData";

import skillsImg from "../../../assets/images/services/skills-img.svg";
import AnimatedProgressProvider from "./../../../Components/AnimatedProgressProvider";
import ScrollAnimate from "../../../Components/ScrollAnimate";

const OurSkil = () => {
  return (
    <OurSkilStyle className="skills-section">
      <div className="container">
        <div className="row align-items-center justify-content-between">
          <div className="col-lg-6">
            <div className="skills-content">
              <ScrollAnimate delay={200}>
                <TitleStyleWrapper>
                  <div className="section-title">
                    <span className="sub-title">Our Skills</span>
                    <h2 className="title">
                      We’re Innovators <br />
                      &amp; Marketing Experts
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
                <div className="skills-status">
                  {skillsData?.map((skill, index) => (
                    <div key={index} className="skills-item">
                      <div className="progress-inner">
                        <AnimatedProgressProvider
                          valueStart={0}
                          valueEnd={skill.percentage}
                          duration={1.4}
                          easingFunction={easeQuadInOut}
                        >
                          {(value) => (
                            <CircularProgressbar
                              value={value}
                              text={`${Math.round(value)}%`}
                              strokeWidth={5}
                              styles={buildStyles({
                                textColor: "#000",
                                pathColor: skill.color,
                                trailColor:
                                  "${({ theme }) => theme.colors.whiteColor}",
                              })}
                            />
                          )}
                        </AnimatedProgressProvider>
                      </div>
                      <p>{skill.skill}</p>
                    </div>
                  ))}
                </div>
              </ScrollAnimate>
            </div>
          </div>
          <div className="col-lg-5">
            <div className="skills-img">
              <ScrollAnimate delay={200}>
                <img src={skillsImg} alt="skills-img" />
              </ScrollAnimate>
            </div>
          </div>
        </div>
      </div>
    </OurSkilStyle>
  );
};

export default OurSkil;
