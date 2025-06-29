import SidebarStyleWrapper from "./Sidebar.style";
import CategoriesData from "../../../assets/data/blog/categories";
import RecentpostsData from "../../../assets/data/blog/recentPost";
import TagsData from "../../../assets/data/blog/tags";
import SerachIcon from "../../../assets/images/icons/search-icon.svg";
import { NavLink } from "react-router-dom";
import ScrollAnimate from "../../../Components/ScrollAnimate";

const Sidebar = () => {
  return (
    <SidebarStyleWrapper>
      <ScrollAnimate>
        <div className="letest-blog-card">
          {/* search */}
          <div className="letest-blog-search-section">
            <form action="/" method="post">
              <input
                type="search"
                name="post-search"
                id="post-search"
                placeholder="Search here ..."
              />
              <button>
                <img src={SerachIcon} alt="Search" />
              </button>
            </form>
          </div>

          {/* Categories */}
          <ScrollAnimate delay={200}>
            <div className="categories-list">
              <h4 className="letest-blog-catd-title">Categories</h4>
              <ul>
                {CategoriesData?.map((category) => (
                  <li key={category.id}>
                    <NavLink to="/blog-details">{`${category.name} (${category.count})`}</NavLink>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollAnimate>

          {/* Recent post */}
          <ScrollAnimate delay={250}>
            <div className="recent-post-section">
              <h4 className="letest-blog-catd-title">Recent Post</h4>
              <ul>
                {RecentpostsData?.map((post) => (
                  <li key={post.id}>
                    <NavLink to="/blog-details" className="recent-post-img">
                      <img src={post.thumbnail} alt="post thumbnail" />
                    </NavLink>
                    <div className="recent-post-text">
                      <h6>{post.date}</h6>
                      <h5>
                        <NavLink to="/blog-details">{post.title}</NavLink>
                      </h5>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollAnimate>

          {/* Post Tags */}
          <ScrollAnimate delay={250}>
            <div className="post-tags-section">
              <h4 className="letest-blog-catd-title">Post Tags</h4>
              <ul>
                {TagsData?.map((tag, i) => (
                  <li key={i}>
                    <NavLink to="/blog-details">{tag}</NavLink>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollAnimate>
        </div>
      </ScrollAnimate>
    </SidebarStyleWrapper>
  );
};

export default Sidebar;
