import styled from "styled-components";

const TeamStyleWrapper = styled.section`
  padding: 0px 0 110px 0;

  .team-card {
    width: fit-content;
    margin: 0 auto 30px;
    padding: 25px 25px 20px 25px;
    background: ${({ theme }) => theme.colors.whiteColor};
    border: 1px solid ${({ theme }) => theme.colors.blackColor}26;
    border-radius: 135px 135px 30px 30px;
    &-img {
      margin-bottom: 25px;
      img {
        max-width: 100%;
        width: 220px;
        height: 220px;
        border-radius: 50%;
      }
    }
    &-info {
      margin-bottom: 20px;
      text-align: center;
      h5 {
        font-weight: 700;
      }
      p {
        color: ${({ theme }) => theme.colors.textColor};
      }
    }
  }

  .team-social-link {
    padding: 0;
    list-style: none;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 30px;
    li a {
      opacity: 0.5;
      transition: 0.3s;
      &:hover {
        opacity: 0.7;
      }
    }
  }

  @media screen and (max-width: 575px) {
    padding: 30px 0;
  }
`;

export default TeamStyleWrapper;
