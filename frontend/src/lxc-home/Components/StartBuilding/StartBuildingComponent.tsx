import StartBuildingStyleWrapper from "./StartBuilding.style";
import BuildingImg from "../../assets/images/about-us/building-img.svg";
import ScrollAnimate from "../ScrollAnimate";

const StartBuildingComponent = () => {
  return (
    <StartBuildingStyleWrapper>
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-7 col-md-8">
            <div className="building-content">
              <ScrollAnimate delay={200}>
                <div className="section-title">
                  <h2 className="title">
                    Start transforming your school<br />
                    with LearnXChain today
                  </h2>
                </div>
              </ScrollAnimate>
              <ScrollAnimate delay={200}>
                <a href="/schedule-demo" className="bg-blue-btn">
                  <span className="btn-inner">
                    <span className="btn-normal-text">Start Your Free Trial</span>
                    <span className="btn-hover-text">Start Your Free Trial</span>
                  </span>
                </a>
              </ScrollAnimate>
            </div>
          </div>
          <div className="col-lg-5 col-md-4">
            <ScrollAnimate delay={200}>
              <div className="building-img">
                <img src={BuildingImg} alt="learnxchain-school-management" />
              </div>
            </ScrollAnimate>
          </div>
        </div>
      </div>
    </StartBuildingStyleWrapper>
  );
};

export default StartBuildingComponent;
