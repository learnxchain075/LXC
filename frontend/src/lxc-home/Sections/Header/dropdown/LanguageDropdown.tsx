import LanguageDropdownStyleWrapper from "./LanguageDropdown.style";

import GlobalImg from "../../../assets/images/icons/global-gray.svg";

const LanguageDropdown = ({ variant }) => {
  return (
    <LanguageDropdownStyleWrapper className={`language-dropdown ${variant}`}>
      <button type="button" className="toggler">
        <img src={GlobalImg} alt="icon" />
        <span className="selected">EN</span>
      </button>

      <ul className="list">
        <li>
          <a href="#" className="list-item">
            <span className="select">EN</span>
            <span>English (US)</span>
          </a>
        </li>
        <li>
          <a href="#" className="list-item">
            <span className="select">EN</span>
            <span>English (UK)</span>
          </a>
        </li>
        <li>
          <a href="#" className="list-item">
            <span className="select">ES</span>
            <span>Español</span>
          </a>
        </li>
        <li>
          <a href="#" className="list-item">
            <span className="select">FR</span>
            <span>Français</span>
          </a>
        </li>
        <li>
          <a href="#" className="list-item">
            <span className="select">Tü</span>
            <span>Türkçe</span>
          </a>
        </li>
        <li>
          <a href="#" className="list-item">
            <span className="select">简体</span>
            <span>简体中文</span>
          </a>
        </li>
        <li>
          <a href="#" className="list-item">
            <span className="select">ITA</span>
            <span>Italiano</span>
          </a>
        </li>
        <li>
          <a href="#" className="list-item">
            <span className="select">العر</span>
            <span>العربية</span>
          </a>
        </li>
      </ul>
    </LanguageDropdownStyleWrapper>
  );
};

export default LanguageDropdown;
