import styled from "styled-components";

const BlogDetailsStyleWrapper = styled.section`
  /* Breadcrumb section style start */
  .breadcrumb-section {
    margin-top: 90px;
    padding: 60px 0;
    background-color: ${({ theme }) => theme.colors.bgHero};
    position: relative;
    z-index: 0;

    .shape-img {
      position: absolute;
      z-index: -1;

      &.img-1 {
        bottom: 0;
        left: 4%;
      }

      &.img-2 {
        bottom: 0;
        left: 34%;
      }
    }

    &.blog-details-breadcrumb-section {
      height: 436px;
    }
    &.pricing-plan-breadcrumb-section {
      min-height: 580px;
      padding-top: 95px;
    }
  }
  .breadcrumb-list {
    margin: 0;
    padding: 0;
    list-style: none;
    .breadcrumb-item {
      text-transform: uppercase;
      font-weight: 700;
      color: ${({ theme }) => theme.colors.whiteColor};

      &.active {
        color: ${({ theme }) => theme.colors.whiteColor}b2;
      }

      &:not(:first-child)::before {
        content: ".";
        font-size: 20px;
        margin: 0px 5px;
        color: #6c757d;
      }
    }
  }
  .breadcrumb-sec {
    .breadcrumb-title {
      text-transform: capitalize;
      font-size: 50px;
      color: ${({ theme }) => theme.colors.whiteColor};
      margin-bottom: 0;
      margin-top: 30px;
    }
  }
  .breadcrumb-img {
    text-align: right;
  }
  .blog-details-section {
    margin-top: -110px;
    padding-bottom: 140px;
    position: relative;
    z-index: 111;
  }
  .blog-details-content {
    background: ${({ theme }) => theme.colors.whiteColor};
    border-radius: 15px;
    margin-right: 20px;
    .blog-details-img {
      border-radius: 15px 15px 0px 0px;
      height: 430px;
      width: 100%;
      overflow: hidden;
      margin-bottom: 6px;
      img {
        object-fit: cover;
        height: 100%;
        width: 100%;
      }
    }
  }
  .blog-details-inner {
    padding: 30px;
    .blog-details-info-list {
      margin-bottom: 27px;
      ul {
        padding: 0;
        list-style: none;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        flex-wrap: wrap;
        gap: 28px;
        li {
          text-transform: uppercase;
          a {
            color: ${({ theme }) => theme.colors.primary};
          }

          span {
            margin-right: 12px;
          }
        }
      }
    }
    .blog-details-headline {
      font-size: 18px;
      font-weight: 500;
      line-height: 30px;
      color: ${({ theme }) => theme.colors.title};
      margin-bottom: 20px;
    }
    .blog-text-title {
      font-size: 24px;
      font-weight: 700;
      line-height: 36px;
      margin-bottom: 8px;
    }
    .blog-quotation-section {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      gap: 28px;
      margin-top: 42px;
      margin-bottom: 47px;
      .quotation-icon {
        min-width: 20px;
        img {
          width: 100%;
        }
      }
      h4 {
        font-weight: 500;
        line-height: 40px;
        font-family: ${({ theme }) => theme.fonts.dmSans};
        font-style: italic;
      }
    }
    .blog-text-list {
      padding: 0;
      list-style: none;
      li {
        position: relative;
        padding-left: 22px;
        padding-bottom: 8px;
        &:last-child {
          padding-bottom: 0;
        }
        &:before {
          content: "";
          height: 8px;
          width: 8px;
          border-radius: 50%;
          background: rgba(0, 206, 201, 0.4);
          position: absolute;
          left: 0px;
          top: 12px;
        }
      }
    }
    .blog-tag-section {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 47px;
      ul {
        margin-bottom: 0;
        padding: 0;
        list-style: none;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        flex-wrap: wrap;
        gap: 10px;
        li {
          padding: 7px 22px;
          border: 1px solid ${({ theme }) => theme.colors.blackColor}26;
          border-radius: 25px;
          transition: 0.3s;
          &:hover {
            color: ${({ theme }) => theme.colors.primary};
            border: 1px solid ${({ theme }) => theme.colors.primary};
            transition: 0.3s;
          }
        }
      }
      button {
        padding: 8px 21px;
        display: flex;
        align-items: center;
        column-gap: 12px;
        background: ${({ theme }) => theme.colors.blackColor}0d;
        border-radius: 25px;
        color: ${({ theme }) => theme.colors.textColor};
      }
    }
  }
  .blog-previous-next-section {
    margin: 60px 0px;
    margin-bottom: 40px;
    margin-right: 20px;
    .blog-card {
      background: ${({ theme }) => theme.colors.whiteColor};
      border-radius: 15px;
      padding: 18px;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      gap: 19px;
      margin-bottom: 20px;
      .blog-card-img {
        min-width: 100px;
        min-height: 80px;
        overflow: hidden;
        border-radius: 10px;
        img {
          height: 100%;
          width: 100%;
        }
      }
      .blog-card-text {
        max-width: 213px;
        width: 100%;
        a {
          font-size: 15px;
          font-weight: 500;
          line-height: 30px;
          color: ${({ theme }) => theme.colors.primary};
        }
        h6 {
          a {
            font-family: ${({ theme }) => theme.fonts.PlusJakartaSans};
            font-size: 15px;
            font-weight: 700;
            line-height: 24px;
            color: ${({ theme }) => theme.colors.title};
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }
      &.justify-right {
        justify-content: flex-end;
        flex-direction: row-reverse;
        .blog-card-text {
          text-align: right;
          margin-left: auto;
        }
      }
    }
  }

  @media screen and (max-width: 991px) {
    .breadcrumb-section {
      margin-top: 70px;
    }
    .breadcrumb-sec .breadcrumb-title {
      font-size: 40px;
    }
  }
  @media screen and (max-width: 767px) {
    .breadcrumb-img {
      margin-top: 40px;
    }
    .breadcrumb-section.blog-details-breadcrumb-section {
      height: 360px;
    }
    .breadcrumb-sec .breadcrumb-title {
      font-size: 40px;
      margin-top: 5px;
    }
    .breadcrumb-sec .breadcrumb-title br {
      display: none;
    }
  }
  @media screen and (max-width: 374px) {
    h1,
    .breadcrumb-sec .breadcrumb-title {
      font-size: 35px;
      line-height: 50px;
    }
  }
  /* Breadcrumb section style end */

  @media screen and (max-width: 1199px) {
    .blog-details-inner {
      .blog-tag-section {
        ul {
          li {
            padding: 4px 16px;
          }
        }

        button {
          padding: 5px 16px;
        }
      }
    }
  }
  @media screen and (max-width: 991px) {
    .blog-details-content,
    .blog-previous-next-section,
    .blog-comment-section,
    .comment-writing-section {
      margin-right: 0px;
    }
  }
  @media screen and (max-width: 767px) {
    .blog-details-inner {
      .blog-details-headline {
        font-size: 15px;
        line-height: 26px;
      }
    }
    .blog-details-section {
      padding-bottom: 50px;
    }
    .breadcrumb-section.blog-details-breadcrumb-section {
      height: 360px;
    }
    .blog-details-section {
      margin-top: -80px;
    }
    .blog-details-inner {
      .blog-details-headline {
        font-size: 16px;
        line-height: 28px;
      }

      .blog-quotation-section h4 {
        font-size: 16px;
        line-height: 28px;
      }

      .blog-details-info-list {
        margin-bottom: 15px;

        ul {
          flex-direction: column;
          gap: 10px;
          align-items: flex-start;
        }
      }
    }
  }
  @media screen and (max-width: 480px) {
    .blog-details-section {
      margin-top: -50px;
    }
  }
`;

export default BlogDetailsStyleWrapper;
