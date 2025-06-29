import MainDemoImg from "../../images/mega-menu/main_demo-min.png";
import CustomerServicesImg from "../../images/mega-menu/customer_services-min.png";
import TeamCollaborationImg from "../../images/mega-menu/team_collaboration-min.png";
import Sass1Img from "../../images/mega-menu/saas_landint_one-min.png";
import Sass2Img from "../../images/mega-menu/saas_landint_two-min.png";
import AppLandingImg from "../../images/mega-menu/app_landing-min.png";
import CorporateImg from "../../images/mega-menu/corporate-min.png";
import CryptoWallet1Img from "../../images/mega-menu/crypto__wallet_one-min.png";
import CryptoWallet2Img from "../../images/mega-menu/crypto__wallet_two-min.png";
import CryptoTokenImg from "../../images/mega-menu/crypto_token-min.png";
import DefiImg from "../../images/mega-menu/defi_landing-min.png";
import NewsletterImg from "../../images/mega-menu/newsletter-min.png";
import ChatbotImg from "../../images/mega-menu/chatbot-min.png";
import BusinessImg from "../../images/mega-menu/business-min.png";
import FinanceImg from "../../images/mega-menu/finance-min.png";
import AccountingImg from "../../images/mega-menu/accounting-min.png";
import PortfolioImg from "../../images/mega-menu/portfolio-min.png";

import MoreDemoShapeImg from "../../images/mega-menu/more-demo-shape.svg";

const Data = [
  {
    column: 1,
    menuList: [
      {
        title: "Main Demo",
        dataMenu: "mainDemo",
        url: "/",
      },
      {
        title: "Customer Service",
        dataMenu: "CustomerService",
        url: "/customer-service",
      },
      {
        title: "Team Collaboration",
        dataMenu: "Team",
        url: "/team-collaboration",
      },
      {
        title: "SaaS Landing One",
        dataMenu: "sass1",
        url: "/sass-landing",
      },
      {
        title: "SaaS Landing Two",
        dataMenu: "sass2",
        url: "/sass-landing-two",
        tag: "new",
      },
      {
        title: "App Landing",
        dataMenu: "app",
        url: "/app-landing",
      },
      {
        title: "Corporate",
        dataMenu: "corporate",
        url: "/corporate",
      },
    ],
  },
  {
    column: 2,
    menuList: [
      {
        title: "Crypto Wallet One",
        dataMenu: "cryptoWallet1",
        url: "/crypto-wallet-one",
        tag: "hot",
      },
      {
        title: "Crypto Wallet Two",
        dataMenu: "cryptoWallet2",
        url: "/crypto-wallet-two",
        tag: "trendy",
      },
      {
        title: "Crypto Token",
        dataMenu: "cryptoToken",
        url: "/crypto-token",
      },
      {
        title: "DeFi Landing",
        dataMenu: "defi",
        url: "/defi-landing",
        tag: "hot",
      },
      {
        title: "Newsletter",
        dataMenu: "newsletter",
        url: "/newsletter",
      },
      {
        title: "Chat Bot Landing",
        dataMenu: "chatbot",
        url: "/chatbot",
      },
      {
        title: "Business",
        dataMenu: "business",
        url: "/business",
      },
    ],
  },
  {
    column: 3,
    demoCard: {
      title: "More Demo",
      title2: "Coming Soon...",
      img: MoreDemoShapeImg,
    },
    menuList: [
      {
        title: "Finance",
        dataMenu: "finance",
        url: "/finance",
        tag: "trendy",
      },
      {
        title: "Accounting",
        dataMenu: "accounting",
        url: "/accounting",
      },
      {
        title: "Portfolio",
        dataMenu: "portfolio",
        url: "/portfolio",
      },
    ],
  },
  {
    column: 4,
    demoImgList: [
      {
        dataMenu: "mainDemo",
        img: MainDemoImg,
      },
      {
        dataMenu: "CustomerService",
        img: CustomerServicesImg,
      },
      {
        dataMenu: "Team",
        img: TeamCollaborationImg,
      },
      {
        dataMenu: "sass1",
        img: Sass1Img,
      },
      {
        dataMenu: "sass2",
        img: Sass2Img,
      },
      {
        dataMenu: "app",
        img: AppLandingImg,
      },
      {
        dataMenu: "corporate",
        img: CorporateImg,
      },
      {
        dataMenu: "cryptoWallet1",
        img: CryptoWallet1Img,
      },
      {
        dataMenu: "cryptoWallet2",
        img: CryptoWallet2Img,
      },
      {
        dataMenu: "cryptoToken",
        img: CryptoTokenImg,
      },
      {
        dataMenu: "defi",
        img: DefiImg,
      },
      {
        dataMenu: "newsletter",
        img: NewsletterImg,
      },
      {
        dataMenu: "chatbot",
        img: ChatbotImg,
      },
      {
        dataMenu: "business",
        img: BusinessImg,
      },
      {
        dataMenu: "finance",
        img: FinanceImg,
      },
      {
        dataMenu: "accounting",
        img: AccountingImg,
      },
      {
        dataMenu: "portfolio",
        img: PortfolioImg,
      },
    ],
  },
];

export default Data;
