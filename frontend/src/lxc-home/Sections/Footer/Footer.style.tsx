import styled from "styled-components";

import FooterOneBg from "../../assets/images/footer/main-footer-bg.png";
import ChatbotBgImg from "../../assets/images/chatbot/chatbot-footer-bg.png";
import CryptoTokenBgImg from "../../assets/images/crypto-token/bg_footer.png";
import CryptoTokenTextureImg from "../../assets/images/crypto-token/grain-texture.png";
import NewsletterFooterBgImg from "../../assets/images/newslater/newsletter-footer-bg.png";
import SassFooterBgImg from "../../assets/images/sass2/sass-footer-demo-bg.png";

const FooterStyleWrapper = styled.footer`
  background-color: ${({ theme }) => theme.colors.bgFooter};
  position: relative;
  z-index: 0;

  &.home-footer{
    background: #191C1F;
    border: none !important;
    .footer-inner{
      border-radius: 50px 50px 0px 0px;
      background-image: url(${FooterOneBg});
      background-size: cover;
      background-position: top right;
      background-repeat: no-repeat;
    }
    .footer-card{
      max-width: 320px;
    }
    .footer-widget {
      margin-bottom: 45px;
      .widget-title{
        margin-bottom: 30px;
      }
    }
  }
  &.crypto2 {
    background: ${({ theme }) => theme.colors.whiteColor};
    .footer-info {
      p {
        color: ${({ theme }) => theme.colors.textColor};
      }
    }
    .footer-widget {
      .widget-title {
        h6 {
          color: ${({ theme }) => theme.colors.title};
          font-weight: 800;
        }
      }
      .widget-list {
        li {
          a {
            color: ${({ theme }) => theme.colors.title};
          }
        }
      }
    }
    .template-badge {
      background: #4541fe;
    }
    .footer-follow {
      p {
        color: ${({ theme }) => theme.colors.textColor};
      }
      }
    }

    .footer-one-social-link{
        gap: 15px !important;
        li{
          a{
            display: flex;
            align-items: center;
            justify-content: center;
            height: 46px;
            width: 46px;
            border-radius: 50%;
            border-radius: 46px;
            border: 2px solid rgba(255, 255, 255, 0.15);
            img{
              opacity: 1 !important;
            }
            &:hover{
              border-radius: 46px;
              border: 2px solid rgba(255, 255, 255, 0.20);
              background: rgba(255, 255, 255, 0.10);
              .social-icon{
                img{
                  transform: translateY(-24px) !important;
                }
              }
            }
          }
        }

    .footer-copyright {
      p {
        color: ${({ theme }) => theme.colors.textColor};
      }
    }
    .privacy-menu {
      li {
        a {
          color: ${({ theme }) => theme.colors.textColor};
        }
      }
    }
    .footer-bottom {
      border-top: 1px solid ${({ theme }) => theme.colors.blackColor}26;
    }
  }

  .footer-one-menu-list{
    padding-top: 55px;
    h6{
      font-size: 16px;
    }
    ul{
      li{
        a{
          color: ${({ theme }) => theme.colors.whiteColor} !important;
          font-weight: 700;
          line-height: 150%;
          display: flex;
          align-items: center;
          justify-content: flex-start;
        }
        ol{
          list-style: none;
          margin-bottom: 30px;
          margin-top: 25px;
          position: relative;
          padding-left: 17px;
          &.label-none{
            margin-bottom: 30px;
          }
          
          &::after{
            content: '';
            height: 95%;
            width: 2px;
            position: absolute;
            top: 3px;
            left: 1px;
            background: rgba(255, 255, 255, 0.15);
            border-radius: 2px;
          }
          li{
            display: flex;
            align-items: center;
            justify-content: flex-start;
            gap: 8px;
            .template-badge {
                border-radius: 100px;
                background-color: #f7578c;
                padding: 0px 10px;
                text-transform: uppercase;
                font-size: 13px;
                font-weight: 700;
                line-height: 25px;
                color: #ffffff;
            }
            a{
              color: ${({ theme }) => theme.colors.whiteOp80} !important;
              font-weight: 500;
              position: relative;
              &::before{
                transition: 0.3s;
              }
              &:hover{
                padding-left: 10px;
                color: ${({ theme }) => theme.colors.whiteColor} !important;
                &::before{
                  content: '';
                  height: 2px;
                  width: 10px;
                  position: absolute;
                  left: -14px;
                  background: rgba(255, 255, 255, 0.15);
                  border-radius: 0 2px 2px 0;
                } 
              }
            }
          }
        }
      }
    }
  }

  &.v2 {
    background-color: ${({ theme }) => theme.colors.bodyBG2};
    border-radius: 50px 50px 0px 0px;
    .footer-widget {
      margin-top: 0;
      .widget-title h6 {
        color: ${({ theme }) => theme.colors.title};
        font-weight: 800;
      }
      .widget-list {
        margin: 0;
        padding: 0;
        list-style: none;
        li a {
          color: ${({ theme }) => theme.colors.textColor};
          &:hover {
            color: ${({ theme }) => theme.colors.title};
          }
        }
      }
    }

    .footer-bottom {
      border-top: 1px solid ${({ theme }) => theme.colors.blackColor}26;
    }

    .footer-copyright {
      text-align: right;
      p {
        color: ${({ theme }) => theme.colors.textColor};
      }
    }
  }

  &.v3 {
    background-color: ${({ theme }) => theme.colors.whiteColor};
    &::before {
      position: absolute;
      z-index: -1;
      content: "";
      top: 0;
      left: 0;
      width: 36.5%;
      height: 100%;
      background-color: #edf0f5;
    }

    .footer-copyright p {
      color: ${({ theme }) => theme.colors.textColor};
    }
    .footer-widget {
      margin-top: 0;
      .widget-title {
        h6 {
          font-weight: 800;
          color: ${({ theme }) => theme.colors.title};
        }
      }
      .widget-list {
        margin: 0;
        padding: 0;
        list-style: none;
        li a {
          color: ${({ theme }) => theme.colors.textColor};
          &:hover {
            color: ${({ theme }) => theme.colors.title};
          }
        }
      }
    }

    .footer-bottom {
      border-top: 1px solid ${({ theme }) => theme.colors.blackColor}26;
    }

    .footer-copyright {
      text-align: right;
    }
  }

  &.v4 {
    &::before {
      position: absolute;
      z-index: -1;
      content: "";
      top: 0;
      left: 0;
      width: 36.5%;
      height: 100%;
      background-color: ${({ theme }) => theme.colors.whiteColor}05;
    }
    .footer-info {
      margin-bottom: 10px;
    }
    h4 {
      font-size: 18px;
      color: ${({ theme }) => theme.colors.whiteColor};
      font-weight: 600;
    }
    h5 {
      margin-top: 20px;
      font-size: 15px;
      line-height: 36px;
      color: ${({ theme }) => theme.colors.whiteColor};
      a {
        margin-left: 10px;
        background: linear-gradient(270deg, #0095ff 0.85%, #f7578c 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        font-weight: 800;
        text-fill-color: transparent;
      }
    }
  }

  &.v6 {
    background: ${({ theme }) => theme.colors.hero6Bg};
    border-radius: 30px;
    .v6template-badge {
      background: ${({ theme }) => theme.colors.primary6Deep};
    }
  }

  &.finance-footer-container {
    max-width: 1560px;
    padding: 0px 20px;
    margin: auto;
    background-color: transparent;

    .finance-footer-section {
      background: #1f2334;
      border-radius: 30px;
    }
  }

  /*-- footer-top start --*/
  .footer-top {
    padding: 120px 0 70px 0;
    .footer-follow p {
      margin-bottom: 0;
    }
  }

  /*-- footer-info style --*/
  .footer-info {
    margin-bottom: 58px;
    .footer-logo {
      margin-bottom: 37px;
      display: block;
    }
    p {
      color: ${({ theme }) => theme.colors.whiteColor}b2;
    }
  }

  /*-- .footer-follow style --*/
  .footer-follow {
    display: flex;
    align-items: center;
    gap: 20px;
    p {
      font-family: ${({ theme }) => theme.fonts.PlusJakartaSans};
      color: ${({ theme }) => theme.colors.whiteColor};
    }
    .social-link {
      display: flex;
      align-items: center;
      gap: 20px;
      li a {
        img {
          width: 16px;
          height: 16px;
          opacity: 0.7;
          transition: 0.3s;
        }
        transition: 0.3s;
        &:hover {
          opacity: 1;
          img {
            opacity: 1;
          }
          .social-icon{
            img{
              transform: translateY(-28px);
            }
          }
        }
      }
    }
  }
  

  /*-- footer-img style --*/
  .footer-img {
    position: relative;
    a {
      position: absolute;
      top: 72px;
      left: 72px;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background-color: ${({ theme }) => theme.colors.whiteColor};
      display: flex;
      align-items: center;
      justify-content: center;
      svg {
        font-size: 16px;
        color: ${({ theme }) => theme.colors.primary};
      }
    }
  }

  /*-- footer-widget style --*/
  .footer-widget {
    margin-top: 23px;
    .widget-title {
      margin-bottom: 25px;
      h6 {
        text-transform: uppercase;
        font-weight: 800;
        color: ${({ theme }) => theme.colors.whiteColor};
        margin-bottom: 0;
      }
    }

    .widget-list {
      margin: 0;
      padding: 0;
      list-style: none;
      li {
        &:not(:first-child) {
          margin-top: 20px;
        }
      }
      li a {
        color: ${({ theme }) => theme.colors.whiteColor}b2;
        transition: 0.3s;
        span {
          margin-left: 8px;
        }
        &:hover {
          color: ${({ theme }) => theme.colors.whiteColor};
        }
      }
    }
  }

  .footer-copyright {
    p {
      color: ${({ theme }) => theme.colors.textColor};
      margin-bottom: 0;
    }
  }

  /*-- footer-top end --*/

  /*-- footer-bottom start --*/
  .footer-bottom {
    border-top: 1px solid ${({ theme }) => theme.colors.borderColor};
    padding: 30px 0;
    .footer-rating {
      margin: 0;
      padding: 0;
      list-style: none;
      p {
        margin-bottom: 0;
      }
    }
  }

  /*-- social-link style --*/
  .social-link {
    display: flex;
    align-items: center;
    gap: 20px;
    margin: 0;
    padding: 0;
    list-style: none;
    li {
      a{
        display: flex;
        align-items: center;
        justify-content: center;
        height: 46px;
        width: 46px;
        border-radius: 50%;
        border-radius: 46px;
        border: 2px solid rgba(0, 0, 0, 0.15);
        overflow: hidden;
        img{
          opacity: 1 !important;
        }
        &:hover{
          border-radius: 46px;
          border: 2px solid rgba(0, 0, 0, 0.20);
          background: transparent;
          
          .social-icon{
            img{
              transform: translateY(-28px);
            }
            &.small{
              img{
                transform: translateY(-24px);
              }
            }
          }
        }
      }
    }
    &.dark{
      a{
        border: 2px solid rgba(255, 255, 255, 0.15);
        &:hover{
          border: 2px solid rgba(255, 255, 255, 0.20);
          background: rgba(255, 255, 255, 0.15);
        }
      }
    }
    &.corporate-footer-social-link, 
    &.social-link-right{
      justify-content: flex-end;
    }
    .social-icon{
      display: flex;
      align-items: center;
      justify-content: flex-start;
      flex-direction: column;
      overflow: hidden;
      height: 18px;
      transition: 0.3s;
      img{
        margin-bottom: 10px;
        transition: 0.3s;
      }
    }
  }

  

  /*-- footer-copyright style --*/
  .footer-copyright {
    p {
      color: ${({ theme }) => theme.colors.whiteColor}b2;
    }
    &.crypto-wallet-two{
      p{
        color: ${({ theme }) => theme.colors.blackColor}cc;
      }
    }
  }

  /*-- privacy-menu style --*/
  .privacy-menu {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 30px;
    margin: 0;
    padding: 0;
    list-style: none;
    li a {
      color: ${({ theme }) => theme.colors.whiteColor}b2;
      transition: 0.3s;
      &:hover {
        color: ${({ theme }) => theme.colors.whiteColor};
      }
    }
    &.crypto-wallet-two{
      li{
        a{
          color: ${({ theme }) => theme.colors.blackColor}cc;
        }
      }
    }
  }

  /*-- footer-rating style --*/
  .footer-rating {
    display: flex;
    align-items: center;
    gap: 50px;
    .list-item {
      display: flex;
      align-items: center;
      gap: 10px;
      .icon {
        img {
          width: 16px;
          height: 16px;
        }
      }
      .text {
        display: flex;
        align-items: center;
        gap: 5px;
        svg {
          font-size: 16px;
          line-height: 26px;
          color: ${({ theme }) => theme.colors.badgeColor2};
        }
        p {
          font-weight: 500;
          font-size: 15px;
          line-height: 26px;
          color: ${({ theme }) => theme.colors.whiteColor};
        }
      }
    }
  }
  /*-- footer-bottom end --*/

  &.footer6-section {
    margin-top: 124px;
    position: relative;
    background-color: ${({ theme }) => theme.colors.whiteColor};

    .footer-copyright-dark {
      p {
        color: ${({ theme }) => theme.colors.title};
      }
    }
    .footer-contact-text {
      top: 5px;
    }
    &.corporate-footer-section {
      background: #101722;
      margin-top: 0px;
      padding-top: 140px;
      .footer-copyright-dark {
        p {
          color: ${({ theme }) => theme.colors.whiteColor}cc;
          a {
            color: ${({ theme }) => theme.colors.whiteColor};
            transition: 0.3s;
          }
        }
      }
    }
  }

  .footer-contact-section {
    margin-bottom: 84px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    .footer-contact-line {
      width: 100%;
      height: 1px;
      background: ${({ theme }) => theme.colors.blackColor}1a;
      position: absolute;
      left: 0px;
      top: 18px;
      z-index: 1;
    }
    .footer-contact {
      display: flex;
      align-items: flex-start;
      justify-content: flex-start;
      gap: 30px;
      margin-left: -20px;
    }
    .footer-contact-text {
      position: relative;
      z-index: 2;
      max-width: 180px;
      width: 100%;
      p {
        min-width: 100px;
        max-width: 100px;
        padding-left: 20px;
        background: ${({ theme }) => theme.colors.whiteColor};
        text-transform: uppercase;
      }
      h5 {
        font-family: ${({ theme }) => theme.fonts.dmSans};
        font-size: 18px;
        font-weight: 700;
        line-height: 36px;
        padding-left: 20px;
        min-width: max-content;
      }
    }
  }

  .footer-top6 {
    border-bottom: 1px solid ${({ theme }) => theme.colors.blackColor}26;
    padding-bottom: 92px;
    .footer-col {
      h6 {
        font-size: 18px;
        font-weight: 600;
        line-height: 30px;
        margin-top: 35px;
        margin-bottom: 30px;
      }

      h5 {
        font-family: ${({ theme }) => theme.fonts.dmSans};
        font-size: 18px;
        font-weight: 700;
        line-height: 32px;
        margin-bottom: 37px;
        text-transform: uppercase;
      }

      ul {
        li {
          a {
            font-family: ${({ theme }) => theme.fonts.dmSans};
            color: ${({ theme }) => theme.colors.textColor};
            transition: 0.3s;
            &:hover {
              color: ${({ theme }) => theme.colors.primary};
            }
          }
        }
      }

      p {
        margin-bottom: 12px;
      }
      form {
        display: flex;
        align-items: flex-start;
        justify-content: flex-start;
        flex-direction: column;
        input {
          width: 100%;
          font-family: ${({ theme }) => theme.fonts.dmSans};
          border: 2px solid ${({ theme }) => theme.colors.blackColor}1a;
          border-radius: 25px;
          padding: 9px 21px;
          max-width: 270px;
          width: 100%;
          margin-bottom: 20px;
        }
        button {
          color: ${({ theme }) => theme.colors.whiteColor};
          background: ${({ theme }) => theme.colors.primary};
          padding: 9px 38px;
          border-radius: 25px;
        }
      }
      &.v8 {
        ul {
          li {
            padding-bottom: 10px;
            a {
              &:hover {
                color: ${({ theme }) => theme.colors.v8Title};
              }
            }
          }
        }
        form {
          button {
            background: ${({ theme }) => theme.colors.v8Title};
            transition: 0.3s;
            &:hover {
              opacity: 0.8;
            }
          }
        }
      }
      &.corporate-footer-col {
        p {
          color: ${({ theme }) => theme.colors.whiteColor}cc;
        }
        ul {
          li {
            padding-bottom: 18px;
            a {
              color: ${({ theme }) => theme.colors.whiteColor}cc;
              &:hover {
                color: #5ecc62;
              }
            }
          }
        }
        form {
          input {
            background: transparent;
            color: ${({ theme }) => theme.colors.whiteColor};
            border: 2px solid ${({ theme }) => theme.colors.whiteColor}1f;
            &::placeholder {
              color: ${({ theme }) => theme.colors.whiteColor}cc;
            }
          }
          button {
            background: #5ecc62;
            transition: 0.3s;
            &:hover {
              opacity: 0.8;
            }
          }
        }
      }
    }
  }



  .text-link.v8,
  .text-link.v8:hover {
    color: ${({ theme }) => theme.colors.v8Title};
  }

  .text-link.corpotate,
  .text-link.corpotate:hover {
    color: #5ecc62;
  }

  &.v7-footer-area {
    position: fixed;
    z-index: 0;
    bottom: 0px;
    left: 0px;
    width: 100%;
  }

  .footer-section-v7 {
    background: ${({ theme }) => theme.colors.bgFooter};
    padding-top: 99px;
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1;
    .footer-section-grain-texture {
      position: absolute;
      height: 100%;
      width: 100%;
      z-index: 1;
      img {
        height: 100%;
        width: 100%;
      }
    }
  }

  .footer-section-mash-gard {
    position: absolute;
    z-index: 0;
    top: 0%;
    //transform: translate(-45%, -60%);
    //    transform: translate(-50%, -50%);
    width: 827px;
    height: 566px;
  }

  .footer-v7-content {
    position: relative;
    z-index: 4;
  }

  .footer-v7-text {
    text-align: center;
    max-width: 535px;
    width: 100%;
    margin: auto;
    margin-bottom: 60px;
    h2 {
      margin-bottom: 45px;
      color: ${({ theme }) => theme.colors.whiteColor};
    }
    .leav-msg-btn {
      border-radius: 50px;
      width: 220px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      text-transform: capitalize;
      transition: 0.5s;
      margin: auto;
    }
  }

  .v7footer-contact-card {
    background: ${({ theme }) => theme.colors.whiteColor}0d;
    backdrop-filter: blur(5px);
    border-radius: 20px;
    padding: 45px 50px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;

    .v7footer-card-text {
      color: ${({ theme }) => theme.colors.whiteColor};
      p {
        text-transform: uppercase;
      }
      h6 {
        font-size: 18px;
        line-height: 36px;
        margin-bottom: 0;
        color: #fff;
      }
      &.text-right {
        p {
          margin-bottom: 10px;
        }
      }
    }
  }

  .v7-main-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 32px 0px;
    .back-to-top-btn {
      margin: auto;
      .icon {
        transform: rotate(-90deg);
        font-size: 28px;
        color: ${({ theme }) => theme.colors.whiteColor};
      }
    }
    .copyright-text {
      color: ${({ theme }) => theme.colors.whiteColor}cc;
      width: 47%;
      a {
        transition: 0.3s;
        &:hover {
          color: ${({ theme }) => theme.colors.whiteColor};
        }
      }
    }
    .privacy-menu {
      width: 47%;
    }
  }

  .footer-top-section {
    padding: 75px 0px;
    background: url(../images/nft/footer-top-bg.png);
    background-position: center center;
    background-repeat: no-repeat;
    background-size: cover;
    width: 100%;
    position: relative;
    &::before {
      content: "";
      position: absolute;
      top: 0px;
      left: 0px;
      height: 100%;
      width: 50%;
      background: ${({ theme }) => theme.colors.whiteColor}0d;
    }
    .footer-top-text {
      position: relative;
      z-index: 2;
      max-width: 352px;
      &.right {
        margin-left: 240px;
      }
      p {
        font-size: 16px;
        line-height: 50px;
        font-weight: 700;
        margin-bottom: 0px;
        text-transform: uppercase;
        color: ${({ theme }) => theme.colors.whiteColor};
      }

      h3 {
        font-size: 30px;
        line-height: 50px;
        font-weight: 700;
        margin-bottom: 0px;
        color: ${({ theme }) => theme.colors.whiteColor};
        img {
          margin-left: 10px;
        }
      }
    }
  }

  .nft-footer-section {
    padding-top: 78px;
    background: ${({ theme }) => theme.colors.whiteColor};
    margin-top: 100px;
  }
  .nft-top-footer {
    margin-bottom: 54px;
  }
  .nft-footer-logo {
    .logo-dark {
      display: block;
    }

    .logo-light {
      display: none;
    }
  }
  .nft-newsletter {
    h5 {
      font-size: 16px;
      line-height: 28px;
      margin-bottom: 4px;
    }
    form {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      flex-wrap: wrap;
      gap: 10px;
      input {
        background: transparent;
        padding: 8px 19px;
        height: 45px;
        border: 1px solid ${({ theme }) => theme.colors.blackColor}1f;
        border-radius: 25px;
        max-width: 300px;
        width: 100%;
      }
      button {
        width: 160px;
        height: 45px;
        font-weight: 700;
        background: #5f5fff;
        border-radius: 25px;
        color: ${({ theme }) => theme.colors.whiteColor};
        padding: 8px;
        transition: 0.3s;
        img {
          margin-left: 13px;
        }
      }
    }
  }
  .nft-footer-social-list {
    margin-top: 38px;
    ul {
      padding: 0px;
      list-style: none;
      display: flex;
      align-items: center;
      justify-content: space-between;
      max-width: 369px;
      width: 100%;
      margin-bottom: 90px;
    }
  }
  .nft-footer-menu {
    h5 {
      margin-bottom: 21px;
      font-size: 16px;
    }
    ul {
      list-style: none;
      padding: 0px;
      li {
        line-height: 40px;
        a {
          transition: 0.3s;
          &:hover {
            color: ${({ theme }) => theme.colors.title};
          }
        }
      }
    }
  }

  .nft-bottom-footer-right {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 30px;
    ul {
      list-style: none;
      padding: 0px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      max-width: 343px;
      width: 100%;
      margin-bottom: 0px;
      gap: 20px;
      flex-wrap: wrap;
      li {
        color: ${({ theme }) => theme.colors.title};
        font-weight: 700;
        span {
          font-weight: 500;
          color: ${({ theme }) => theme.colors.textColor};
        }
      }
    }
  }
  .nft-bottom-footer {
    position: relative;
    padding: 40px 0px;
    p {
      margin-bottom: 0px;
      height: 100%;
      display: flex;
      align-items: center;
    }
    .nft-blur-shape {
      position: absolute;
      bottom: 0px;
      z-index: 0;
      transform: translateX(50%, -50%);
      width: 100%;
      text-align: center;
    }
    .row {
      position: relative;
      z-index: 2;
    }
  }

  .footer-dropdown {
    max-width: 130px;
    width: 100%;
    margin-left: auto;
    background: ${({ theme }) => theme.colors.whiteColor};
    border: 1px solid ${({ theme }) => theme.colors.blackColor}1f;
    border-radius: 30px;
    position: relative;
    height: 45px;

    &::after {
      content: ">";
      position: absolute;
      top: 6px;
      right: 20px;
      font-size: 20px;
      transform: rotate(90deg);
    }

    select {
      padding: 2px 20px;
      width: 100%;
      height: 100%;
      background: transparent;
      border: none;
      outline: none;
      line-height: auto;
      color: ${({ theme }) => theme.colors.textColor};
      font-weight: 500;
      -webkit-appearance: none;
    }
  }

  /*-- Dark Mood --*/
  body.dark-scheme,
  html.dark-scheme body {
    .nft-footer-section {
      background: #181d22;
    }
    .nft-footer-logo {
      .logo-dark {
        display: none;
      }

      .logo-light {
        display: block;
      }
    }
    .nft-newsletter {
      form {
        input {
          background: ${({ theme }) => theme.colors.whiteColor}14;
          border: 1px solid ${({ theme }) => theme.colors.whiteColor}1f;
        }
      }
    }
    .nft-footer-menu {
      ul {
        li {
          a {
            &:hover {
              color: ${({ theme }) => theme.colors.whiteColor};
            }
          }
        }
      }
    }

    .nft-footer-menu {
      ul {
        li {
          a {
            color: ${({ theme }) => theme.colors.whiteColor}cc;
          }
        }
      }
    }
    .nft-bottom-footer {
      p {
        color: ${({ theme }) => theme.colors.whiteColor}cc;
      }
    }
    .nft-newsletter {
      p {
        color: ${({ theme }) => theme.colors.whiteColor}cc;
      }
    }
    .nft-bottom-footer-right {
      ul {
        li {
          color: ${({ theme }) => theme.colors.whiteColor};
          span {
            color: ${({ theme }) => theme.colors.whiteColor}cc;
          }
        }
      }
    }

    .footer-dropdown {
      background: #181d22;
      border: 1px solid ${({ theme }) => theme.colors.iconColor};
      background: ${({ theme }) => theme.colors.whiteColor}14;
      border: 1px solid ${({ theme }) => theme.colors.whiteColor}1f;

      select {
        color: ${({ theme }) => theme.colors.iconColor};

        option {
          background: #181d22;
        }
      }
    }
  }

  &.token-footer-section {
    background: url(${CryptoTokenBgImg});
    background-position: center center;
    background-repeat: no-repeat;
    background-size: cover;
    background-attachment: fixed;
    .overlay {
      background: url(${CryptoTokenTextureImg});
      background-position: center center;
      background-repeat: no-repeat;
      background-size: cover;
      background-attachment: fixed;
      height: 100%;
      .overlay2 {
        background: linear-gradient(
          180deg,
          #0d1014 0%,
          rgba(13, 16, 20, 0.8) 100%
        );
        height: 100%;
        width: 100%;
        position: relative;
        .footer-shape {
          position: absolute;
          width: 100%;
          bottom: 0px;
          left: 0px;
          text-align: center;
          z-index: 0;
        }
      }
    }
  }

  .token-footer-menu-section {
    position: relative;
    z-index: 1;
    border-top: 1px solid ${({ theme }) => theme.colors.whiteColor}1f;
    border-bottom: 1px solid ${({ theme }) => theme.colors.whiteColor}1f;
    .footer-column {
      padding-top: 73px;
      padding-bottom: 70px;
      border-right: 1px solid ${({ theme }) => theme.colors.whiteColor}1f;
      min-height: 100%;
      padding-left: 8px;
      &4 {
        border-right: none;
      }
      h5 {
        margin-bottom: 26px;
        font-family: ${({ theme }) => theme.fonts.quantico};
        color: ${({ theme }) => theme.colors.whiteColor};
        font-weight: 700;
        line-height: 167%;
        text-transform: uppercase;
      }
      ul {
        list-style: none;
        padding: 0px;
        margin: 0px;
        li {
          a {
            color: ${({ theme }) => theme.colors.whiteColor}cc;
            line-height: 240%;
            font-weight: 500;
            transition: 0.3s;
            &:hover {
              color: ${({ theme }) => theme.colors.whiteColor};
            }
          }
        }
      }
    }
  }

  .token-subscribe-section {
    border-bottom: 1px solid ${({ theme }) => theme.colors.whiteColor}1f;
    padding: 30px 0px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    position: relative;
    z-index: 1;
    input {
      &[type="email"] {
        background: transparent;
        overflow: hidden;
        height: 100%;
        max-width: 500px;
        width: 100%;
        border: none;
        outline: none;
        font-family: ${({ theme }) => theme.fonts.quantico};
        font-weight: 700;
        font-size: 30px;
        line-height: 167%;
        color: ${({ theme }) => theme.colors.whiteColor};
        &::placeholder {
          /* Chrome, Firefox, Opera, Safari 10.1+ */
          color: ${({ theme }) => theme.colors.whiteColor}33;
        }

        &:-ms-input-placeholder {
          /* Internet Explorer 10-11 */
          color: ${({ theme }) => theme.colors.whiteColor}33;
        }

        &::-ms-input-placeholder {
          /* Microsoft Edge */
          color: ${({ theme }) => theme.colors.whiteColor}33;
        }
      }
      &[type="submit"] {
        background: #bfff0a;
        border-radius: 50px;
        max-width: 293px;
        width: 100%;
        overflow: hidden;
        color: ${({ theme }) => theme.colors.title};
        font-weight: 700;
        line-height: 26px;
        padding: 17px 20px;
        border: none;
        outline: none;
        transition: 0.3s;
        &:hover {
          opacity: 0.8;
        }
      }
    }
  }

  .token-footer-bottom-text {
    padding: 40px 0px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    z-index: 1;
    .text {
      font-family: ${({ theme }) => theme.fonts.quantico};
      font-weight: 700;
      font-size: 100px;
      line-height: 120px;
      text-transform: uppercase;
      color: ${({ theme }) => theme.colors.whiteColor};
      span {
        position: relative;
        &.top {
          top: -70px;
          transition: 0.3s;
        }
      }
    }
  }

  &.defi-footer-section {
    background-color: transparent;
    padding-top: 30px;
    position: relative;
    overflow: hidden;
    .footer-row {
      position: relative;
      height: 70px;
      width: 100%;
      overflow: hidden;
      display: flex;
      margin-bottom: 30px;
      padding: 20px;
      z-index: 3;
      &:nth-last-child(1) {
        margin-bottom: 0px;
      }

      &::before {
        content: "";
        height: 100%;
        width: 33.5%;
        position: absolute;
        left: 0px;
        top: 0px;
        z-index: 0;
        background: linear-gradient(
          90deg,
          rgba(255, 255, 255, 0) 0%,
          rgba(55, 234, 142, 0.2) 100%
        );
      }
      &::after {
        content: "";
        height: 100%;
        width: 66.5%;
        position: absolute;
        right: 0px;
        top: 0px;
        z-index: 0;
        background: ${({ theme }) => theme.colors.whiteColor}0d;
      }
    }
    .footer-row-inner {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      position: relative;
      z-index: 1;
    }
    .left {
      max-width: 270px;
      width: 100%;
      text-align: right;
      padding-right: 30px;
    }
    .right {
      padding-left: 60px;
    }
    h5 {
      text-transform: uppercase;
      margin-bottom: 0px;
      font-weight: 700;
      color: ${({ theme }) => theme.colors.whiteColor};
    }
    ul {
      list-style: none;
      padding: 0px;
      margin-bottom: 0px;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      gap: 50px;
      li {
        a {
          color: ${({ theme }) => theme.colors.whiteColor}cc;

          &:hover {
            color: ${({ theme }) => theme.colors.whiteColor};
          }
        }
      }
    }
    .defi-footer-blur {
      position: absolute;
      bottom: 0px;
      z-index: 0;
      left: 22%;
    }
  }

  .defi-footer-bottom {
    position: relative;
    z-index: 1;
    padding: 10px 0px 40px 0px;
    width: 100%;
    a {
      color: ${({ theme }) => theme.colors.whiteColor}cc !important;
      font-weight: 500;
      &:hover {
        color: ${({ theme }) => theme.colors.whiteColor} !important;
      }
      i {
        font-weight: 400;
        font-size: 18px;
        line-height: 30px;
        text-transform: uppercase;
        color: ${({ theme }) => theme.colors.whiteColor};
      }
    }
  }

  .chatbot-body {
    position: relative;
    z-index: 2;
  }
  &.chatbot-footer-section {
    padding-top: 90px;
    padding-bottom: 44px;
    background: url(${ChatbotBgImg});
    background-attachment: fixed;
    background-size: cover;
    &.newsletter-footer {
      background: ${({ theme }) => theme.colors.bgFooter};
    }
    &.sass-footer {
      background: transparent;
      padding-top: 140px;
      position: relative;
      .footer-bg {
        position: absolute;
        bottom: 0px;
        width: 100%;
      }
      .shape-img1 {
        position: absolute;
        top: 20px;
        left: 60px;
      }
      .shape-img2 {
        position: absolute;
        top: 180px;
        left: 0px;
      }
    }
  }

  .chatbot-newslater {
    margin-bottom: 90px;
    h2 {
      color: ${({ theme }) => theme.colors.whiteColor};
      max-width: 540px;
      width: 100%;
    }
    &-left,
    &-right {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 120px;
    }
  }
  .chatbot-footer-card {
    padding: 100px;
    background: ${({ theme }) => theme.colors.whiteColor}0d;
    border-radius: 30px;
    margin-bottom: 60px;
    &.newsletter {
      background: transparent;
      border-bottom: 1px solid ${({ theme }) => theme.colors.whiteColor}1a;
      padding-left: 0px;
      padding-right: 0px;
      padding-bottom: 80px;
      border-radius: 0px;
      .chatbot-footer-left {
        margin-left: auto;
      }
      .chatbot-footer-right {
        border-left: none;
        border-right: 1px solid ${({ theme }) => theme.colors.whiteColor}1a;
      }
    }
    &.crypto-wallet {
      background: transparent;
      border-bottom: 1px solid ${({ theme }) => theme.colors.whiteColor}1a;
      padding-top: 0px;
      padding-left: 0px;
      padding-right: 0px;
      padding-bottom: 80px;
      border-radius: 0px;
      .chatbot-footer-left {
        margin-left: auto;
      }
      .chatbot-footer-right {
        border-left: none;
        border-right: 1px solid ${({ theme }) => theme.colors.whiteColor}1a;
      }
    }
    &.sass {
      border-bottom: 1px solid ${({ theme }) => theme.colors.blackColor}26;
    }
  }
  .chatbot-footer-left {
    max-width: 400px;
    width: 100%;
    h4 {
      margin-bottom: 20px;
      color: ${({ theme }) => theme.colors.whiteColor};
      max-width: 270px;
    }
    p {
      color: ${({ theme }) => theme.colors.whiteColor}cc;
      margin-bottom: 42px;
    }
    &.sass {
      h4 {
        color: ${({ theme }) => theme.colors.title};
      }
      p {
        color: ${({ theme }) => theme.colors.textColor};
      }
    }
  }
  .subscribe-form {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    background: ${({ theme }) => theme.colors.whiteColor}1a;
    border-radius: 35px;
    padding: 10px;
    max-width: 470px;
    width: 100%;
    max-height: 60px;
    &.sass {
      background: ${({ theme }) => theme.colors.whiteColor};
      border: 1px solid ${({ theme }) => theme.colors.blackColor}26;
      border-radius: 35px;
      .form-input {
        color: ${({ theme }) => theme.colors.title};
        &::placeholder {
          /* Chrome, Firefox, Opera, Safari 10.1+ */
          color: ${({ theme }) => theme.colors.title};
        }

        &:-ms-input-placeholder {
          /* Internet Explorer 10-11 */
          color: ${({ theme }) => theme.colors.title};
        }

        &::-ms-input-placeholder {
          /* Microsoft Edge */
          color: ${({ theme }) => theme.colors.title};
        }
      }
      .bg-blue-btn {
        background: #0555ff;
      }
    }

    .form-input {
      color: ${({ theme }) => theme.colors.whiteColor};
      background: transparent;
      border: none;
      outline: none;
      padding: 14px;
      font-weight: 500;
      font-size: 16px;
      line-height: 26px;
      &::placeholder {
        color: ${({ theme }) => theme.colors.whiteColor}63;
      }
    }

    .bg-blue-btn {
      padding: 7px 33px;
      border: none;
      outline: none;
      &:hover {
        opacity: 0.8;
      }
      &.gradient-bg-btn {
        background: linear-gradient(
          90deg,
          #30d7f1 0%,
          #79fa4b 51.56%,
          #fce344 100%
        );
        color: ${({ theme }) => theme.colors.title};
      }
    }
  }
  .chatbot-footer-right {
    padding-left: 49px;
    border-left: 1px solid ${({ theme }) => theme.colors.whiteColor}1a;
  }
  .footer-menu-list {
    h5 {
      font-family: ${({ theme }) => theme.fonts.dmSans};
      font-weight: 700;
      text-transform: uppercase;
      color: ${({ theme }) => theme.colors.whiteColor};
      margin-bottom: 37px;
    }
    ul {
      list-style: none;
      padding: 0px;
      li {
        a {
          line-height: 250%;
          color: ${({ theme }) => theme.colors.whiteColor}cc;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          gap: 5px;
          &:hover {
            color: ${({ theme }) => theme.colors.whiteColor};
          }
          span {
            text-transform: uppercase;
            color: ${({ theme }) => theme.colors.whiteColor};
            background: #f7578c;
            border-radius: 10px;
            height: 20px;
            width: 60px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 13px;
            &.none {
              display: none !important;
            }
            &.crypto-badge {
              background: #01ffb0;
              color: ${({ theme }) => theme.colors.title};
            }
          }
        }
      }
    }
  }

  .chatbot-footer-bottom-left {
    max-width: 571px;
    width: 100%;
    ul {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      gap: 25px;
      list-style: none;
      padding: 0px;
      margin-bottom: 22px;
      max-width: 420px;
      width: 100%;
      flex-wrap: wrap;
      li {
        a {
          color: ${({ theme }) => theme.colors.whiteColor}cc;
          &:hover {
            color: ${({ theme }) => theme.colors.whiteColor};
          }
        }
      }
    }
    &.sass {
      ul {
        li {
          a {
            color: ${({ theme }) => theme.colors.title};
          }
        }
      }
      p {
        color: ${({ theme }) => theme.colors.textColor};
        font-weight: 500;
        span {
          color: ${({ theme }) => theme.colors.title};
          font-weight: 700;
        }
      }
    }
    p {
      margin-bottom: 13px;
      color: ${({ theme }) => theme.colors.whiteColor}80;
      font-size: 13px;
      font-weight: 400;
      line-height: 26px;
      span {
        color: ${({ theme }) => theme.colors.whiteColor};
      }
    }
  }

  .chatbot-footer-bottom-right {
    p {
      color: ${({ theme }) => theme.colors.whiteColor};
      line-height: 36px;
      font-weight: 600;
      font-family: ${({ theme }) => theme.fonts.PlusJakartaSans};

      a {
        background: linear-gradient(270deg, #0095ff 0.85%, #f7578c 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-fill-color: transparent;
        margin-left: 12px;
        font-weight: 800;
      }
    }
    &.sass {
      p {
        a {
          background: linear-gradient(270deg, #0555ff 0.85%, #f7578c 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-fill-color: transparent;
          margin-left: 12px;
        }
      }
    }
    &.crypto {
      p {
        a {
          background: linear-gradient(
            90deg,
            #30d7f1 0%,
            #79fa4b 51.56%,
            #fce344 100%
          );
          -webkit-background-clip: text;
          -webkit-tex-fill-color: transparent;
          background-clip: text;
          text-fill-color: transparent;
        }
      }
    }

    .chatbot-social {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      gap: 14px;
      margin-bottom: 71px;
      p {
        margin-bottom: 0px;
      }
    }
    .chatbot-social-list {
      display: flex;
      align-items: center;
      justify-content: space-between;
      max-width: 193px;
      width: 100%;
      gap: 14px;
      a {
        filter: brightness(100);
        opacity: 70%;
        &:hover {
          opacity: 100;
        }
      }
    }

    &.sass {
      p {
        color: ${({ theme }) => theme.colors.title};
      }
      .chatbot-social-list {
        a {
          img {
            filter: brightness(0);
            opacity: 0.8;
          }
        }
      }
    }
  }
  .crypto-footer-social {
    p {
      color: ${({ theme }) => theme.colors.whiteColor};
      line-height: 36px;
      font-weight: 600;
      font-family: ${({ theme }) => theme.fonts.PlusJakartaSans};
      margin-bottom: 17px;
    }
  }
  .crypto-footer-social-list {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 30px;
    flex-wrap: wrap;
    a {
      height: 60px;
      width: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: ${({ theme }) => theme.colors.whiteColor}0d;
      backdrop-filter: blur(2.5px);
      border-radius: 15px;
      &:hover{
        .social-icon{
          img{
            transform: translateY(-30px);
          }
        }
      }
    }

    .social-icon{
      display: flex;
      align-items: center;
      justify-content: flex-start;
      flex-direction: column;
      overflow: hidden;
      height: 20px;
      transition: 0.3s;
      img{
        margin-bottom: 10px;
        transition: 0.3s;
        max-width: 28px;
      }
    }
  }


  .chatbot-footer-bottom {
    .footer-copyright {
      color: ${({ theme }) => theme.colors.whiteColor}cc;
      font-size: 13px;
      font-weight: 400;
      line-height: 26px;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      min-height: 48px;
      a {
        margin: 0px 5px;
        &:hover {
          color: ${({ theme }) => theme.colors.whiteColor};
        }
      }
      &.sass {
        color: ${({ theme }) => theme.colors.textColor};
        font-weight: 500;
        a {
          &:hover {
            color: ${({ theme }) => theme.colors.title};
          }
        }
      }
      &.crypto {
        color: ${({ theme }) => theme.colors.whiteColor}63;
      }
    }

    .copyright-list {
      display: flex;
      align-items: center;
      justify-content: space-between;
      max-width: 210px;
      list-style: none;
      padding: 0px;
      min-height: 48px;
      li {
        width: 48px;
        height: 48px;
        overflow: hidden;
        border-right-color: 50%;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;

        img {
          height: 100%;
          width: 100%;
          position: absolute;
        }
      }
    }
  }

  /*-- newsletter section --*/
  .newsletter-get-demo-section {
    background: ${({ theme }) => theme.colors.primary};
    border-radius: 30px;
    overflow: hidden;
    &.sass {
      background: #0555ff;
      overflow: visible;
    }
  }
  .newsletter-get-demo-section-inner {
    background: url(${NewsletterFooterBgImg});
    background-attachment: fixed;
    background-size: cover;
    background-position: left top;
    background-repeat: no-repeat;
    padding-top: 54px;
    padding-left: 69px;
    padding-right: 88px;
    .newsletter-box {
      display: flex;
      align-items: flex-end;
      justify-content: flex-end;
      flex-direction: column;
      height: 100%;
    }
    &.sass {
      background: url(${SassFooterBgImg});
      background-attachment: fixed;
      background-size: cover;
      background-position: left top;
      background-repeat: no-repeat;
      padding: 54px 70px;
    }
  }
  .newsletter-get-demo-left {
    padding-bottom: 63px;

    h2 {
      margin-bottom: 33px;
      color: ${({ theme }) => theme.colors.whiteColor};
    }

    a {
      font-weight: 700;
      color: ${({ theme }) => theme.colors.whiteColor};
      transition: 0.3s;
      svg {
        margin-left: 10px;
        font-size: 24px;
        transition: 0.3s;
      }
      &:hover {
        svg {
          transform: rotate(-45deg);
        }
      }
    }
  }

  .sass-demo-shapes {
    position: relative;
    height: 100%;
    width: 100%;
    .shape1 {
      position: absolute;
      right: 132px;
      rop: 0px;
    }
    .shape2 {
      position: absolute;
      top: 32px;
      right: 0px;
    }
    .shape3 {
      position: absolute;
      bottom: 0px;
      right: 0px;
    }
    .shape4 {
      position: absolute;
      top: 0px;
      right: -100px;
    }
  }

  &.crypto-wallet-footer {
    padding-top: 135px;
    background: transparent !important;
  }

  .footer-menu-list {
    &.sass {
      h5 {
        color: ${({ theme }) => theme.colors.title};
      }
      ul {
        li {
          a {
            color: ${({ theme }) => theme.colors.textColor};
          }
        }
      }
    }
  }

  .start-free-form {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    background: ${({ theme }) => theme.colors.whiteColor};
    border-radius: 35px;
    padding: 10px;
    max-width: 470px;
    width: 100%;
    max-height: 70px;
    .form-input {
      color: ${({ theme }) => theme.colors.title};
      background: transparent;
      border: none;
      outline: none;
      padding: 14px;
      font-weight: 500;
      font-size: 16px;
      line-height: 26px;
    }
    .bg-blue-btn {
      padding: 12px 40px;
      border: none;
      outline: none;
      &:hover {
        opacity: 0.8;
      }
    }
  }

  @media screen and (max-width: 1600px) {
    &.v4,
    &.v4 {
      &::before {
        width: 34%;
      }
    }
  }
  @media screen and (max-width: 1399px) {
    &.v3,
    &.v4 {
      &::before {
        width: 32%;
      }
    }

    .token-footer-bottom-text .text {
      font-size: 97px;
    }
  }
  @media screen and (max-width: 1199px) {
    &.v6 {
      .footer-top {
        padding-top: 80px;
      }
    }

    &.v2 {
      .footer-widget {
        margin-top: 40px;
      }
    }

    &.v3 {
      &::before {
        display: none;
      }

      .footer-widget {
        margin-top: 40px;
      }
    }

    &.v4 {
      &::before {
        display: none;
      }

      .footer-copyright {
        margin-top: 20px;
      }
    }

    .footer-card {
      margin-bottom: 40px;
    }
    .footer-follow {
      .social-link {
        gap: 15px;
      }
    }
    .token-footer-bottom-text {
      padding: 0px;
      .text {
        font-size: 80px;
      }
    }
    .chatbot-footer-card {
      padding: 40px 30px;
    }
    .subscribe-form .bg-blue-btn {
      padding: 7px 25px;
    }
    .chatbot-footer-right {
      padding-left: 15px;
      margin-right: -5px;
      .col-md-4.col-sm-6 {
        padding-right: 0px !important;
      }
    }
    .footer-menu-list h5 {
      margin-bottom: 20px;
      font-size: 15px;
    }
    .chatbot-newslater h2 {
      font-size: 36px;
    }
  }

  @media screen and (max-width: 991px) {
    &.home-footer{
      .footer-card{
        max-width: 100%;
      }
    }
    .chatbot-footer-card.newsletter {
      .chatbot-footer-left {
        margin-left: 0;
        margin-bottom: 30px;
      }
    }
    .chatbot-footer-card.sass {
      padding-bottom: 30px;
    }
    .chatbot-footer-card.crypto-wallet {
      padding-bottom: 40px;
      .chatbot-footer-right {
        border-right: none;
        margin-top: 50px;
      }
      .chatbot-footer-left {
        margin-left: 0px;
      }
    }
    .token-footer-menu-section {
      .footer-column {
        padding-left: 0px;
      }
    }
    &.chatbot-footer-section {
      &.newsletter-footer {
        padding-top: 80px;
      }
    }
    .token-footer-bottom-text {
      .text {
        font-size: 60px;
      }
    }
    &.defi-footer-section .left {
      max-width: 200px;
    }
    &.defi-footer-section .right {
      padding-left: 0px;
    }
    &.defi-footer-section ul {
      gap: 20px;
    }
    &.defi-footer-section .footer-row {
      &::before {
        width: 30.5%;
      }
      &::after {
        width: 69.5%;
      }
    }
    .chatbot-footer-card.newsletter .chatbot-footer-right {
      border-right: none !important;
    }
    .chatbot-footer-right {
      border-left: none !important;
      margin-top: 40px;
    }
    &.footer6-section {
      margin-top: 100px;
    }

    .v7footer-contact-card{
      flex-wrap: wrap;
    }
    .v7footer-card-text{
      &.text-center{
        text-align: right !important;
      }
      &.text-right{
        text-align: center !important;
        margin: auto;
      }
    }

    .v7-main-footer{
      flex-wrap: wrap-reverse;
      .back-to-top-btn{
        display: none;
      }
      .privacy-menu{
        width: 100%;
        justify-content: center;
      }
      .copyright-text{
        width: 100%;
        text-align: center;
      }
    }
  }
  @media screen and (max-width: 767px) {
    &.home-footer{
      .footer-inner{
        border-radius: 30px 30px 0px 0px;
      }
      .footer-widget{
        margin-top: 0px !important;
        .widget-title{
          margin-bottom: 20px;
          h6{
            font-size: 15px;
          }
        }
      }
    }
    &.corporate-footer-section{
      padding-top: 80px !important;
    }
    .footer-top6{
        padding-bottom: 60px;
      }
    .footer-one-top{
      padding-bottom: 0 !important;
    }
    .footer-one-menu-list {
      ul{
        li{
          ol{
            margin-top: 5px;
            margin-bottom: 26px;
            &::after{
              top: 8px;
              height: 90%;
            }
            &.label-none{
              margin-bottom: 20px !important;
            }
          }
        }
      }
    }
    .footer1menu-list-col{
      &.one{
        ol{
          margin-bottom: 15px;
        }
      }
      &.three{
        display: flex;
        align-items: flex-start;
        justify-content: flex-start;
        width: 100%;
        padding-top: 10px;
        .footer-widget{
          width: 50%;
          &:nth-last-child(1){
            padding-left: 15px;
          }
        }
      }
    }
    .footer-follow{
      justify-content: center;

    }
    &.v2,
    &.v3 {
      .footer-copyright {
        margin-top: 20px;
        text-align: center;
      }
    }

    &.v4 {
      .privacy-menu {
        margin-bottom: 0;
        margin-top: 20px;
        justify-content: flex-start;
      }

      .footer-copyright {
        text-align: left;
      }
    }

    .footer-top {
      padding: 80px 0px 65px;
    }
    .footer-info {
      margin-bottom: 18px;
      .footer-logo {
        margin-bottom: 24px;
      }
    }
    .footer-card {
      margin-bottom: 0px;
    }
    .footer-widget .widget-list li a {
      line-height: 36px;
    }
    .footer-bottom {
      padding: 25px 0px 20px;
    }
    .counter-section {
      padding-top: 25px;
    }
    .chatbot-footer-left {
      h4 {
        margin: auto;
        margin-bottom: 20px;
      }
      p {
        margin-bottom: 20px;
      }
      margin: auto !important;
      text-align: center;
    }

    .token-footer-menu-section {
      .footer-column {
        &.footer-column2 {
          border-right: none;
        }
      }
    }

    .token-footer-bottom-text .text {
      font-size: 44px;
      line-height: 200%;
    }
    .chatbot-footer-card.newsletter {
      padding-bottom: 40px;
      .chatbot-footer-right {
        margin-top: 30px;
      }
    }
    /*-- footer-widget style --*/
    .footer-widget {
      margin-top: 40px;
    }

    /*-- footer-copyright style --*/
    .footer-copyright {
      text-align: center;
    }

    /*-- privacy-menu style --*/
    .privacy-menu {
      margin-bottom: 10px;
      justify-content: center;
      gap: 16px;
      flex-wrap: wrap;
    }
    .privacy-menu li,
    .privacy-menu li a {
      line-height: 1;
    }

    .footer-rating {
      justify-content: center;
    }
    &.footer-section.v4 {
      .privacy-menu {
        justify-content: center;
      }
      .footer-copyright {
        text-align: center;
      }
    }

    .footer-widget .widget-list li:not(:first-child) {
      margin-top: 0px;
    }
    &.footer-section.v3 .footer-widget {
      margin-top: 30px;
    }
    .footer-widget .widget-title {
      margin-bottom: 15px;
    }

    &.footer-section.v3 .footer-bottom {
      text-align: center;
    }
    &.footer-section.v2 .social-link,
    &.footer-section.v3 .social-link {
      justify-content: center;
    }
    &.footer-section.v3 .footer-copyright {
      text-align: center;
    }

    .token-subscribe-section {
      flex-wrap: wrap;
    }
    .token-footer-bottom-text {
      .text {
        font-size: 44px;
      }
    }
    .footer-column {
      &.footer-column3,
      &.footer-column4 {
        padding-top: 0px;
      }
    }
    &.defi-footer-section {
      ul {
        flex-wrap: wrap;
        justify-content: flex-start;
        row-gap: 7px;
      }
      .footer-row-inner {
        flex-direction: column;
        justify-content: flex-start;
      }
      .left {
        text-align: left;
        padding-right: 0px;
        max-width: 100%;
      }
      .right {
        margin-right: auto;
        margin-left: 0;
      }
      h5 {
        margin-bottom: 16px;
      }
      .footer-row {
        height: auto;
      }
      .footer-row::before {
        width: 40%;
        background: ${({ theme }) => theme.colors.whiteColor}0d;
      }
      .footer-row::after {
        width: 60%;
      }
    }
    .chatbot-newslater-left,
    .jwcziW .chatbot-newslater-right {
      justify-content: center;
      text-align: center;
    }
    .chatbot-newslater-btn {
      margin: auto;
    }
    &.chatbot-footer-section {
      padding-top: 70px;
    }
    .chatbot-newslater {
      margin-bottom: 70px;
    }
    &.footer6-section {
      margin-top: 90px;
    }

    .footer-menu-list{
      padding-top: 25px;
    }
  }

  @media screen and (max-width: 575px) {
    &.v2,
    &.v3 {
      .social-link {
        margin-top: 20px;
      }
    }

    &.footer6-section {
      margin-top: 70px;
    }
    .footer-contact-section {
      .footer-contact {
        margin-left: 0px;
      }
      .footer-contact-text {
        min-width: max-content;
        p {
          padding-left: 30px;
          margin-bottom: 5px;
        }
        h5 {
          padding-left: 30px;
        }
      }
    }

    .chatbot-footer-right {
      margin-top: 30px;
    }
    .chatbot-footer-card.crypto-wallet {
      padding-bottom: 3px;
      .chatbot-footer-right {
        margin-top: 30px;
      }
    }
    .footer-info {
      margin-bottom: 40px;

      .footer-logo {
        margin-bottom: 30px;
      }
    }

    &.footer6-section .social-link.social-link-right {
      justify-content: center;
      margin-top: 20px;
    }
    &.footer-section .staco-footer-6 .footer-copyright {
      margin-top: 15px;
    }
    .meeting-anytime-card-text h2 {
      font-size: 30px;
      line-height: 44px;
    }

    &.footer-section .staco-footer-6 .footer-logo {
      display: block;
      text-align: center;
    }

    &.footer-section .staco-footer-6 .social-link {
      justify-content: center;
    }

    .token-footer-bottom-text {
      .text {
        font-size: 30px;
      }
    }

    .newsletter-get-demo-section-inner{
      padding-left: 30px;
      padding-right: 30px;
    }

    .footer-v7-text {
      margin-bottom: 30px;
      .start-free-form {
        .bg-blue-btn{
          padding: 12px 24px;
        }
      }
      h2{
        margin-bottom: 25px;
        font-size: 36px;
      }
    }

    .v7footer-contact-card{
      flex-direction: column;
      padding: 45px 20px;
      .v7footer-card-text{
        p{
          margin-bottom: 0px;
        }
        &.text-center,
        &.text-right,
        &.text-left{
          text-align: center !important;
          margin: auto;
        }
      }
    }
    
  }

  @media screen and (max-width: 430px) {
    .subscribe-form {
      flex-wrap: wrap;
      max-height: inherit;
      height: auto;
      background: transparent;
      .form-input {
        width: 100%;
        padding: 12px 25px;
        background: ${({ theme }) => theme.colors.whiteColor}1a;
        border-radius: 35px;
      }
      .bg-blue-btn {
        position: relative;
        width: 100%;
      }
    }
  }
`;

export default FooterStyleWrapper;
