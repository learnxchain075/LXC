import BlogDetailsStyleWrapper from "./BlogDetails.style";
import StickyBox from "react-sticky-box";
import Sidebar from "../Sidebar/Sidebar";
import Comments from "../Comments/Comments";

import ShapeIcon1 from "../../../assets/images/shape/breadcrumb-shape1.svg";
import ShapeIcon2 from "../../../assets/images/shape/breadcrumb-shape2.svg";
import ShareIcon from "../../../assets/images/icons/share-icon.svg";
import PrevImg from "../../../assets/images/blog/blog-prev-img.png";
import NextImg from "../../../assets/images/blog/blog-next-img.png";

import BlogDetailsImg from "../../../assets/images/blog/blog-details-img.png";
import ProfileImg from "../../../assets/images/icons/icon_profile.svg";
import CategoryImg from "../../../assets/images/icons/icon_category.svg";
import CalendarImg from "../../../assets/images/icons/icon_calendar.svg";
import QuotationImg from "../../../assets/images/icons/quotation.svg";
import BlogDetailsSubImg1 from "../../../assets/images/blog/blog-details-sub-img1.png";
import BlogDetailsSubImg2 from "../../../assets/images/blog/blog-details-sub-img2.png";
import { NavLink } from "react-router-dom";
import ScrollAnimate from "../../../Components/ScrollAnimate";

