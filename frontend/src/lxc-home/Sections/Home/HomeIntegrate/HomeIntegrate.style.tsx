import styled from "styled-components";

const HomeIntegrateStyleWrapper = styled.section`
  .integrate-card {
    margin-bottom: 40px;
    width: 100%;
    height: 450px;
    border-radius: 30px;
    background-color: #eaf1ff;
    padding: 70px 48px;
    position: relative;
    overflow: hidden;
    z-index: 0;
    &-header {
      margin-bottom: 34px;
      h3{
        margin-bottom: 0;
        font-weight: 800;
      }
    }
    h2 {
      font-size: 30px;
      line-height: 45px;
    }
    p {
      margin-top: 25px;
    }

    &.v2 {
      background-color: #f8f0e6;
    }

    .shape-img {
      position: absolute;
      z-index: -1;
      //bottom: 0;
      &.img-1 {
        bottom: 0;
        left: 0;
      }
      &.img-2 {
        bottom: 61px;
        right: 68px;
      }
      &.img-3 {
        bottom: 139px;
        right: 148px;
      }
      &.img-4 {
        bottom: 95px;
        left: 58px;
      }
      &.img-5 {
        bottom: 0;
        left: 150px;
      }
    }
  }

  /*-- integrate-slider style --*/
  .integrate-slider {
    width: 100%;
    height: 92px;
    position: relative;
    overflow: hidden;
    padding-top: 10px;

    &-container {
      width: calc(120px * 8);
      display: flex;
      align-items: center;
      animation: smoothSlider2 15s linear infinite;
    }

    &::before {
      position: absolute;
      z-index: 1;
      content: "";
      top: 0;
      left: 0;
      width: 220px;
      height: 100%;
      background: linear-gradient(
        90deg,
        #eaf1ff 0%,
        rgba(234, 241, 255, 0) 100%
      );
    }
    &::after {
      position: absolute;
      z-index: 1;
      content: "";
      top: 0;
      right: 0;
      width: 220px;
      height: 100%;
      background: linear-gradient(
        90deg,
        rgba(234, 241, 255, 0) 0%,
        #eaf1ff 100%
      );
      transform: matrix(1, 0, 0, -1, 0, 0);
    }
    .slider-item {
      width: 120px;
      display: flex;
      align-items: center;
      justify-content: center;
      img {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        background-color: ${({ theme }) => theme.colors.whiteColor};
        padding: 22px;
      }
    }
  }
  @keyframes smoothSlider2 {
    0% {
      transform: translateX(0%);
    }
    100% {
      transform: translateX(calc(-120px * 4));
    }
  }

  @media screen and (max-width: 767px) {
    .integrate-card {
      margin-bottom: 30px;
      padding: 38px 20px;
    }
    .integrate-slider {
      &-container {
        gap: 30px;
      }

      &::before {
        width: 100px;
      }

      &::after {
        width: 100px;
      }
    }

    .integrate-card p {
      margin-top: 18px;
    }
  }
  @media screen and (max-width: 480px) {
    .integrate-card {
      padding: 30px;
      height: 420px;

      .shape-img {
        &.img-2 {
          bottom: 61px;
          right: 5%;
        }

        &.img-3 {
          bottom: 139px;
          right: 25%;
        }

        &.img-4 {
          bottom: 95px;
          left: 5%;
        }

        &.img-5 {
          bottom: 0;
          left: 30%;
        }
      }
    }
  }
  @media screen and (max-width: 374px) {
    .integrate-card h2 {
      font-size: 26px;
      line-height: 40px;
    }
  }
`;

export default HomeIntegrateStyleWrapper;
