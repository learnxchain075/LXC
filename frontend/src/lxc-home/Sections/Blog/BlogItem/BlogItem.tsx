import { NavLink } from "react-router-dom";
import BlogItemStyleWrapper from "./BlogItem.style";
import { GoArrowRight } from "react-icons/go";
import ScrollAnimate from "../../../Components/ScrollAnimate";

const BlogItem = ({ thumbnail, category, date, title, details, delay }) => {
  return (

    <ScrollAnimate delay={delay}>
      <BlogItemStyleWrapper>
        <NavLink to="/blog-details" className="letest-blog-img">
          <img src={thumbnail} alt="post thumbnail" />
        </NavLink>
        <div className="letest-blog-info">
          <div className="letest-blog-info-inner">
            <h5>
              <span>{category}</span> . {date}
            </h5>
            <h4>
              <NavLink to="/blog-details">{title}</NavLink>
            </h4>
            <p>{details}</p>
            <NavLink to="/blog-details" className="text-link">
              <span>Read More</span>
              <GoArrowRight />
            </NavLink>
          </div>
        </div>
      </BlogItemStyleWrapper>
    </ScrollAnimate>
  );
};

export default BlogItem;