const BlogDetails = () => {
  return (
    <BlogDetailsStyleWrapper>
      {/* breadcrumb section */}
      <section className="breadcrumb-section blog-details-breadcrumb-section">
        <div className="bg-shape">
          <div className="shape-img img-1">
            <ScrollAnimate><img src={ShapeIcon1} alt="shape" /></ScrollAnimate>
          </div>
          <div className="shape-img img-2">
            <ScrollAnimate><img src={ShapeIcon2} alt="shape" /></ScrollAnimate>
          </div>
        </div>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-12">
              <ScrollAnimate>
                <div className="breadcrumb-content">
                  <nav aria-label="breadcrumb">
                    <ul className="breadcrumb breadcrumb-list">
                      <li className="breadcrumb-item">
                        <NavLink to="/">Home</NavLink>
                      </li>
                      <li className="breadcrumb-item">
                        <NavLink to="/blog">Latest Blogs</NavLink>
                      </li>
                      <li className="breadcrumb-item active">Blog Details</li>
                    </ul>
                  </nav>
                  <div className="breadcrumb-sec">
                    <h1 className="breadcrumb-title">
                      We are launching the Great <br />
                      Invoice solution
                    </h1>
                  </div>
                </div>
              </ScrollAnimate>
            </div>
          </div>
        </div>
      </section>

      {/* blog details section */}
      <section className="blog-details-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              {/* blog details content */}
              <div className="blog-details-content">
                <ScrollAnimate>
                  <div className="blog-details-img">
                    <img src={BlogDetailsImg} alt="img" />
                  </div>
                </ScrollAnimate>
                <div className="blog-details-inner">
                  <div className="blog-details-info-list">
                    <ScrollAnimate>
                      <ul>
                        <li>
                          <span>
                            <img src={ProfileImg} alt="icon" />
                          </span>
                          By - <NavLink to="#">Leo Martiz</NavLink>
                        </li>
                        <li>
                          <span>
                            <img src={CategoryImg} alt="icon" />
                          </span>
                          <NavLink to="#">Marketing</NavLink>
                        </li>
                        <li>
                          <span>
                            <img src={CalendarImg} alt="icon" />
                          </span>
                          23 Feb, 2022
                        </li>
                      </ul>
                    </ScrollAnimate>
                  </div>
                  <ScrollAnimate>
                    <p className="blog-details-headline">
                      Contrary to popular belief, Lorem Ipsum is not simply random
                      text. It has roots in a piece of classical Latin literature
                      from 45 BC, making it over 2000 years old. Richard
                      McClintock a Latin professor.
                    </p>
                  </ScrollAnimate>
                  <ScrollAnimate>
                    <p className="blog-text">
                      Contrary to popular belief, Lorem Ipsum is not simply random
                      text. It has roots in a piece of classical Latin literature
                      from 45 BC, making it over 2000 years old. Richard
                      McClintock, a Latin professor at Hampden-Sydney College
                      There are many variations of passages of Lorem Ipsum
                      available, but the majority have suffered alteration in some
                      form, by injected humour, or randomised words which don't
                      look even slightly believable.
                    </p>
                  </ScrollAnimate>
                  <ScrollAnimate>
                    <h5 className="blog-text-title mt-5">Grow your business</h5>
                  </ScrollAnimate>
                  <ScrollAnimate>
                    <p className="blog-text mb-4">
                      Richard McClintock, a Latin professor at Hampden-Sydney
                      College There are many variations of passages of available,
                      but the majority have suffered alteration in some form.
                    </p>
                  </ScrollAnimate>
                  <ScrollAnimate>
                    <p className="blog-text">
                      Injected humour, or randomised words which don't look even
                      slightly believable. If you are going to use a passage of
                      Lorem Ipsum, you need to be sure there isn't anything
                      embarrassing. making it over 2000 years old.
                    </p>
                  </ScrollAnimate>
                  <ScrollAnimate>
                    <div className="blog-quotation-section">
                      <div className="quotation-icon">
                        <img src={QuotationImg} alt="icon" />
                      </div>
                      <h4>
                        On the other hand, we denounce with righteous indignation
                        and dislike men who are so beguiled and demoralized by the
                        charms of pleasure.
                      </h4>
                    </div>
                  </ScrollAnimate>
                  <div className="row">
                    <div className="col-sm-6 mb-4">
                      <ScrollAnimate><img src={BlogDetailsSubImg1} alt="img" /></ScrollAnimate>
                    </div>
                    <div className="col-sm-6 mb-4">
                      <ScrollAnimate><img src={BlogDetailsSubImg2} alt="img" /></ScrollAnimate>
                    </div>
                  </div>
                  <ScrollAnimate>
                    <h5 className="blog-text-title mt-5">
                      Why you should take this plan
                    </h5>
                  </ScrollAnimate>
                  <ScrollAnimate>
                    <p className="blog-text">
                      Randomised words which don't look even slightly believable.
                      If you are going to use a passage of Lorem Ipsum, you need
                      to be sure there isn't anything embarrassing. making it over
                      2000 years old. have suffered alteration.
                    </p>
                  </ScrollAnimate>
                  <ScrollAnimate>
                    <ul className="blog-text-list">
                      <li>Unlimited meeting</li>
                      <li>Up to 500 Attendees</li>
                      <li>3 Hours limit</li>
                      <li>10 whiteboards</li>
                    </ul>
                  </ScrollAnimate>

                  <ScrollAnimate>
                    <div className="blog-tag-section">
                      {/* blog tags */}
                      <ul>
                        <li>
                          <NavLink to="#">seo</NavLink>
                        </li>
                        <li>
                          <NavLink to="#">marketing</NavLink>
                        </li>
                        <li>
                          <NavLink to="#">invoice</NavLink>
                        </li>
                        <li>
                          <NavLink to="#">payment</NavLink>
                        </li>
                      </ul>

                      {/* share button */}
                      <button>
                        <img src={ShareIcon} alt="icon" />
                        Share
                      </button>
                    </div>
                  </ScrollAnimate>
                </div>
              </div>

              {/* previous next blog */}
              <div className="blog-previous-next-section">
                <div className="row">
                  {/* previous blog link */}
                  <div className="col-sm-6">
                    <ScrollAnimate>
                      <div className="blog-card">
                        <a href="/blog-details" className="blog-card-img">
                          <img src={PrevImg} alt="img" />
                        </a>
                        <div className="blog-card-text">
                          <a href="/blog-details">Previous</a>
                          <h6>
                            <a href="/blog-details">
                              Inventory management trends made easy
                            </a>
                          </h6>
                        </div>
                      </div>
                    </ScrollAnimate>
                  </div>

                  {/* next blog link */}
                  <div className="col-sm-6">
                    <ScrollAnimate>
                      <div className="blog-card justify-right">
                        <a href="/blog-details" className="blog-card-img">
                          <img src={NextImg} alt="img" />
                        </a>
                        <div className="blog-card-text">
                          <a href="/blog-details">Next</a>
                          <h6>
                            <a href="/blog-details">
                              Make your website ranking in top ten
                            </a>
                          </h6>
                        </div>
                      </div>
                    </ScrollAnimate>
                  </div>
                </div>
              </div>

              {/* Comments section */}
              <Comments />
            </div>

            {/* sidebar section */}
            <div className="col-lg-4">
              <StickyBox offsetTop={20} offsetBottom={20}>
                <Sidebar />
              </StickyBox>
            </div>
          </div>
        </div>
      </section>
    </BlogDetailsStyleWrapper>
  );
};

export default BlogDetails;
