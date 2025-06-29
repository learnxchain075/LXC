import { useEffect, useRef, useState } from "react";
import Slider, { Settings } from "react-slick";
import UsabilitySliderStyleWrapper from "./UsabilitySlider.style";

import Img1 from "../../../assets/images/main-demo/1.png";
import Img2 from "../../../assets/images/main-demo/2.png";
import Img3 from "../../../assets/images/main-demo/3.png";
import EmojiHappyIcon from "../../../assets/images/main-demo/emoji-happy.png";
import PetIcon from "../../../assets/images/main-demo/pet.png";
import MouseCircleIcon from "../../../assets/images/main-demo/mouse-circle.png";
import Shape1Img from "../../../assets/images/main-demo/shape1.png";
import Shape2Img from "../../../assets/images/main-demo/shape2.png";
import ScrollAnimate from "../../../Components/ScrollAnimate";

interface Slide {
  imgSrc: string;
  alt: string;
  iconSrc: string;
  title: string;
}

const UsabilitySlider: React.FC = () => {
  const slides: Slide[] = [
    {
      imgSrc: Img1,
      alt: "usability-img 1",
      iconSrc: EmojiHappyIcon,
      title: "Easy to use",
    },
    {
      imgSrc: Img2,
      alt: "usability-img 2",
      iconSrc: PetIcon,
      title: "Collaborative",
    },
    {
      imgSrc: Img3,
      alt: "usability-img 3",
      iconSrc: MouseCircleIcon,
      title: "Activity Stream",
    },
  ];

  const settingsFor: Settings = {
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
  };

  const settingsNav: Settings = {
    slidesToShow: 3,
    slidesToScroll: 1,
    dots: true,
    centerMode: false,
    focusOnSelect: true,
    arrows: false,
    infinite: false,
    swipeToSlide: true,
  };

  const [nav1, setNav1] = useState<Slider | null>(null);
  const [nav2, setNav2] = useState<Slider | null>(null);
  const sliderRef1 = useRef<Slider | null>(null);
  const sliderRef2 = useRef<Slider | null>(null);

  useEffect(() => {
    setNav1(sliderRef1.current);
    setNav2(sliderRef2.current);
  }, []);

  return (
    <UsabilitySliderStyleWrapper className="usability-section md-pb-0">
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="usability-card">
              <div className="bg-shape">
                <div className="shape-img img-1">
                  <img src={Shape1Img} alt="shape-img" />
                </div>
                <div className="shape-img img-2">
                  <img src={Shape2Img} alt="shape-img" />
                </div>
              </div>

              <ScrollAnimate delay={200}>
                <div className="section-title text-center md-mb-40">
                  <h2 className="white-color">
                    We made it superb
                    <br />& usability
                  </h2>
                </div>
              </ScrollAnimate>

              <ScrollAnimate delay={250}>
                <Slider
                  className="usability-slider-nav"
                  asNavFor={nav1}
                  ref={(slider) => (sliderRef2.current = slider)}
                  {...settingsNav}
                >
                  {slides.map((slide, index) => (
                    <div className="slider-item" key={index}>
                      <img src={slide.iconSrc} alt="icon" />
                      <span className="slider-item-text">{slide.title}</span>
                    </div>
                  ))}
                </Slider>
              </ScrollAnimate>

              <ScrollAnimate delay={300}>
                <Slider
                  className="usability-slider-for"
                  asNavFor={nav2}
                  ref={(slider) => (sliderRef1.current = slider)}
                  {...settingsFor}
                >
                  {slides.map((slide, index) => (
                    <div className="slider-item" key={index}>
                      <img src={slide.imgSrc} alt={slide.alt} />
                    </div>
                  ))}
                </Slider>
              </ScrollAnimate>
            </div>
          </div>
        </div>
      </div>
    </UsabilitySliderStyleWrapper>
  );
};

export default UsabilitySlider;