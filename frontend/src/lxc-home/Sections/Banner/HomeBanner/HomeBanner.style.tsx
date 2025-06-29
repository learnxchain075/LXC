import styled from "styled-components";

import BgImg from "../../../assets/images/bg/wave-line.png";
import CurveLineImg from "../../../assets/images/shape/curve-line.png";
import HoggleImg from "../../../assets/images/icons/hoogle-icon.svg";

const HomeBannerStyle = styled.section`
  padding: 235px 0px 165px 0px;
  background-color: ${({ theme }) => theme.colors.bgHero};
  background-image: url(${BgImg});
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  position: relative;
  z-index: 0;
  overflow: hidden;
  border-radius: 0px 0px 50px 50px;
  
  .shape-img {
    position: absolute;
    z-index: -1;
    &.img-1 {
      top: 25%;
      left: 0;
    }
    &.img-2 {
      bottom: 0;
      left: 40%;
    }
    &.img-3 {
      bottom: 0;
      right: 12%;
    }
  }

  /*-- hero-content style --*/
  .hero-content-text {
    margin-bottom: 48px;
    .uig-banner-title {
      line-height: 1.35;
    }
    p {
      margin-top: 18px;
      font-size: 18px;
      line-height: 36px;
      color: ${({ theme }) => theme.colors.whiteColor};
    }
  }
  .hero-content-list {
    display: flex;
    align-items: center;
    gap: 20px;
    flex-wrap: wrap;
    margin: 0;
    padding: 0;
    list-style: none;
    .list-item {
      display: flex;
      align-items: center;
      gap: 10px;
      svg {
        font-size: 18px;
        color: ${({ theme }) => theme.colors.whiteColor};
        position: relative;
        top: -6px;
      }
      p {
        font-size: 14px;
        color: ${({ theme }) => theme.colors.whiteColor};
      }
    }
  }

  /*-- hero-img style --*/
  .hero-img {
    text-align: right;
    position: relative;

    &::before {
      position: absolute;
      content: url(${CurveLineImg});
      bottom: 50px;
      left: 60px;

    }

    img {
      width: 400px;
      height: 500px;
      border-radius: 200px;
    }

    .overlay {
      position: absolute;
      top: -25px;
      left: 50px;
      img {
        width: 150px;
        height: 150px;
        border-radius: 50%;
      }
    }
  }

  .get-demo-btn {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    background-color: ${({ theme }) => theme.colors.badgeColor2};
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    > img {
      width: 120px !important;
      height: 120px !important;
      animation: rotateImg 15s infinite linear;
    }
    .icon {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      img {
        transition: 0.3s;
      }
    }
    &:hover {
      .icon img {
        transform: rotate(45deg);
      }
    }
  }

  @keyframes rotateImg {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  /*-- Hero-Section2 --*/
  .hero-section2 {
    min-height: 681px;
    padding-top: 245px;
  }
  .new-hoogle {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 9px;
    margin-bottom: 27px;
    span {
      font-family: ${({ theme }) => theme.fonts.PlusJakartaSans};
      font-weight: 700;
      line-height: 14px;
      background: ${({ theme }) => theme.colors.badgeColor};
      border-radius: 15px;
      color: ${({ theme }) => theme.colors.whiteColor};
      padding: 8px 12px;
    }
    p {
      font-family: ${({ theme }) => theme.fonts.dmSans};
      font-size: 18px;
      font-weight: 500;
      line-height: 36px;
      color: ${({ theme }) => theme.colors.title};
      margin-top: 0px;
      position: relative;

      &:after {
        content: url(${HoggleImg});
        position: absolute;
        right: -20px;
        top: -14px;
        animation: badgeAnimate 2s infinite linear;
      }
    }
  }
  .hero-content2-text {
    .banner-title {
      margin-bottom: 16px;
      line-height: 1.3;
      & .hero-badge {
        background: ${({ theme }) => theme.colors.badgeColor2};
        border-radius: 0px 20px 0px 0px;
        margin-left: 7px;
      }
    }
    & ul {
      padding: 0;
      list-style: none;
      margin-bottom: 49px;
      & li {
        font-weight: 900;
        line-height: 36px;
        color: ${({ theme }) => theme.colors.title};
        svg {
          font-size: 18px;
          margin-right: 10px;
        }
      }
    }
  }
  .hero2-img {
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
    position: relative;
    .hero2-image1 {
      position: absolute;
      left: 20px;
      top: -56px;
      background: ${({ theme }) => theme.colors.heroimg1Bg};
      border-radius: 85px 85px 0px 85px;
      padding: 17px;
      overflow: hidden;
      img {
        height: 100%;
        width: 100%;
        border-radius: 50%;
      }
    }
    .hero2-image2 {
      position: absolute;
      left: 50px;
      top: 35%;
      background: ${({ theme }) => theme.colors.badgeColor};
      border-radius: 85px 85px 0px 85px;
      transform: rotate(-75deg);
      padding: 8px;
      overflow: hidden;
      img {
        height: 100%;
        width: 100%;
        border-radius: 50%;
        transform: rotate(75deg);
      }
    }
    .hero2-image3 {
      position: absolute;
      top: -50px;
      left: 60%;
      animation: jumpingDown 4.5s infinite;
    }
    .hero2-image4 {
      position: absolute;
      bottom: 100px;
      left: 100px;
      animation: jumpingUp 5s infinite;
    }
  }

  /*-- hero-section end --*/
  @media screen and (max-width: 1199px) {
    .hero-content-text {
      .uig-banner-title {
        font-size: 55px;
      }
    }
    .hero-content-text h2 {
      font-size: 55px;
      font-weight: 700;
      line-height: 80px;
    }
    .hero-img::before {
      left: 0;
    }
    .hero-img .overlay {
      left: 0px;
    }
  }
  @media screen and (max-width: 991px) {
    .hero-content {
      text-align: center;
    }
    .hero-content-text p {
      max-width: 500px;
      margin: auto;
      margin-top: 15px;
    }
    .hero-img {
      text-align: center;
      max-width: 350px;
      margin: auto;
      margin-top: 110px;
      img{
        height: auto;
        width: 100%;
      }
      .overlay {
        top: -13%;
        left: 27%;
      }
    }
    .hero-content-list {
      justify-content: center;
    }
  }
  @media screen and (max-width: 767px) {
    padding: 150px 0px 80px;
    border-radius: 0px 0px 30px 30px;
    .hero-badge{
      &::before{
        top: -32px;
      }
    }
    .shape-img {
      width: 18%;
      &.img-2 {
        bottom: 0;
        left: -15px;
        max-width: 190px;
      }

      &.img-3 {
        bottom: 0px;
        right: -30px;
        max-width: 200px;
      }
    }
  }
`;

export default HomeBannerStyle;
