import styled from "styled-components";
import BgImg from "../../../assets/images/main-demo/dotted-bg.png";

interface Theme {
  colors: {
    bgHero: string;
    whiteColor: string;
  };
}

const UsabilitySliderStyleWrapper = styled.section`
  padding: 70px 0 408px 0;
  background-image: url(${BgImg});
  background-repeat: no-repeat;
  background-position: bottom;
  background-size: 100%;

  /*-- usability-card style --*/
  .usability-card {
    width: 100%;
    height: 600px;
    border-radius: 50px;
    background-color: ${({ theme }: { theme: Theme }) => theme.colors.bgHero};
    padding: 84px;
    text-align: center;
    position: relative;
    z-index: 0;

    .shape-img {
      position: absolute;
      z-index: -1;

      &.img-1 {
        top: 0;
        left: 57px;
        width: 18%;
      }
      &.img-2 {
        bottom: 96px;
        right: 0;
        width: 17%;
      }
    }

    .section-title {
      h2 {
        color: ${({ theme }: { theme: Theme }) => theme.colors.whiteColor};
        max-width: 450px;
        margin: auto;
        margin-bottom: 40px;
      }
    }

    .usability-buttons {
      margin-bottom: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 20px;
      button {
        width: 180px;
        height: 50px;
        border-radius: 10px;
        background-color: ${({ theme }: { theme: Theme }) => theme.colors.whiteColor}14;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 15px;
        color: ${({ theme }: { theme: Theme }) => theme.colors.whiteColor};
        transition: 0.3s;
        &:hover {
          background-color: ${({ theme }: { theme: Theme }) => theme.colors.whiteColor}26;
        }
      }
    }

    .usability-content {
      .content-item {
        display: none;
        &.show {
          display: block;
        }
      }
    }
  }

  .usability-slider-nav {
    .slick-list {
      padding: 0 !important;
    }

    .slick-track {
      width: 100% !important;
      transform: translate3d(0px, 0px, 0px) !important;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 20px;
      flex-wrap: wrap;

      .slick-slide {
        cursor: pointer;
        position: relative;
        overflow: hidden;
        width: 180px !important;
        height: 50px !important;
        border-radius: 10px;
        background-color: ${({ theme }: { theme: Theme }) => theme.colors.whiteColor}14;

        &::before {
          position: absolute;
          z-index: -1;
          content: "";
          top: 0;
          left: 0;
          width: 0%;
          height: 100%;
          background-color: ${({ theme }: { theme: Theme }) => theme.colors.whiteColor}26;
          opacity: 0;
          transition: 0.3s;
        }

        &.slick-current {
          &::before {
            opacity: 1;
            animation: tabAnimate 6s linear;
          }
        }
      }
    }

    .slider-item {
      width: 180px;
      height: 50px;
      border-radius: 10px;
    
      display: flex !important;
      align-items: center;
      justify-content: center;
      gap: 15px;
      font-weight: 700;
      line-height: 30px;
      color: ${({ theme }: { theme: Theme }) => theme.colors.whiteColor};
      transition: 0.3s;

      img {
        width: 20px;
        height: 20px;
      }
    }
  }

  @keyframes tabAnimate {
    0% {
      width: 0%;
    }
    100% {
      width: 100%;
    }
  }

  .usability-slider-for {
    margin-top: 50px;

    .slider-item {
      display: flex !important;
      align-items: center;
      justify-content: center;
    }
  }

  @media screen and (max-width: 991px) {
    padding: 0px 0 70px 0;
    .usability-card {
      height: 600px;
      padding: 84px 50px 20px 50px;

      &-title {
        margin-bottom: 44px;

        h2 {
          font-size: 40px;
          font-weight: 700;
          line-height: 60px;
        }
      }

      .usability-buttons {
        margin-bottom: 50px;
        gap: 20px;
        button {
          width: 180px;
          height: 50px;
          gap: 10px;
        }
      }
    }
    .usability-slider-nav {
      .slick-track {
        .slick-slide {
          width: 175px !important;
        }
      }

      .slider-item {
        width: 175px !important;
        gap: 10px;
      }
    }
    .usability-slider-for {
      margin-top: 40px;
    }
  }
  @media screen and (max-width: 767px) {
    padding: 40px 0px 80px;
    background-image: none;
    .usability-card {
      border-radius: 30px;
      height: auto;
      padding: 60px 25px 25px 25px;

      .section-title {
        margin-bottom: 44px;
        h2 {
          font-size: 40px;
        }
      }

      .usability-buttons {
        margin-bottom: 50px;
        gap: 20px;
        flex-wrap: wrap;

        button {
          width: 180px;
          height: 50px;
          gap: 10px;
        }
      }
    }
    .usability-slider-nav {
      max-width: 300px;
      margin: auto;
      .slick-track {
        gap: 10px;
        flex-direction: column;
        .slick-slide {
          width: 100% !important;
        }
      }

      .slider-item {
        width: 100% !important;
        gap: 10px;
        line-height: 22px;
        img {
          width: 15px;
          height: 15px;
        }
      }
    }
  }
  @media screen and (max-width: 575px) {
    .usability-card {
      padding: 61px 30px 20px 30px;

      .section-title {
        margin-bottom: 20px;

        h2 {
          font-size: 36px;
          line-height: 150%;
          max-width: 308px;
          margin: auto;
        }
      }

      .usability-buttons {
        margin-bottom: 50px;
        gap: 10px;
      }
    }
  }
  @media screen and (max-width: 480px) {
    .usability-card {
      height: auto;
      padding: 61px 13px 20px 13px;
      .shape-img {
        &.img-1 {
          width: 33%;
        }
        &.img-2 {
          width: 33%;
        }
      }
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
    .usability-slider-nav {
      .slick-track {
        gap: 5px;
      }
    }
  }
`;

export default UsabilitySliderStyleWrapper;