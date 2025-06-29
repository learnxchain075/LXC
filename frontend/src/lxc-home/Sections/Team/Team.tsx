import TeamStyleWrapper from "./Team.style";
import SectionTitle from "../../Components/SectionTitle/SectionTitle";
import Data from "../../assets/data/team/team";
import ScrollAnimate from "../../Components/ScrollAnimate";

const Team = () => {
  return (
    <TeamStyleWrapper>
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <ScrollAnimate delay={250}>
              <SectionTitle
                title="Meet the crew"
                subtitle="Team members"
                alignment="center"
              />
            </ScrollAnimate>
          </div>
        </div>
        <div className="row">
          {Data?.map((member, index) => (
            <div key={index} className="col-xl-3 col-lg-4 col-md-6 col-sm-6">
              <ScrollAnimate delay={member.delay}>
              <div className="team-card">
                <div className="team-card-img">
                  <img src={member.avatar} alt={`team-img-${index}`} />
                </div>
                <div className="team-card-info">
                  <h5>{member.name}</h5>
                  <p>{member.designation}</p>
                </div>
                <ul className="team-social-link">
                  {member.socialLinks?.map((item, i) => (
                    <li key={i}>
                      <a href={item.url}>
                        <img src={item.icon} alt="social-icon" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              </ScrollAnimate>
            </div>
          ))}
        </div>
      </div>
    </TeamStyleWrapper>
  );
};

export default Team;
