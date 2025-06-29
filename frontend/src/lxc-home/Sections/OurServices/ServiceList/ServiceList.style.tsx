import styled from "styled-components";

const ServiceListStyle = styled.section`
  padding: 130px 0 90px 0;

  .service-content {
    margin-bottom: 40px;
    h3 {
      margin-bottom: 8px;
      text-transform: uppercase;
      font-size: 15px;
      line-height: 26px;
      color: ${({ theme }) => theme.colors.primary};
    }
    h2 {
      font-size: 18px;
      line-height: 30px;
      margin-bottom: 0;
    }

    &-title {
      margin-bottom: 19px;
    }

    &-list {
      padding: 0;
      list-style: none;
      li {
        color: ${({ theme }) => theme.colors.textColor};
        padding-left: 20px;
        position: relative;
        &:not(:first-child) {
          margin-top: 10px;
        }
        &::before {
          position: absolute;
          content: "";
          top: 50%;
          left: 0;
          transform: translateY(-50%);
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: ${({ theme }) => theme.colors.primary}80;
        }
        &::after {
          position: absolute;
          content: "";
          top: calc(50% + 2px);
          left: 0;
          transform: translateY(-50%) rotate(45deg);
          width: 8px;
          height: 8px;
          border-radius: 50%;
          box-shadow: 2px 2px 0 0 ${({ theme }) => theme.colors.primary}4d;
        }
      }
    }

    &.item-1 {
      h3 {
        color: ${({ theme }) => theme.colors.primary};
      }
      .service-content-list li::before {
        background-color: ${({ theme }) => theme.colors.primary}80;
      }
      .service-content-list li::after {
        box-shadow: 2px 2px 0 0 ${({ theme }) => theme.colors.primary}4d;
      }
    }
    &.item-2 {
      h3 {
        color: ${({ theme }) => theme.colors.iconColor2};
      }
      .service-content-list li::before {
        background-color: ${({ theme }) => theme.colors.iconColor2}80;
      }
      .service-content-list li::after {
        box-shadow: 2px 2px 0 0 ${({ theme }) => theme.colors.iconColor2}4d;
      }
    }
    &.item-3 {
      h3 {
        color: ${({ theme }) => theme.colors.badgeColor};
      }
      .service-content-list li::before {
        background-color: ${({ theme }) => theme.colors.badgeColor}80;
      }
      .service-content-list li::after {
        box-shadow: 2px 2px 0 0 ${({ theme }) => theme.colors.badgeColor}4d;
      }
    }
    &.item-4 {
      h3 {
        color: ${({ theme }) => theme.colors.heroimg1Bg};
      }
      .service-content-list li::before {
        background-color: ${({ theme }) => theme.colors.heroimg1Bg}80;
      }
      .service-content-list li::after {
        box-shadow: 2px 2px 0 0 ${({ theme }) => theme.colors.heroimg1Bg}4d;
      }
    }
  }

  @media screen and (max-width: 767px) {
    &.service-section {
      padding: 75px 0 30px 0;
    }
  }
`;

export default ServiceListStyle;
