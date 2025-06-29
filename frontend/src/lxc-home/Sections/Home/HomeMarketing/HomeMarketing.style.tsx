import styled from "styled-components";

const HomeMarketingStyleWrapper = styled.section`
  /*-- marketing-section start --*/
  .marketing-section {
    padding: 140px 0 0 0;
  }

  /*-- marketing-img style --*/
  .marketing-img {
    width: 100%;
    height: 420px;
    background-color: #f8f0e6;
    border-radius: 240px 240px 0px 0px;
    display: flex;
    align-items: flex-end;
    position: relative;

    > img {
      width: 400px;
      height: 380px;
      border-radius: 250px 250px 0px 0px;
    }

    &.v2 {
      background-color: #f6eafe;
      border-radius: 0px 0px 240px 240px;
      display: flex;
      align-items: flex-start;
      justify-content: flex-end;
      > img {
        border-radius: 0 0 250px 250px;
      }
    }
    .overlay {
      img {
        width: auto;
        height: auto;
      }

      &-item {
        position: absolute;
      }
    }

    .chart {
      bottom: 0;
      left: 0;
      width: 188px;
      height: 85px;
      border-radius: 0px 45px 0px 0px;
      background-color: ${({ theme }) => theme.colors.whiteColor};
      display: flex;
      align-items: flex-end;
      justify-content: flex-start;
    }

    .emoji-icons {
      bottom: 40px;
      right: 22px;
      width: 209px;
      height: 70px;
      box-shadow: 0px 30px 50px ${({ theme }) => theme.colors.blackColor}26;
      border-radius: 35px;
      background-color: ${({ theme }) => theme.colors.whiteColor};
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .star-1 {
      top: 74px;
      right: 93px;
    }
    .star-2 {
      top: 110px;
      right: 57px;
    }
    .star-3 {
      top: 135px;
      right: 119px;
    }

    .wave-shape {
      bottom: 121px;
      left: 45px;
    }

    .reduction-time {
      top: 30px;
      left: 0;
      width: 170px;
      height: 90px;
      border-radius: 0 45px 0 0;
      background-color: ${({ theme }) => theme.colors.whiteColor};
      padding: 24px 24px 24px 0;
      &-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      h2 {
        margin-bottom: 10px;
        font-size: 30px;
        line-height: 20px;
      }
      p {
        font-size: 13px;
        line-height: 20px;
        font-weight: 700;
      }
    }

    .success-rate {
      bottom: 71px;
      right: 60px;
      width: 170px;
      height: 170px;
      &-content {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }

    /* pie progress */
    .pie_progress {
      width: 130px;
      height: 130px;
      margin: auto 0;
      background-color: transparent;
      p{
        font-size: 13px;
        font-weight: 800;
      }
    }

    .pie_progress__label {
      margin-top: 0px;
    }

    .pie_progress__label h4 {
      font-size: 30px;
      color: ${({ theme }) => theme.colors.blackColor};
    }

    .pie_progress__label p {
      margin: 0;
      font-size: 13px;
      font-weight: 500;
      line-height: 20px;
    }
  }

  /*-- marketing-content style --*/
  .marketing-content {
    &-title {
      margin-bottom: 37px;
      h3 {
        text-transform: uppercase;
        font-size: 18px;
        line-height: 30px;
        color: ${({ theme }) => theme.colors.primary};
        letter-spacing: 0.2em;
        margin-bottom: 16px;
      }
    }
    &-body{
      padding-top: 4px;
    }
    .list {
      margin: 0;
      padding: 0;
      list-style: none;
      li {
        margin-top: 10px;
      }
      .list-item {
        display: flex;
        align-items: center;
        gap: 10px;
        p{
          margin-bottom: 0;
          font-size: 16px;
          font-weight: 500;
          color: ${({ theme }) => theme.colors.blackColor};
        }
        svg {
          font-size: 18px;
          color: ${({ theme }) => theme.colors.iconColor};
          position: relative;
          top: 0px;
        }
      }
    }
  }
  /*-- marketing-section end --*/

  @media screen and (max-width: 1850px) {
  }
  @media screen and (max-width: 1699px) {
  }
  @media screen and (max-width: 1600px) {
  }
  @media screen and (max-width: 1499px) {
  }
  @media screen and (max-width: 1399px) {
  }
  @media screen and (max-width: 1280px) {
  }
  @media screen and (max-width: 1199px) {
  }
  @media screen and (min-width: 991px) and (max-width: 1200px) {
  }
  @media screen and (max-width: 991px) {
    .marketing-section {
      padding-top: 70px;
    }
    .marketing-img {
      width: 480px;
      height: 420px;
      margin-bottom: 40px;
    }
  }
  @media screen and (min-width: 768px) and (max-width: 991px) {
  }
  @media screen and (max-width: 767px) {
    .marketing-section {
      padding-top: 0px !important;
    }
    .marketing-section2{
      padding-top: 70px !important;
    }
    .marketing-content-title {
      margin-bottom: 30px;
      h3 {
        font-size: 16px;
        line-height: 30px;
        margin-bottom: 11px;
      }
      h2 {
        font-size: 32px;
        line-height: 45px;
      }
    }

    .marketing-img {
      .emoji-icons {
        padding: 10px;
        height: 48px;
        width: 145px;
      }

      .chart {
        width: 131px;
        height: 60px;
        padding: 20px 20px 0px 0px;
      }
    }
    .marketing-img {
      height: auto;

      > img {
        width: 85%;
        height: auto;
      }
    }

    .marketing-img .pie_progress__label {
      h4 {
        font-size: 20px;
        line-height: 15px;
      }

      p {
        font-size: 10px;
        line-height: 15px;
      }
    }

    .marketing-img .reduction-time {
      height: 62px;
      width: 118px;
      padding: 17px 27px 6px 0px;
      h2 {
        font-size: 20px;
        line-height: 15px;
      }
      p {
        font-size: 10px;
        line-height: 15px;
      }
    }

    .marketing-img .success-rate {
      height: 118px;
      width: 118px;
      bottom: 30px;
      right: 49px;
    }
    .marketing-img {
      .pie_progress__svg svg {
        top: 25px;
        left: 26px;
        width: 60%;
        height: 60%;
        margin: auto;
      }
    }
    .marketing-section {
      padding-top: 80px;
    }
    .marketing-img.v2 {
      width: 100%;
      margin-bottom: 42px;
    }
    /*-- marketing end --*/
  }
  @media screen and (max-width: 575px) {
    .marketing-img {
      width: 100%;
    }
  }
  @media screen and (max-width: 480px) {
    .marketing-img {
      height: auto;

      > img {
        width: 85%;
        height: auto;
      }
    }
  }
  @media screen and (max-width: 425px) {
  }
  @media screen and (max-width: 374px) {
    .contact-content h2,
    .core-feature-title h2,
    .skills-content h2,
    .building-content h2,
    .lets-talk-text h2,
    .section-title .title,
    .team-section .section-title h2,
    .about-feature-section .about-feature-title h2,
    .customer-content-text h2,
    .feature-team-slider-for .slider-item h2,
    .how-works-title h2,
    .usability-card-title h2,
    .faq-section-title h2,
    .pricing-section-title h2,
    .testimonial-title h2,
    .marketing-content-title h2,
    .section-title h2 {
      font-size: 32px !important;
      line-height: 42px;
    }
  }
  @media screen and (min-width: 768px) {
    .marketing-img .success-rate {
      bottom: 71px;
      right: 30px;
    }
    .marketing-img .wave-shape {
      bottom: 121px;
      left: 0px;
    }
  }
`;

export default HomeMarketingStyleWrapper;
