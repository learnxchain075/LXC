import styled from "styled-components";

const BlogListStyleWrapper = styled.section`
  padding: 140px 0px;

  .latest-blog-content {
    padding-right: 20px;
  }

  @media screen and (max-width: 991px) {
    .latest-blog-content {
      padding-right: 0px;
    }
  }
  @media screen and (max-width: 767px) {
    padding: 80px 0px 70px;
  }
`;

export default BlogListStyleWrapper;
