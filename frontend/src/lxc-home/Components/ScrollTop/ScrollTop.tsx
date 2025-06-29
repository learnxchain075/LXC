// import { useEffect, useRef } from "react";
// import ScrollTopStyleWrapper from "./ScrollTop.style";
// import { FaArrowUp } from "react-icons/fa6";

// interface ScrollTopProps {
//   variant: string;
// }

// const ScrollTop: React.FC<ScrollTopProps> = ({ variant }) => {
//   const scrollTopCard = useRef(null);
//   const scrollTopPath = useRef(null);

//   useEffect(() => {
//     const handleScroll = () => {
//       const pathLength = scrollTopPath.current.getTotalLength();
//       const offset = 50;

//       scrollTopPath.current.style.transition = "none";
//       scrollTopPath.current.style.WebkitTransition = "none";
//       scrollTopPath.current.style.strokeDasharray =
//         pathLength + " " + pathLength;
//       scrollTopPath.current.style.strokeDashoffset = pathLength;
//       scrollTopPath.current.style.transition = "stroke-dashoffset 10ms linear";
//       scrollTopPath.current.style.WebkitTransition =
//         "stroke-dashoffset 10ms linear";

//       const scroll =
//         document.body.scrollTop || document.documentElement.scrollTop;
//       const height =
//         document.documentElement.scrollHeight -
//         document.documentElement.clientHeight;
//       const progress = pathLength - (scroll * pathLength) / height;
//       scrollTopPath.current.style.strokeDashoffset = progress;
//       const scrollElementPos =
//         document.body.scrollTop || document.documentElement.scrollTop;
//       if (scrollElementPos >= offset) {
//         scrollTopCard.current.classList.add("progress-done");
//       } else {
//         scrollTopCard.current.classList.remove("progress-done");
//       }
//     };

//     window.addEventListener("scroll", handleScroll);

//     return () => {
//       window.removeEventListener("scroll", handleScroll);
//     };
//   }, []);

//   const handleScrollToTop = (e) => {
//     e.preventDefault();
//     window.scroll({
//       top: 0,
//       left: 0,
//       behavior: "smooth",
//     });
//   };

//   return (
//     <ScrollTopStyleWrapper
//       ref={scrollTopCard}
//       className={`${variant}`}
//       onClick={handleScrollToTop}
//     >
//       <svg
//         className="progress-circle svg-content"
//         width="100%"
//         height="100%"
//         viewBox="-1 -1 102 102"
//       >
//         <path
//           ref={scrollTopPath}
//           d="M50,1 a49,49 0 0,1 0,98 a49,49 0 0,1 0,-98"
//         />
//       </svg>
//       <div className={`LearnXChain-scroll-top-icon ${variant}`}>
//         <FaArrowUp />
//       </div>
//     </ScrollTopStyleWrapper>
//   );
// };

// export default ScrollTop;
import { useEffect, useRef } from "react";
import ScrollTopStyleWrapper from "./ScrollTop.style";
import { FaArrowUp } from "react-icons/fa6";

interface ScrollTopProps {
  variant: string;
}

const ScrollTop: React.FC<ScrollTopProps> = ({ variant }) => {
  const scrollTopCard = useRef<HTMLDivElement>(null);
  const scrollTopPath = useRef<SVGPathElement>(null);
  const ticking = useRef(false);

  useEffect(() => {
    if (!scrollTopPath.current) return;
    const pathLength = scrollTopPath.current.getTotalLength();

    // Set strokeDasharray once (not every scroll)
    scrollTopPath.current.style.strokeDasharray = `${pathLength} ${pathLength}`;
    scrollTopPath.current.style.strokeDashoffset = `${pathLength}`;

    const offset = 50;

    const updateProgress = () => {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = pathLength - (scrollTop * pathLength) / scrollHeight;

      if (scrollTopPath.current) {
        scrollTopPath.current.style.strokeDashoffset = `${progress}`;
      }

      if (scrollTop >= offset) {
        scrollTopCard.current?.classList.add("progress-done");
      } else {
        scrollTopCard.current?.classList.remove("progress-done");
      }

      ticking.current = false;
    };

    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(updateProgress);
        ticking.current = true;
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleScrollToTop = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <ScrollTopStyleWrapper
      ref={scrollTopCard}
      className={`${variant}`}
      onClick={handleScrollToTop}
    >
      <svg
        className="progress-circle svg-content"
        width="100%"
        height="100%"
        viewBox="-1 -1 102 102"
      >
        <path
          ref={scrollTopPath}
          d="M50,1 a49,49 0 0,1 0,98 a49,49 0 0,1 0,-98"
        />
      </svg>
      <div className={`LearnXChain-scroll-top-icon ${variant}`}>
        <FaArrowUp />
      </div>
    </ScrollTopStyleWrapper>
  );
};

export default ScrollTop;
