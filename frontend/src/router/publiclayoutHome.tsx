
import { Outlet } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import TemplateStyles from "../lxc-home/assets/styles/TemplateStyles";
import GlobalStyles from "../lxc-home/assets/styles/GlobalStyles";
import ScrollToTop from "../lxc-home/ScrollToTop";
import "venobox/dist/venobox.min.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../lxc-home/assets/styles/common-style.css";
import "../lxc-home/assets/styles/buttons-style.css";


const PublicLayout = () => {
  return (
    <ThemeProvider theme={TemplateStyles}>
      <GlobalStyles />
      <ScrollToTop />
      <Outlet />
    </ThemeProvider>
  );
};

export default PublicLayout;
