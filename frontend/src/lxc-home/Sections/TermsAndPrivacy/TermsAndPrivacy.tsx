import TermsAndPrivacyStyleWrapper from "./TermsAndPrivacy.style";
import AlignIcon from "../../assets/images/auth-and-utility/textalign-left.svg";
import StickyBox from "react-sticky-box";
import ScrollAnimate from "../../Components/ScrollAnimate";
import PropTypes from "prop-types";

interface TermsAndPrivacyProps {
  title?: string;
  lastUpdated?: string;
  data: {
    contentId: string;
    title: string;
    description?: string;
    delay?: number;
  }[];
  children?: React.ReactNode;
}

const TermsAndPrivacy = ({ title, lastUpdated = "11 June 2025", data, children }: TermsAndPrivacyProps) => {
  return (
    <TermsAndPrivacyStyleWrapper>
      <div className="container">
        <ScrollAnimate delay={200}>
          <p className="uppercase">Last updated: {lastUpdated}</p>
          {title && <h1>{title}</h1>}
        </ScrollAnimate>

        <div className="terms-and-service-inner">
          <div className="row">
            <div className="col-md-4 ">
              <StickyBox offsetTop={20} offsetBottom={20}>
                <ScrollAnimate delay={200}>
                  <h6 className="content-table-title dm-sans">
                    <img src={AlignIcon} alt="icon" /> TABLE OF CONTENTS
                  </h6>
                  <ol className="terms-list">
                    {data?.map((item, i) => (
                      <li key={i}>
                        <a
                          href={`#${item.contentId}`}
                          className="list-group-item list-group-item-action"
                        >
                          {item.title}
                        </a>
                      </li>
                    ))}
                  </ol>
                </ScrollAnimate>
              </StickyBox>
            </div>
            <div className="col-md-8">
              <div className="terms-and-service-content">
                {children}
                {data?.map((item, i) => (
                  <div key={i} id={item.contentId}>
                    <ScrollAnimate delay={item.delay}>
                      <h4>{`${i + 1}. ${item.title}`}</h4>
                      {item.description && (
                        <div
                          dangerouslySetInnerHTML={{ __html: item.description }}
                        />
                      )}
                    </ScrollAnimate>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </TermsAndPrivacyStyleWrapper>
  );
};
TermsAndPrivacy.propTypes = {
  title: PropTypes.string,
  lastUpdated: PropTypes.string,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      contentId: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string,
      delay: PropTypes.number,
    })
  ).isRequired,
  children: PropTypes.node,
};

export default TermsAndPrivacy;

