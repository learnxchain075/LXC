import styled from "styled-components";

const AuthenticationStyleWrapper = styled.section`
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 100%;
  height: 100vh;
  background: ${({ theme }) => theme.colors.whiteColor};
  overflow: hidden;

  .auth-form-section {
    background: ${({ theme }) => theme.colors.whiteColor};
    position: relative;
    max-width: 620px;
    width: 100%;
    overflow: hidden;
    padding: 25px 75px;
    min-height: 100%;
    height: 100vh;
    overflow-y: scroll;
    &::-webkit-scrollbar {
      display: none;
    }
    .form-group {
      position: relative;
    }
    span.error {
      color: #ff0000 !important;
      position: absolute;
      right: 20px !important;
      top: 50px !important;
      font-size: 13px !important;
      left: auto !important;
      text-transform: none !important;
      min-width: max-content;
    }
    input.error {
      border-color: rgba(255, 0, 0, 0.5) !important;
    }
    input.error:focus {
      background: transparent !important;
      border: 1px solid rgba(255, 0, 0, 0.5) !important;
    }
    .progress {
      margin-top: -10px;
      height: 5px;
    }
    .suggestion {
      font-size: 13px !important;
      margin-top: 10px !important;
      margin-bottom: 15px;
    }
    &::after {
      content: "";
      height: 700px;
      width: 700px;
      background: linear-gradient(
        180deg,
        rgba(65, 152, 254, 0.1) 0%,
        rgba(255, 255, 255, 0) 100%
      );
      border-radius: 50%;
      left: -206px;
      top: 140px;
      position: absolute;
    }
    form {
      position: relative;
      z-index: 1;
    }
    h4 {
      margin-bottom: 35px;
    }
    label {
      text-transform: uppercase;
      color: ${({ theme }) => theme.colors.title};
      margin-bottom: 5px;
    }
    input {
      background: ${({ theme }) => theme.colors.whiteColor};
      border: 1px solid ${({ theme }) => theme.colors.blackColor}1f;
      border-radius: 10px;
      width: 100%;
      padding: 15px;
      margin-bottom: 21px;
      font-weight: 500;
      font-size: 15px;
      line-height: 200%;
      color: ${({ theme }) => theme.colors.title};
      &::placeholder {
        color: ${({ theme }) => theme.colors.iconColor};
      }
    }

    .form-primary-btn {
      background: ${({ theme }) => theme.colors.primary};
      border-radius: 10px;
      padding: 17px;
      width: 100%;
      font-weight: 700;
      line-height: 26px;
      color: ${({ theme }) => theme.colors.whiteColor};
    }

    .secondary-btn {
      background: ${({ theme }) => theme.colors.whiteColor};
      border: 1px solid ${({ theme }) => theme.colors.blackColor}1f;
      border-radius: 10px;
      padding: 17px;
      width: 100%;
      font-weight: 700;
      line-height: 26px;
      color: ${({ theme }) => theme.colors.title};
      margin-bottom: 20px;
      transition: 0.3s;
      img {
        margin-right: 13px;
      }
      &:hover {
        box-shadow: 0px 5px 8px ${({ theme }) => theme.colors.blackColor}14;
      }
    }

    .or-section {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 26px;
      margin: 10px 0px;
      p {
        text-transform: uppercase;
      }
      &::after {
        content: "";
        height: 1px;
        background: ${({ theme }) => theme.colors.blackColor}1f;
        max-width: 70%;
        width: 100%;
      }
      &::before {
        content: "";
        height: 1px;
        background: ${({ theme }) => theme.colors.blackColor}1f;
        max-width: 70%;
        width: 100%;
      }
    }

    .auth-link {
      font-weight: 500;
      font-size: 14px;
      line-height: 18px;
      text-decoration: underline !important;
      color: ${({ theme }) => theme.colors.title};
      margin-bottom: 16px;
    }
    p {
      font-weight: 500;
      font-size: 14px;
      line-height: 18px;
      color: ${({ theme }) => theme.colors.textColor};
      margin-bottom: 47px;

      a {
        font-weight: 500;
        font-size: 14px;
        line-height: 18px;
        text-decoration: underline !important;
        color: ${({ theme }) => theme.colors.title};
        margin-bottom: 0px;
      }
    }
  }

  .auth-page-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 125px;
    .back-link {
      font-weight: 700;
      font-size: 15px;
      line-height: 200%;
      text-align: right;
      color: ${({ theme }) => theme.colors.iconColor};
      display: flex;
      align-items: center;
      justify-content: space-between;
      svg {
        font-size: 24px;
        margin-right: 10px;
        color: ${({ theme }) => theme.colors.iconColor};
        path {
          font-size: 24px;
          margin-right: 10px;
          color: ${({ theme }) => theme.colors.iconColor};
        }
      }
    }
  }

  .auth-right-section {
    max-width: 100%;
    width: 100%;
    height: 100vh;
    overflow: hidden;
    position: relative;
    video {
      position: absolute;
      height: 100%;
      width: 100%;
      object-fit: cover;
    }
  }

  .auth-brand-slider-section {
    position: absolute;
    padding: 54px 75px;
    z-index: 1;
    margin-top: auto;
    left: 0px;
    bottom: 0px;
    .auth-brand-slider-inner {
      max-width: 850px;
      width: 100%;
      margin-right: auto;
      overflow: hidden;
    }
    h5 {
      color: ${({ theme }) => theme.colors.whiteColor};
      margin-bottom: 29px;
      line-height: 50px;
      font-weight: 700;
    }
  }

  .auth-brand-slider {
    display: flex;
    align-items: center;
    ul {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      list-style: none;
      padding: 0px;
      flex-wrap: wrap;
      row-gap: 20px;
      li {
        margin-right: 50px;
        min-width: max-content;
        filter: brightness(100);
      }
    }
  }

  @media screen and (max-width: 1199px) {
    .auth-page-header {
      margin-bottom: 80px;
    }
    .auth-form-section {
      max-width: 400px;
      padding-left: 50px;
      padding-right: 50px;
    }
  }

  @media screen and (max-width: 991px) {
    .auth-brand-slider-section {
      padding: 40px 20px;
    }
  }

  @media screen and (max-width: 767px) {
    flex-direction: column;

    .auth-form-section {
      max-width: 100%;
      padding-left: 50px;
      padding-right: 50px;
    }
    .auth-page-header {
      margin-bottom: 50px;
    }
    .auth-right-section {
      display: none;
    }
  }

  @media screen and (max-width: 425px) {
    .auth-form-section {
      padding: 20px 25px;
    }
  }
`;

export default AuthenticationStyleWrapper;
