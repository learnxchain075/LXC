import styled from "styled-components";

const TermsAndPrivacyStyleWrapper = styled.section`
  padding-top: 111px;
  padding-bottom: 127px;
  margin-top: 90px;

  h1 {
    margin-top: 11px;
  }

  .terms-and-service-inner {
    margin-top: 112px;
  }

  .terms-and-service-content {
    p {
      margin-bottom: 20px;
      b {
        color: ${({ theme }) => theme.colors.title};
      }
      strong {
        color: ${({ theme }) => theme.colors.title};
      }
      a {
        color: ${({ theme }) => theme.colors.primary};
      }
    }
    h4 {
      margin-bottom: 7px;
    }
  }

  .content-table-title {
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.primary};
    margin-bottom: 20px;
    img {
      margin-right: 15px;
    }
  }

  .terms-list {
    li {
      line-height: 36px;

      &:not(:first-child) {
        margin-top: 5px;
      }

      a {
        &.active,
        &:hover {
          color: ${({ theme }) => theme.colors.title};
        }
      }
    }
  }

  .terms-and-service-sidebar {
    left: inherit !important;
    ol {
      li {
        line-height: 36px;

        a {
          &.active,
          &:hover {
            color: ${({ theme }) => theme.colors.title};
          }
        }
      }
    }
  }

  .uppercase {
    text-transform: uppercase;
  }

  @media screen and (max-width: 991px) {
    padding-top: 80px;
    padding-bottom: 80px;

    .terms-and-service-inner {
      margin-top: 80px;
    }
  }

  @media screen and (max-width: 767px) {
    padding-top: 60px;
    padding-bottom: 50px;
    h1 {
      font-size: 32px;
    }

    .terms-and-service-inner {
      margin-top: 60px;
      .sidebar {
        margin-bottom: 40px;
      }
    }

    .terms-and-service-sidebar {
      position: relative !important;
      top: 0px !important;
      width: 100% !important;
    }
  }
`;

export default TermsAndPrivacyStyleWrapper;
