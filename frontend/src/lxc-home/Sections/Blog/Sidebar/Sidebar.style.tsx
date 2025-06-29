import styled from "styled-components";

const SidebarStyleWrapper = styled.aside`
  .latest-blog-section {
    padding: 140px 0px;
    .latest-blog-content {
      padding-right: 20px;
    }
  }
  .letest-blog-card {
    background: ${({ theme }) => theme.colors.whiteColor};
    border-radius: 15px;
    overflow: hidden;
    margin-bottom: 30px;
  }
  .letest-blog-search-section {
    padding: 30px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.blackColor}26;
    & form {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 50px;
      padding: 10px 15px;
      border: 1px solid ${({ theme }) => theme.colors.blackColor}26;
      border-radius: 10px;
      & input {
        border: none;
        outline: none;
        width: 80%;
      }
    }
  }
  .categories-list {
    padding: 22px 30px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.blackColor}26;
    ul {
      padding: 0;
      list-style: none;
      li {
        a {
          font-size: 16px;
          line-height: 36px;
          color: ${({ theme }) => theme.colors.textColor};
          transition: 0.3s;
          &:hover {
            color: ${({ theme }) => theme.colors.primary};
          }
        }
      }
    }
  }
  .recent-post-section {
    padding: 22px 30px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.blackColor}26;
    ul {
      padding: 0;
      list-style: none;
      margin-top: 16px;
      display: flex;
      align-items: flex-start;
      justify-content: flex-start;
      gap: 20px;
      flex-direction: column;
      li {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        gap: 19px;
        .recent-post-img {
          min-height: 80px;
          min-width: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          border-radius: 15px;
          img {
            height: 100%;
            width: 100%;
            border-radius: 15px;
            overflow: hidden;
            object-fit: cover;
          }
        }
        .recent-post-text {
          .blog-date {
            font-size: 14px;
            line-height: 20px;
            opacity: 0.8;
            margin-bottom: 8px;
          }
          h5 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-overflow: ellipsis;
            font-weight: 700;
            a {
              transition: 0.4s;
              &:hover {
                color: ${({ theme }) => theme.colors.primary};
              }
            }
          }
        }
      }
    }
  }
  .post-tags-section {
    padding: 22px 30px 30px 30px;
    ul {
      padding: 0;
      list-style: none;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      flex-wrap: wrap;
      gap: 10px;
      & li {
        border-radius: 25px;
        transition: 0.3s;
        display: inline-block;
        & a {
          font-size: 14px;
          font-style: italic;
          transition: 0.3s;
          height: 45px;
          line-height: 45px;
          background: ${({ theme }) => theme.colors.whiteColor}1a;
          border: 1px solid ${({ theme }) => theme.colors.blackColor}26;
          border-radius: 25px;
          display: block;
          padding: 0 20px;
          &:hover {
            color: ${({ theme }) => theme.colors.primary};
            border: 1px solid ${({ theme }) => theme.colors.primary};
          }
        }
      }
    }
  }

  @media screen and (max-width: 991px) {
    .latest-blog-section .latest-blog-content {
      padding-right: 0px;
    }
  }
  @media screen and (max-width: 767px) {
    .latest-blog-section {
      padding: 80px 0px 70px;
    }
    .post-tags-section ul li {
      padding: 11px 15px;
    }
  }
`;

export default SidebarStyleWrapper;
