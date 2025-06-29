import styled from "styled-components";

const ContactLocationStyle = styled.section`
  padding: 65px 0 130px 0;

  .map-content {
    border-radius: 30px;
    overflow: hidden;
    position: relative;
  }

  .contact-map {
    width: 100%;
    height: 450px;
    iframe {
      width: 100%;
    }
  }

  .map-info-card {
    position: absolute;
    z-index: 1;
    top: 30px;
    left: 30px;
    width: 350px;
    height: 390px;
    padding: 30px;
    background-color: ${({ theme }) => theme.colors.whiteColor};
    border-radius: 20px;

    .list {
      padding: 0;
      list-style: none;
      margin: 0;
      height: 100%;
      overflow-y: auto;
      -ms-overflow-style: none;
      /* Internet Explorer 10+ */
      scrollbar-width: none;
      transition: width 0.3s;

      &::-webkit-scrollbar {
        display: none;
        /* Safari and Chrome */
      }
      li {
        &:not(:first-child) {
          margin-top: 10px;
        }
      }

      .list-item {
        display: flex;
        gap: 19px;
        .list-icon {
          flex: 0 0 auto;
        }
        img {
          width: 20px;
          height: 20px;
        }
        h4 {
          font-size: 15px;
          line-height: 45px;
          margin-bottom: 0;
        }
        p {
          margin-bottom: 0;
        }
      }

      .list-icon {
        line-height: 45px;
      }
    }
  }

  @media screen and (max-width: 767px) {
    padding: 30px 0 80px;
  }

  @media screen and (max-width: 575px) {
    .map-info-card {
      position: absolute;
      z-index: 1;
      top: 30px;
      left: 30px;
      width: 80%;
      height: calc(100% - 60px);
      padding: 20px;
    }
  }
`;

export default ContactLocationStyle;
