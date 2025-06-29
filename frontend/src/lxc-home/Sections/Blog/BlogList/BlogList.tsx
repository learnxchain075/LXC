import BlogListStyleWrapper from "./BlogList.style";
import StickyBox from "react-sticky-box";
import BlogItem from "../BlogItem/BlogItem";
import Data from "../../../assets/data/blog/posts";
import Pagination from "../../../Components/Pagination/Pagination";
import Sidebar from "../Sidebar/Sidebar";

const BlogList = () => {
  return (
    <BlogListStyleWrapper>
      <div className="container">
        <div className="row g-4">
          {/* blog section */}
          <div className="col-lg-8">
            <div className="latest-blog-content">
              <div className="row">
                {Data?.map((post, i) => {
                  return (
                    <div key={i} className="col-md-6">
                      <BlogItem {...post} />
                    </div>
                  );
                })}
              </div>
            </div>
            {/* pagination section */}
            <Pagination />
          </div>

          {/* sidebar section */}
          <div className="col-lg-4">
            <StickyBox offsetTop={20} offsetBottom={20}>
              <Sidebar />
            </StickyBox>
          </div>
        </div>
      </div>
    </BlogListStyleWrapper>
  );
};

export default BlogList;
