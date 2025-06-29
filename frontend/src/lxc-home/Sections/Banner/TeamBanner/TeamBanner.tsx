import { useEffect } from "react";
import TeamBannerStyleWrapper from "./TeamBanner.style";

import iconVideo from "../../../assets/images/icons/icon-video.svg";
import iconCall from "../../../assets/images/icons/icon-call.svg";
import team1 from "../../../assets/images/team-collaboration/team1.png";
import team2 from "../../../assets/images/team-collaboration/team2.png";
import team3 from "../../../assets/images/team-collaboration/team3.png";
import team4 from "../../../assets/images/team-collaboration/team4.png";
import team5 from "../../../assets/images/team-collaboration/team5.png";
import ScrollAnimate from './../../../Components/ScrollAnimate';

const TeamBanner = () => {
  useEffect(() => {
    const heroSection3Content = document.querySelector(
      ".hero-section-3-content"
    );
    if (heroSection3Content) {
      window.addEventListener("scroll", function () {
        const y = window.scrollY;
        const x = heroSection3Content.offsetTop - 400;
        const items = document.querySelectorAll(
          ".hero-section-3-content .item"
        );
        const z = y / 15;

        if (y > x) {
          items[0].style.transform = `translate(-${z}px)`;
          items[1].style.transform = `translate(-${z / 2}px)`;
          items[3].style.transform = `translate(${z / 2}px)`;
          items[4].style.transform = `translate(${z}px)`;
        }
      });
    }
  }, []);
  
  return (
    <TeamBannerStyleWrapper className="hero-section-3">
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="hero-section-3-header">
              <div className="bg-shape">
                <div className="shape-img img-1 fadeIn">
                  <img src={iconVideo} alt="shape-img" />
                </div>
                <div className="shape-img img-2 fadeIn">
                  <img src={iconCall} alt="shape-img" />
                </div>
              </div>
              <span className="sub-title">Business Plan 25% Off Now</span>
              <h1 className="title">
                Team collaboration
                <br />
                Make easy
              </h1>
              <form action="/" method="post">
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Email Address"
                />
                <input type="submit" value='Get Start' />
              </form>
              <p className="wt-600">Free forever - No credit card required</p>
            </div>
            <div className="hero-section-3-content">
              <div className="item">
                <ScrollAnimate delay={200}><img src={team1} alt="team1" /></ScrollAnimate>
              </div>
              <div className="item">
                <ScrollAnimate delay={225}><img src={team2} alt="team2" /></ScrollAnimate>
              </div>
              <div className="item">
                <ScrollAnimate dekay={250}><img src={team3} alt="team3" /></ScrollAnimate>
              </div>
              <div className="item">
                <ScrollAnimate delay={275}><img src={team4} alt="team4" /></ScrollAnimate>
              </div>
              <div className="item">
                <ScrollAnimate delay={300}><img src={team5} alt="team5" /></ScrollAnimate>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TeamBannerStyleWrapper>
  );
};

export default TeamBanner;
