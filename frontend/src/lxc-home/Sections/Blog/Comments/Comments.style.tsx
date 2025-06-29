import styled from "styled-components";

const CommentsStyleWrapper = styled.div`
  /* comment section style start */
  .blog-comment-section {
    background: ${({ theme }) => theme.colors.blackColor}0a;
    border-radius: 15px;
    overflow: hidden;
    margin-bottom: 60px;
    margin-right: 20px;
    background: ${({ theme }) => theme.colors.whiteColor};
    overflow: hidden;
    h4 {
      padding-left: 30px;
      padding-top: 34px;
    }

    .reply-comment-block {
      padding-left: 80px;
      border-bottom: 1px solid ${({ theme }) => theme.colors.blackColor}26;
      background: #e3e6e8ff;
    }
    .main-comment-block {
      border-bottom: 1px solid ${({ theme }) => theme.colors.blackColor}26;
    }
    .blog-comment-block {
      background: ${({ theme }) => theme.colors.whiteColor};
      padding: 34px 30px 25px 30px;
      .comment-people-section {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        gap: 14px;
        .comment-people-img {
          height: 50px;
          width: 50px;
        }
        .comment-people-text {
          span {
            display: block;
          }
          .author-name {
            font-weight: 700;
            color: ${({ theme }) => theme.colors.title};
          }
          .blog-date {
            font-size: 14px;
          }
        }
      }
      .comment-content {
        padding-left: 64px;
        p {
          margin-top: 13px;
          margin-bottom: 16px;
        }
        button {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          gap: 9px;
          color: ${({ theme }) => theme.colors.title};
          text-transform: uppercase;
          font-weight: 500;
        }
      }
    }
  }

  @media screen and (max-width: 480px) {
    .blog-comment-section .reply-comment-block {
      padding-left: 40px;
    }
  }
  /* comment section style end */

  /* leave comment section style start */
  .comment-writing-section {
    border-radius: 15px;
    overflow: hidden;
    background: ${({ theme }) => theme.colors.whiteColor};
    padding: 30px;
    margin-right: 20px;
    h4 {
      margin-bottom: 27px;
    }
    .comment-writing-form {
      .comment-writing-input-section {
        display: flex;
        align-items: flex-start;
        justify-content: flex-start;
        flex-direction: column;
        margin-bottom: 20px;
        label {
          color: ${({ theme }) => theme.colors.title};
          margin-bottom: 5px;
          text-transform: uppercase;
        }
        input {
          width: 100%;
          height: 50px;
          border: 1px solid ${({ theme }) => theme.colors.blackColor}26;
          border-radius: 10px;
          padding: 10px 15px;
          font-size: 15px;
          font-weight: 500;
          line-height: 30px;
          color: ${({ theme }) => theme.colors.textColor};
        }
        textarea {
          min-height: 120px;
          border: 1px solid ${({ theme }) => theme.colors.blackColor}26;
          border-radius: 10px;
          padding: 10px 15px;
          font-size: 15px;
          font-weight: 500;
          line-height: 30px;
          width: 100%;
          resize: none;
        }
      }
      button {
        margin-top: 10px;
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
    .comment-writing-section {
      margin-bottom: 50px;
    }
  }
  /* leave comment section style end */
`;

export default CommentsStyleWrapper;
