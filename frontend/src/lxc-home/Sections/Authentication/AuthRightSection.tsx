import Data from "../../assets/data/auth/authBrands";

import AuthVideo from "../../assets/videos/sass.mp4";
import ScrollAnimate from "../../Components/ScrollAnimate";

const AuthRightSection = () => {
  return (
    <section className="auth-right-section">
      <video loop autoPlay playsInline muted>
        <source src={AuthVideo} type="video/mp4" />
      </video>

      <div className="auth-brand-slider-section">
        <div className="auth-brand-slider-inner">
          <ScrollAnimate>
            <h5>Big &amp; Small business trusted us 😍</h5>
            <div className="auth-brand-slider">
              <ul>
                {Data?.map((item, i) => (
                  <li key={i}>
                    <img src={item.icon} alt={`brand-${i + 1}`} />
                  </li>
                ))}
              </ul>
            </div>
          </ScrollAnimate>
        </div>
      </div>
    </section>
  );
};

export default AuthRightSection;
