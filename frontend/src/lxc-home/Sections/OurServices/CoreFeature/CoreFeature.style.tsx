import styled from "styled-components";

const CoreFeatureStyle = styled.section`
  padding: 130px 0;

  .core-feature-title {
    h3 {
      margin-bottom: 16px;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      font-size: 18px;
      line-height: 30px;
      color: ${({ theme }) => theme.colors.primary};
    }
    p {
      margin-top: 30px;
    }
  }

  .core-feature-actions {
    margin-top: 90px;
    display: flex;
    flex-direction: column;
    gap: 30px;
  }

  .core-feature-item {
    margin-bottom: 30px;
    max-width: 88%;
    margin-left: auto;
    &-icon {
      margin-bottom: 30px;
      img {
        width: 72px;
        height: 72px;
      }
    }
    h5 {
      margin-bottom: 10px;
      font-weight: 700;
    }
  }

  @media screen and (max-width: 1199px) {
    .core-feature-item {
      max-width: 100%;
    }
  }
  @media screen and (max-width: 991px) {
    .core-feature-content {
      margin-bottom: 40px;
    }
  }
  @media screen and (max-width: 767px) {
    padding: 60px 0 40px 0px;
    .core-feature-title {
      h3 {
        margin-bottom: 5px;
        @include textStyle(16px, 700, 30px);
      }

      h2 {
        @include textStyle(32px, 700, 45px);
      }
    }
    .core-feature-actions {
      margin-top: 20px;
    }
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

export default CoreFeatureStyle;
