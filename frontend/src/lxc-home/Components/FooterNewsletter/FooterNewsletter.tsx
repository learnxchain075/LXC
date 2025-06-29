import FooterNewsletterStyle from './FooterNewsletter.style';

const FooterNewsletter = () => {
  return (
    <FooterNewsletterStyle className="footer-newsletter-card">
      <h5>Subscribe newsletter to get updates</h5>
      <form>
        <input type="email" placeholder='Email address' />
        <button type='submit'>Subscribe</button>
      </form>
    </FooterNewsletterStyle>
  );
};

export default FooterNewsletter;
