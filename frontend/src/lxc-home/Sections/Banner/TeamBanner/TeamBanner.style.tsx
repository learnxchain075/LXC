import styled from "styled-components";

const TeamBannerStyleWrapper = styled.section`
  margin-top: 100px;
  background: linear-gradient(90deg, #d3e1ff 0%, #ecf1f8 45.31%, #ffeaef 98.8%);
  border-radius: 50px;
  padding: 126px 0 30px 0;
  overflow: hidden;
  .hero-section-3-header {
    text-align: center;
    position: relative;
    z-index: 0;
    .shape-img {
      position: absolute;
      z-index: -1;
      &.img-1 {
        bottom: 90px;
        left: 10%;
      }

      &.img-2 {
        bottom: 40px;
        right: 8%;
      }
    }

    .title{
      line-height: 130% !important;
      padding-bottom: 10px;
    }
    .sub-title {
      margin: 0 auto 15px;
      width: fit-content;
      background: rgba(249, 81, 140, 0.15);
      border-radius: 40px;
      padding: 8px 17px;
      color: #f9518c;
      display: block;
      font-weight: 700;
    }

    form {
      margin: 28px 0;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 20px;
      input {
        width: 380px;
        height: 60px;
        background: ${({ theme }) => theme.colors.whiteColor};
        border: 1px solid ${({ theme }) => theme.colors.blackColor}1f;
        border-radius: 50px;
        padding: 17px 20px;
        &::placeholder {
          color: #999;
          opacity: 1;
        }

        &:-ms-input-placeholder {
          color: #999;
          opacity: 1;
        }

        &::-ms-input-placeholder {
          color: #999;
          opacity: 1;
        }
      }
      input[type="submit"] {
        width: 170px;
        height: 60px;
        background-color: ${({ theme }) => theme.colors.primary};
        border-radius: 50px;
        color: ${({ theme }) => theme.colors.whiteColor};
        transition: 0.3s;
        line-height: 0;
        font-weight: 700;
        &:hover {
          opacity: 0.8;
        }
      }
    }
  }

  .hero-section-3-content {
    margin-top: 0px;
    width: 100%;
    display: flex;
    align-items: flex-end;
    gap: 20px;
    justify-content: space-between;

    .item {
      width: 100%;
    }
  }

  .call-remove-btn {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #f52e2f;
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      width: 16px !important;
      height: 16px !important;
    }
  }

  /*-- hero-section-3 end --*/

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
    .hero-section-3-header {
      .shape-img {
        &.img-1 {
          left: 0;
        }

        &.img-2 {
          right: 0;
        }
      }
    }
  }
  @media screen and (min-width: 991px) and (max-width: 1200px) {
  }
  @media screen and (max-width: 991px) {
    margin-top: 75px;
    .hero-section-3-header h2 {
      font-size: 46px;
      line-height: 60px;
    }
  }
  @media screen and (min-width: 768px) and (max-width: 991px) {
  }
  @media screen and (max-width: 767px) {
    .bg-shape {
      display: none;
    }
    .hero-section-3-header h2 {
      font-size: 48px;
    }
  }
  @media screen and (max-width: 575px) {
    .hero-section-3-header h2 {
      font-size: 36px;
      line-height: 70px;
    }
    .hero-section-3-header h2 {
      font-size: 40px;
      line-height: 55px;
    }
  }
  @media screen and (max-width: 480px) {
    padding: 100px 0 30px 0;

    .hero-section-3-header {
      h2 {
        font-size: 24px;
        line-height: 40px;
      }

      form {
        flex-direction: column;

        input {
          width: 100%;
        }
      }
    }
  }
`;

export default TeamBannerStyleWrapper;
