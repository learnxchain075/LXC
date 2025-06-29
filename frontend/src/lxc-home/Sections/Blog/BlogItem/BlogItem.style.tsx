import styled from "styled-components";

const BlogItemStyleWrapper = styled.article`
  background: ${({ theme }) => theme.colors.whiteColor};
  border-radius: 15px;
  overflow: hidden;
  margin-bottom: 30px;

  .letest-blog-img {
    min-height: 220px;
    width: 100%;

    img {
      height: 100%;
      width: 100%;
      object-fit: cover;
    }
  }

  .letest-blog-info {
    .letest-blog-info-inner {
      padding: 21px 29px;

      h5 {
        font-family: ${({ theme }) => theme.fonts.dmSans};
        text-transform: uppercase;
        font-size: 15px;
        font-weight: 500;
        line-height: 30px;
        color: ${({ theme }) => theme.colors.textColor};
        letter-spacing: 0.1em;
        margin-bottom: 7px;

        span {
          color: ${({ theme }) => theme.colors.primary};
        }
      }

      h4 {
        margin-bottom: 11px;
        a {
          font-family: ${({ theme }) => theme.fonts.PlusJakartaSans};
          font-size: 18px;
          font-weight: 700;
          line-height: 30px;
          color: ${({ theme }) => theme.colors.title};
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
          transition: 0.3s;
          &:hover {
            color: ${({ theme }) => theme.colors.primary};
          }
        }
      }

      p {
        margin-bottom: 11px;
        display: -webkit-box;
        -webkit-line-clamp: 4;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      a {
        color: ${({ theme }) => theme.colors.primary};
        transition: 0.3s;
        img {
          margin-left: 11px;
        }
      }
    }
  }

  .letest-blog-catd-title {
    font-size: 18px;
    line-height: 30px;
    margin-bottom: 20px;
  }
`;

export default BlogItemStyleWrapper;
