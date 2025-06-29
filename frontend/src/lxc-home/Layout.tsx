import { Helmet, HelmetProvider } from "react-helmet-async";
import PropTypes from "prop-types";
import ScrollTop from "./Components/ScrollTop/ScrollTop";

interface LayoutProps {
  pageTitle?: string;
  scrollVariant?: string;
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ pageTitle, scrollVariant, children }) => {
  return (
    <HelmetProvider>
      <Helmet>
        {/* title tag */}
        {pageTitle ? <title>{pageTitle}</title> : <title>LearnXChain</title>}

        {/* favicon included here  */}
        <link rel="shortcut icon" href="/faviconLxc-home.png" type="image/x-icon" />

        {/* apple touch icon included here */}
        <link rel="apple-touch-icon" href="/faviconLxc-home.png" />

        {/* All font family included here */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />

        {/* DM Sans font family */}
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap"
          rel="stylesheet"
        />
        {/* Montserrat Alternates font family */}
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat+Alternates:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
          rel="stylesheet"
        />
        {/* Jost font family */}
        <link
          href="https://fonts.googleapis.com/css2?family=Jost:ital,wght@0,100..900;1,100..900&display=swap"
          rel="stylesheet"
        />
        {/* Fira Code font family */}
        <link
          href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@300..700&display=swap"
          rel="stylesheet"
        />
        {/* Caveat font family */}
        <link
          href="https://fonts.googleapis.com/css2?family=Caveat:wght@400..700&display=swap"
          rel="stylesheet"
        />
        {/* Quantico font family */}
        <link
          href="https://fonts.googleapis.com/css2?family=Quantico:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />
        {/* Inter font family */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap"
          rel="stylesheet"
        />
      </Helmet>
      {/* overlay while mobile menu open */}
      <div className="LearnXChain-overly-bg"></div>

      {/* content */}
      {children}

      {/* scroll top component */}
      <ScrollTop variant={scrollVariant} />
    </HelmetProvider>
  );
};
Layout.propTypes = {
  pageTitle: PropTypes.string,
  scrollVariant: PropTypes.string,
  children: PropTypes.node
};

export default Layout;

