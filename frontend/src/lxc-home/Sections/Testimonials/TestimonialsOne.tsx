import { useEffect, useRef, useState } from "react";
import TestimonialsStyleWrapper from "./Testimonials.style";
import Slider from "react-slick";
import Data from "../../assets/data/TestimonialsOne";
import { FaHeart } from "react-icons/fa";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";

import testimonialShape1 from "../../assets/images/shape/testimonial-shape1.png";
import testimonialShape2 from "../../assets/images/shape/testimonial-shape2.png";
import testimonialShape3 from "../../assets/images/shape/testimonial-shape3.png";
import QuoteShapeImg from "../../assets/images/shape/quote-shape.svg";
import QuoteIconImg from "../../assets/images/shape/quote-icon.png";
import ScrollAnimate from "../../Components/ScrollAnimate";

const TestimonialsOne = () => {
  const [nav1, setNav1] = useState(null);
  const [nav2, setNav2] = useState(null);
  let sliderRef1 = useRef(null);
  let sliderRef2 = useRef(null);

  useEffect(() => {
    setNav1(sliderRef1);
    setNav2(sliderRef2);
  }, []);

  const [currentSlide, setCurrentSlide] = useState(0);

  const settingsFor = {
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    fade: false,
    autoplay: true,
    speed: 500,
    autoplaySpeed: 6000,
    infinite: true,
    pauseOnHover: false,
    pauseOnFocus: false,
    afterChange: (current) => setCurrentSlide(current),
  };

  const settingsNav = {
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    infinite: true,
    pauseOnHover: false,
    pauseOnFocus: false,
  };

  const handleSliderLeft = () => {
    sliderRef1.slickPrev();
  };

  const handleSliderRight = () => {
    sliderRef1.slickNext();
  };

  const CustomSliderInfo = () => {
    return (
      <div className="slider-info">
        <button className="slider-arrow left" onClick={handleSliderLeft}>
          <FaArrowLeftLong />
        </button>

        <div className="slider-counter">
          <p>{currentSlide + 1}/5</p>
        </div>

        <button className="slider-arrow right" onClick={handleSliderRight}>
          <FaArrowRightLong />
        </button>
      </div>
    );
  };

  const testimonialRef = useRef(null);
  const rotateIconRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!testimonialRef.current || !rotateIconRef.current) return;

      const y = window.scrollY;
      const x = testimonialRef.current.offsetTop - 400;

      let animationValue = (y - x) / 4;
      const animationStop = 45;

      animationValue = Math.max(0, Math.min(animationValue, animationStop));

      rotateIconRef.current.style.transform =
        y > x
          ? `rotate(-${animationValue}deg)`
          : `rotate(${animationValue}deg)`;
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <TestimonialsStyleWrapper ref={testimonialRef}>
      <div className="container">
        <ScrollAnimate delay={250}>
          <div className="row">
            <div className="col-md-12">
              <div className="testimonial-card">
                <div className="testimonial-card-left">
                  <div className="bg-shape">
                    <div className="shape-img img-1">
                      <ScrollAnimate delay={200}>
                        <img src={testimonialShape1} alt="shape-img" />
                      </ScrollAnimate>
                    </div>
                    <div className="shape-img img-2">
                      <ScrollAnimate delay={220}>
                        <img src={testimonialShape2} alt="shape-img" />
                      </ScrollAnimate>
                    </div>
                    <div className="shape-img img-3">
                      <ScrollAnimate delay={240}>
                        <img src={testimonialShape3} alt="shape-img" />
                      </ScrollAnimate>
                    </div>
                    <div className="shape-img img-4">
                      <img
                        className="rotate-icon"
                        src={QuoteShapeImg}
                        alt="shape-img"
                        ref={rotateIconRef}
                      />
                      <div className="icon">
                        <img src={QuoteIconImg} alt="shape-img" />
                      </div>
                    </div>
                  </div>

                  <Slider
                    {...settingsNav}
                    className="testimonial-slider-nav"
                    asNavFor={nav1}
                    ref={(slider) => (sliderRef2 = slider)}
                  >
                    {Data?.map((item, i) => (
                      <div className="slider-item" key={i}>
                        <img src={item.image} alt="slider-img" />
                      </div>
                    ))}
                  </Slider>
                </div>

                <div className="testimonial-card-right">
                  <ScrollAnimate delay={250}>
                    <div className="section-title">
                      <span className="sub-title">Testimonials</span>
                      <h2 className="title white-color love-icon">
                        We
                        <FaHeart />
                        Feedback
                      </h2>
                    </div>
                  </ScrollAnimate>

                  <ScrollAnimate delay={300}>
                    <Slider
                      {...settingsFor}
                      className="testimonial-slider-for"
                      asNavFor={nav2}
                      ref={(slider) => (sliderRef1 = slider)}
                    >
                      {Data?.map((item, i) => (
                        <div className="slider-item" key={i}>
                          <p>{item.review}</p>
                          <div className="slider-item-user">
                            <div className="author-info">
                              <span className="name">{item.name},</span>
                              <span className="duration">
                                {item.designation}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </Slider>

                    {<CustomSliderInfo />}
                  </ScrollAnimate>
                </div>
              </div>
            </div>
          </div>
        </ScrollAnimate>
      </div>
    </TestimonialsStyleWrapper>
  );
};

export default TestimonialsOne;
