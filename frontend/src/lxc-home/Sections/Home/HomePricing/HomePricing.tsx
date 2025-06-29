import { useState } from "react";
import HomePricingStyleWrapper from "./HomePricing.style";
import SectionTitle from "../../../Components/SectionTitle/SectionTitle";
import { FaArrowRight } from "react-icons/fa6";

import PricingShape1Image from "../../../assets/images/shape/pricing-shape1.png";
import PricingShape2Image from "../../../assets/images/shape/pricing-shape2.png";
import PricingShape3Image from "../../../assets/images/shape/pricing-shape3.png";
import Ellipse1Image from "../../../assets/images/shape/ellipse1.png";
import Ellipse2Image from "../../../assets/images/shape/ellipse2.png";
import ScrollAnimate from "../../../Components/ScrollAnimate";
import { pricingPlans } from "../../../assets/data/HomeData/pricingPlans";

const HomePricing = () => {
  const [isYearly, setIsYearly] = useState(false);

  const handleMonthlyClick = () => {
    setIsYearly(false);
  };

  const handleYearlyClick = () => {
    setIsYearly(true);
  };

  const handleToggleChange = (e) => {
    setIsYearly(e.target.checked);
  };

  return (
    <HomePricingStyleWrapper>
      <div className="bg-shape">
        <div className="shape-img img-1">
          <ScrollAnimate delay={200}>
            <img src={PricingShape1Image} alt="shpae1" />
          </ScrollAnimate>
        </div>
        <div className="shape-img img-2">
          <ScrollAnimate delay={200}>
            <img src={PricingShape2Image} alt="shpae2" />
          </ScrollAnimate>
        </div>
        <div className="shape-img img-3">
          <ScrollAnimate delay={200}>
            <img src={PricingShape3Image} alt="shpae3" />
          </ScrollAnimate>
        </div>
        <div className="shape-img img-4">
          <ScrollAnimate delay={200}>
            <img src={Ellipse1Image} alt="ellips1" />
          </ScrollAnimate>
        </div>
        <div className="shape-img img-5">
          <ScrollAnimate delay={200}>
            <img src={Ellipse2Image} alt="ellips2" />
          </ScrollAnimate>
        </div>
      </div>
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <SectionTitle
              title="Pricing Plans"
              subtitle="best value"
              parentClass="xl-mb-30"
              titleClass="white-color"
            />
          </div>
          <div className="col-md-6">
            <div className="pricing-selector">
              <form action="/" method="post">
                <button
                  type="button"
                  className={`pricing-monthly-btn ${!isYearly ? "active" : ""}`}
                  onClick={handleMonthlyClick}
                >
                  Monthly
                </button>

                <input
                  type="checkbox"
                  name="pricing-selector"
                  id="pricing-selector"
                  checked={isYearly}
                  onChange={handleToggleChange}
                />

                <button
                  type="button"
                  className={`pricing-yearly-btn ${isYearly ? "active" : ""}`}
                  onClick={handleYearlyClick}
                >
                  Yearly <span>(20% Off)</span>
                </button>
              </form>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <div className="pricing-content">
              <div className="row">
                {pricingPlans?.map((plan, index) => (
                  <div className="col-lg-4 col-md-6" key={index}>
                    <ScrollAnimate delay={plan.delay}>
                      <div className={`card-tag ${plan.tagDisplay}`}>
                        Recommended
                      </div>
                      <div className="pricing-card">
                        <div className="pricing-card-header">
                          <div className="pricing-card-title">
                            <h2>{plan.title}</h2>
                            <img
                              src={plan.icon}
                              alt="pricing-icon"
                              className="fadeIn s1"
                            />
                          </div>
                          <p>{plan.description}</p>

                          {isYearly ? (
                            <h3>
                              {plan.plans.yearly.price} <span>/year</span>
                            </h3>
                          ) : (
                            <h3>
                              {plan.plans.monthly.price} <span>/month</span>
                            </h3>
                          )}
                        </div>
                        <div className="pricing-card-body">
                          {isYearly ? (
                            <ul className="pricing-card-list">
                              {plan.plans.yearly.features.map((feature, i) => (
                                <li key={i}>{feature}</li>
                              ))}
                            </ul>
                          ) : (
                            <ul className="pricing-card-list">
                              {plan.plans.monthly.features.map((feature, i) => (
                                <li key={i}>{feature}</li>
                              ))}
                            </ul>
                          )}

                          <div className="pricing-card-bottom">
                            <a
                              href={plan.actionLink}
                              className="pricing-card-start-btn"
                            >
                              <span>{plan.actionTitle}</span>
                            </a>
                            <button className="pricing-btn">
                              <FaArrowRight />
                            </button>
                          </div>
                        </div>
                      </div>
                    </ScrollAnimate>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </HomePricingStyleWrapper>
  );
};

export default HomePricing;
