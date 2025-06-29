import styled from "styled-components";

const HomePricingStyleWrapper = styled.section`
  padding: 132px 0 90px 0;
  background-color: ${({ theme }) => theme.colors.bgFooter};
  position: relative;
  z-index: 0;
  border-radius: 50px 50px 0px 0px;
  /* &::before {
    position: absolute;
    z-index: -1;
    content: "";
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: ${({ theme }) => theme.colors.whiteColor}05;
  } */

  .shape-img {
    position: absolute;
    z-index: -1;
    &.img-1 {
      bottom: 0;
      right: 10%;
    }
    &.img-2 {
      bottom: 0;
      left: 10%;
    }
    &.img-3 {
      top: 0;
      left: 0;
    }
    &.img-4 {
      top: 25%;
      left: 8%;
    }
    &.img-5 {
      bottom: 20%;
      right: 5%;
    }
  }

  .pricing-section-title {
    margin-bottom: 40px;
    h3 {
      margin-bottom: 19px;
      text-transform: uppercase;
      font-size: 18px;
      font-weight: 800;
      line-height: 30px;
      color: ${({ theme }) => theme.colors.primary};
      letter-spacing: 0.2em;
    }
    h2 {
      text-transform: capitalize;
      color: ${({ theme }) => theme.colors.whiteColor};
    }
  }

  /*-- pricing-selector style --*/
  .pricing-selector {
    margin-bottom: 40px;
    width: 100%;
    height: calc(100% - 40px);
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
    form {
      display: flex;
      align-items: center;
      gap: 20px;
      button {
        font-size: 15px;
        font-weight: 500;
        line-height: 20px;
        color: ${({ theme }) => theme.colors.whiteColor};
        span {
          color: ${({ theme }) => theme.colors.heroimg1Bg};
        }
      }
      input[type="checkbox"] {
        appearance: none;
        width: 50px;
        height: 24px;
        border-radius: 15px;
        background-color: ${({ theme }) => theme.colors.whiteColor};
        position: relative;
        cursor: pointer;
        transition: 0.3s;
        &::before {
          position: absolute;
          content: "";
          top: 5px;
          left: 5px;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background-color: ${({ theme }) => theme.colors.primary};
          transition: 0.3s;
        }
        &:checked {
          background-color: ${({ theme }) => theme.colors.primary};
          &::before {
            left: 30px;
            background-color: ${({ theme }) => theme.colors.whiteColor};
          }
        }
      }
    }
  }

  .pricing-card-list {
    margin: 0;
    padding: 0;
    list-style: none;
  }
  /*-- pricing-card style --*/
  .card-tag{
      width: 100%;
      height: 90px;
      border-radius: 30px 30px 0px 0px;
      background: ${({ theme }) => theme.colors.heroimg1Bg};
      color: ${({ theme }) => theme.colors.whiteColor};
      font-family: ${({ theme }) => theme.fonts.PlusJakartaSans};
      font-size: 14px;
      font-weight: 700;
      line-height: 214.286%;
      text-transform: uppercase;
      padding: 2px 40px;
      &.none{
        opacity: 0;
        visibility: hidden;
      }
    }
  .pricing-card {
    margin-bottom: 40px;
    border-radius: 30px;
    background-color: ${({ theme }) => theme.colors.whiteColor};
    padding: 40px;
    transition: 0.3s;
    position: relative;
    margin-top: -60px;
    .pricing-card-bottom{
      display: flex;
      align-items: center;
      justify-content: flex-start;
      a{
        color: ${({ theme }) => theme.colors.whiteColor};
        font-size: 16px;
        font-style: normal;
        font-weight: 700;
        line-height: 162.5%;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 25px;
        max-width: 0px;
        height: 50px;
        visibility: hidden;
        padding: 12px 15px;
        transition: 0.3s;
        overflow: hidden;
        opacity: 0;
        span{
          min-width: max-content;
        }
      }
    }
    &:hover {
      .pricing-btn {
        background-color: ${({ theme }) => theme.colors.primary};
        color: ${({ theme }) => theme.colors.whiteColor};
        transform: translateX(0px);
        svg {
          transform: rotate(-45deg);
        }
      }
      .pricing-card-bottom{
        a{
          max-width: 150px;
          width: 100%;
          visibility: visible;
          background-color: ${({ theme }) => theme.colors.primary};
          opacity: 1;
        }
      }
    }

    h2 {
      font-size: 30px;
      color: ${({ theme }) => theme.colors.title};
    }

    h3 {
      font-size: 30px;
      span {
        font-family: ${({ theme }) => theme.fonts.dmSans} !important;
        font-size: 15px;
        font-weight: 500;
        line-height: 30px;
        color: ${({ theme }) => theme.colors.textColor};
      }
    }

    &-header {
      margin-bottom: 20px;
      p {
        margin-bottom: 28px;
      }
    }

    &-title {
      display: flex;
      align-items: center;
      gap: 10px;
      justify-content: space-between;
      margin-bottom: 12px;
    }

    &-list {
      margin-bottom: 27px;
      li {
        padding-left: 16px;
        position: relative;

        &:not(:first-child) {
          margin-top: 20px;
        }

        &::before {
          position: absolute;
          content: "";
          top: 50%;
          left: 0;
          transform: translateY(-50%);
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: rgba(0, 0, 0, 0.20);
        }
      }
    }

    .pricing-btn {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background-color: ${({ theme }) => theme.colors.primary}4d;
      color: ${({ theme }) => theme.colors.primary};
      display: flex;
      align-items: center;
      justify-content: center;
      transform: translateX(-30px);
      svg {
        font-size: 20px;
        transition: 0.5s;
      }
      &:hover {
        background-color: ${({ theme }) => theme.colors.primary};
        color: ${({ theme }) => theme.colors.whiteColor};
        svg {
          transform: rotate(-45deg);
        }
      }
    }
  }

  @media screen and (max-width: 767px) {
    padding-top: 72px;
    padding-bottom: 50px;
    border-radius: 30px 30px 0 0;
    .pricing-selector {
      display: flex;
      align-items: flex-start;
      justify-content: flex-start;
    }
    .pricing-section-title {
      margin-bottom: 20px;
      h3 {
        margin-bottom: 11px;
        font-size: 16px;
        line-height: 30px;
      }
      h2 {
        font-size: 32px;
        line-height: 45px;
      }
    }
    /* .shape-img {
      &.img-2 {
        bottom: 0;
        max-width: 309px;
        left: -35px;
      }

      &.img-1 {
        bottom: 0;
        right: 0px;
        max-width: 143px;
      }
    } */
    .pricing-card {
      padding: 36px 30px 40px 30px;
      h2 {
        font-size: 24px;
      }
    }
    .pricing-card {
      margin-bottom: 30px;
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
`;

export default HomePricingStyleWrapper;
