import ServiceListStyle from "./ServiceList.style";
import { serviceItems } from "../../../assets/data/OurServicesData/ServiceData";
import ScrollAnimate from "../../../Components/ScrollAnimate";

const ServiceList = () => {
  return (
    <ServiceListStyle className="service-section">
      <div className="container">
        <div className="row">
          {serviceItems.map((item, index) => (
            <div key={index} className="col-lg-3 col-md-6 col-sm-6">
              <ScrollAnimate delay={item.delay}>
              <div className={`service-content item-${index + 1}`}>
                <div className="service-content-title">
                  <h3>{item.title}</h3>
                  <h2>{item.subtitle1}</h2>
                  <h2>{item.subtitle2}</h2>
                </div>
                <ul className="service-content-list">
                  {item.contentList.map((content, contentIndex) => (
                    <li key={contentIndex}>{content}</li>
                  ))}
                </ul>
              </div>
              </ScrollAnimate>
            </div>
          ))}
        </div>
      </div>
    </ServiceListStyle>
  );
};

export default ServiceList;
