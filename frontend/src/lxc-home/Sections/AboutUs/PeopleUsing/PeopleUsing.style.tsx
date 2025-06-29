import styled from "styled-components";

const PeopleUsingStyle = styled.section`
  padding: 140px 0 0;
  .users-list {
    margin-bottom: 13px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    list-style: none;
    padding: 0px;
    li {
      border-radius: 50%;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid #ffffff;
      margin-left: -6px;
      height: 36px;
      width: 36px;
      border: 2px solid ${({ theme }) => theme.colors.borderColor2};
      &:nth-child(1) {
        margin: 0px;
      }
      button {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background-color: rgba(0, 149, 255, 0.3019607843);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: 0.3s;
      }
    }
  }

  .customer-content {
    &-text {
      h2 {
        margin-bottom: 37px;
      }
      p {
        margin-bottom: 15px;
      }
      .text-link {
        margin-top: 40px;
      }
    }
  }

  @media screen and (max-width: 991px) {
    margin-bottom: -30px;
    padding-bottom: 0;
    .customer-content{
      margin-top: 40px;
    }
  }
  @media screen and (max-width: 767px) {
    margin-bottom: -40px;
    padding-bottom: 0;
    padding-top: 80px;
    .customer-content{
      margin-top: 30px;
    }

    .customer-content-text h2 {
      margin-bottom: 18px;
      font-size: 32px;
      font-weight: 700;
      line-height: 45px;
    }
    .customer-content-text p {
      margin-bottom: 15px;
    }
    .customer-content-text .text-link {
      margin-top: 20px;
    }
  }

  @media screen and (max-width: 575px) {
    padding: 60px 0 0 0;
    margin-bottom: -50px;
  }

  @media screen and (max-width: 374px) {
    .contact-content h2,
    .core-feature-title h2,
    .skills-content h2,
    .building-content h2,
    .lets-talk-text h2,
    .section-title .title,
    .team-section .section-title h2,
    .about-feature-section .about-feature-title h2,
    .customer-content-text h2,
    .feature-team-slider-for .slider-item h2,
    .how-works-title h2,
    .usability-card-title h2,
    .faq-section-title h2,
    .pricing-section-title h2,
    .testimonial-title h2,
    .marketing-content-title h2,
    .section-title h2 {
      font-size: 32px !important;
      line-height: 42px;
    }
  }
`;

export default PeopleUsingStyle;
