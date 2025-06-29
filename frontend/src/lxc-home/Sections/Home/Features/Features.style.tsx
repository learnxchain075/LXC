import styled from "styled-components";

const FeaturesStyleWrapper = styled.section`
  padding: 118px 0 40px 0;
  
  .feature-card {
    margin-bottom: 30px;
    padding: 30px;
    text-align: center;
    transition: 0.3s;
    border-radius: 30px;
    position: relative;
    z-index: 0;

    .feature-card-shape {
      position: absolute;
      z-index: -1;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
      transition: 0.3s;
      img {
        width: 100%;
        height: 100%;
      }
    }

    &-icon {
      margin-bottom: 30px;
      img {
        width: 40px;
        height: 40px;
      }
    }
    h5 {
      margin-bottom: 10px;
      font-weight: 600;
    }
  }
  .LearnXChain-hover-effect:hover .feature-card:hover .feature-card-shape,
  .LearnXChain-hover-effect:not(:hover) .feature-card.active .feature-card-shape {
    opacity: 1;
  }

  @media screen and (max-width: 1200px) {
    .feature-card {
      padding: 30px 20px 20px 20px;
    }
    .feature-card-icon {
      margin-bottom: 10px;
    }
    .feature-card-text {
      h5 {
        font-size: 18px;
      }
      p {
        font-size: 13px;
        line-height: 24px;
      }
    }
  }
  @media screen and (max-width: 991px) {
    .feature-card {
      margin-bottom: 0px;
    }
    .feature-card-text {
      max-width: 100%;
      margin: 0 auto;
      p {
        max-width: 288px;
        margin: auto;
        line-height: 26px;
      }
    }
  }
  @media screen and (max-width: 767px) {
    padding: 40px 0px 0px 0px;
    .feature-card {
      h2 {
        margin-bottom: 5px;
      }

      p {
        font-size: 15px;
        line-height: 24px;
      }

      &-icon {
        margin-bottom: 16px;
      }
    }
  }
  @media screen and (max-width: 575px) {
    padding: 60px 0 20px 0;
  }
  @media screen and (max-width: 480px) {
    .feature-card-icon {
      margin-bottom: 15px;

      img {
        width: 30px;
        height: 30px;
      }
    }
    .feature-card-text {
      h2 {
        margin-bottom: 5px;
        font-size: 16px;
        line-height: 26px;
      }
    }
  }
  @media screen and (max-width: 374px) {
    .feature-card-text {
      max-width: 100%;
    }
  }
`;

export default FeaturesStyleWrapper;
