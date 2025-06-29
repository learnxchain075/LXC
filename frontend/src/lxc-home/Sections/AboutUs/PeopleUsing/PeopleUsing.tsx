import PeopleUsingStyle from "./PeopleUsing.style";
import TitleStyleWrapper from "../../../Components/Title/Title.style";
import { avatarImages } from "../../../assets/data/about-us/aboutData";
import { GoArrowRight } from "react-icons/go";
import CustomerImg from "../../../assets/images/about-us/customer-img.svg";
import PlusIcon from "../../../assets/images/icons/plus-blue.svg";
import ScrollAnimate from "../../../Components/ScrollAnimate";

const PeopleUsing = () => {
  return (
    <PeopleUsingStyle>
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-5">
            <div className="customer-img">
              <ScrollAnimate delay={200}>
                <img src={CustomerImg} alt="learnxchain-customer-img" />
              </ScrollAnimate>
            </div>
          </div>
          <div className="col-lg-7">
            <ScrollAnimate delay={250}>
              <div className="customer-content">
                <ul className="users-list">
                  {avatarImages.map((avatar, index) => (
                    <li key={index}>
                      <a href="#">
                        <img src={avatar} alt={`learnxchain-user-${index}`} />
                      </a>
                    </li>
                  ))}
                  <li>
                    <button>
                      <img src={PlusIcon} alt="join-learnxchain-user" />
                    </button>
                  </li>
                </ul>
                <div className="customer-content-text">
                  <TitleStyleWrapper>
                    <div className="section-title">
                      <h2 className="title mb-0">
                        People using
                        <span className="marketing-badge">LearnXChain</span> with full
                        satisfaction
                      </h2>
                    </div>
                  </TitleStyleWrapper>
                  <p>
                    LearnXChain is empowering schools across India with next-gen digital tools.
                    From managing academics to finance and attendance, everything is streamlined.
                  </p>
                  <p>
                    Our platform is loved by teachers, students, and administrators alike for its
                    ease of use, powerful features, and localized support—especially in Tier 2 & 3 cities.
                  </p>
                  <a href="#" className="text-link">
                    <span>Explore Success Stories</span>
                    <GoArrowRight />
                  </a>
                </div>
              </div>
            </ScrollAnimate>
          </div>
        </div>
      </div>
    </PeopleUsingStyle>
  );
};

export default PeopleUsing;
