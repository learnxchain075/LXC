import MailIcon from "../../assets/images/icons/mail.svg";
import CallIcon from "../../assets/images/icons/call.svg";
import FooterContractStyle from './FooterContract.style';

const FooterContractCard = () => {
  return (
    <FooterContractStyle className="footer-contract-card">
      <ul>
        <li><img src={MailIcon} alt="mail" /><a href="mailto:contact@learnxchain.io">contact@learnxchain.io</a></li>
        <li><img src={CallIcon} alt="call" /><a href="tel:+91 7015290569">+91 7015290569</a></li>
      </ul>
    </FooterContractStyle>
  );
};

export default FooterContractCard;
