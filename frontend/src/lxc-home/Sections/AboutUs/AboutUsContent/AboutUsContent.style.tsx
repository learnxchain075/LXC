import styled from "styled-components";

const AboutUsContentStyle = styled.section`
  padding: 0;
  .about-feature-title {
    margin-bottom: 50px;
    h3 {
      margin-bottom: 17px;
      font-weight: 700;
      font-size: 18px;
      line-height: 30px;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: ${({ theme }) => theme.colors.primary};
    }
  }

  .about-feature-tab {
    .react-tabs__tab-list {
      margin: 0 0 45px;
      border-bottom: 0;
      display: flex;
      align-items: center;
      gap: 20px;
      flex-wrap: wrap;
    }

    .react-tabs__tab {
      padding: 10px 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 5px;
      border: 1px solid ${({ theme }) => theme.colors.blackColor}26;
      border-radius: 26px;
      font-weight: 700;
      color: ${({ theme }) => theme.colors.blackColor};
      transition: 0.3s;

      &--selected {
        border: 1px solid #e7f1fc;
        background-color: #e7f1fc;
        color: ${({ theme }) => theme.colors.primary};
      }
    }

    .about-feature-tab-content {
      h4 {
        margin-bottom: 20px;
        color: ${({ theme }) => theme.colors.title};
      }
      p {
        color: ${({ theme }) => theme.colors.textColor};
        margin-bottom: 0px;
      }

      .list {
        padding: 0;
        list-style: none;
        margin-top: 40px;
        display: flex;
        align-items: center;
        gap: 75px;
        .list-item {
          display: flex;
          align-items: center;
          gap: 14px;
          img {
            width: 50px;
            height: 50px;
            padding: 15px;
            border: 1px solid ${({ theme }) => theme.colors.primary}4d;
            border-radius: 10px;
          }
          p {
            margin-bottom: 0;
            color: ${({ theme }) => theme.colors.blackColor};
          }
        }
      }
    }
  }

  .about-feature-img {
    position: relative;
    .overlay-item {
      position: absolute;

      &.reduction-time {
        top: 10px;
        left: 0;
      }

      &.success-rate {
        bottom: 30px;
        right: 30px;
      }

      &.wave-shape {
        top: 50%;
        left: -50px;
        transform: translateY(-50%);
      }
    }

    .reduction-time {
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
      h3 {
        margin-bottom: 10px;
        line-height: 20px;
      }
      p {
        font-size: 13px;
        font-weight: 500;
        line-height: 20px;
      }
    }

    .success-rate {
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
    }

    .pie_progress__label {
      margin-top: 0px;
    }

    .pie_progress__label h3 {
      margin-bottom: 0;
      line-height: 1.1;
      color: ${({ theme }) => theme.colors.blackColor};
    }

    .pie_progress__label p {
      margin: 0;
      font-size: 13px;
      font-weight: 500;
      line-height: 20px;
    }
  }
  /*-- about-feature-section end --*/

  @media screen and (max-width: 1199px) {
    .about-feature-tab .tab-body-list {
      gap: 25px;
    }
  }
  @media screen and (max-width: 991px) {
    .about-feature-img {
      margin-top: 40px;
      width: -moz-fit-content;
      width: fit-content;
    }
    .about-feature-img .success-rate {
      max-width: 130px;
      max-height: 130px;
    }
    .about-feature-img .pie_progress {
      width: 110px;
      height: 110px;
    }
  }
  @media screen and (min-width: 768px) and (max-width: 991px) {
    .benefits-img-bg .about-feature-img .overlay-item.success-rate {
      bottom: 10px;
      right: 0px;
    }
  }
  @media screen and (max-width: 767px) {
    .lets-talk-text h2,
    .section-title .title,
    .team-section .section-title h2,
    .about-feature-title h2 {
      font-size: 36px;
      line-height: 45px;
    }
  }
  @media screen and (max-width: 575px) {
    .about-feature-title {
      margin-bottom: 40px;
    }
    .about-feature-title h3 {
      margin-bottom: 10px;
      font-size: 16px;
      line-height: 30px;
    }
    .about-feature-title h2 {
      font-size: 30px;
      line-height: 50px;
    }
  }
  @media screen and (max-width: 480px) {
    .about-feature-title h2 {
      font-size: 24px;
      line-height: 40px;
    }
    .about-feature-tab .nav.nav-tabs {
      gap: 12px;
    }
    .about-feature-tab .nav.nav-tabs .nav-link {
      padding: 10px 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 5px;
    }
    .about-feature-tab .nav.nav-tabs .nav-link .text {
      display: none;
    }
    .about-feature-tab .tab-content {
      margin-top: 40px;
    }
    .about-feature-tab .about-feature-tab-content .list {
      margin-top: 30px;
      gap: 20px;
      flex-direction: column;
      align-items: flex-start;
    }
    .benefits-img-bg .about-feature-img .overlay-item.success-rate {
      bottom: 10px;
      right: 0px;
    }
  }
  @media screen and (max-width: 374px) {
    .contact-content h2,
    .core-feature-title h2,
    .skills-content h2,
    .building-content h2,
    .lets-talk-text h2,
    .section-title .title,
    .team-section .section-title h2,
    .about-feature-title h2,
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
`;

export default AboutUsContentStyle;
