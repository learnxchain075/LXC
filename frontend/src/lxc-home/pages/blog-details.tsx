import Layout from "../Layout";
import Header from "../Sections/Header/Header";
import StartBuildingComponent from "../Components/StartBuilding/StartBuildingComponent";
import FooterOne from "../Sections/Footer/FooterOne";
import BlogDetailsSection from "../Sections/Blog/BlogDetails/BlogDetails";

const BlogDetails = () => {
  return (
    <Layout pageTitle="LearnXChain - Blog Details">
      <div className="bg-gray">
        <Header variant="main-header" />
        <BlogDetailsSection />
        <StartBuildingComponent />
        <FooterOne />
      </div>
    </Layout>
  );
};

export default BlogDetails;
