// import { useState, useEffect, useRef, ReactNode } from "react";
// import styled, { css } from "styled-components";

// interface AnimatedWrapperProps {
//   animate: boolean;
//   delay: number;
// }

// const AnimatedWrapper = styled.div.withConfig({
//   shouldForwardProp: (prop) => prop !== "animate" && prop !== "delay",
// })<AnimatedWrapperProps>`
//   opacity: 0;
//   transform: translateY(48px);
//   transition: opacity 0.7s ease-out, transform 0.7s ease-out;
//   transition-delay: ${({ delay }) => delay}ms;

//   ${({ animate }) =>
//     animate &&
//     css`
//       opacity: 1;
//       transform: translateY(0);
//       animation: bounceInUp 0.7s ease-out;
//       animation-delay: ${({ delay }) => delay}ms;
//     `}

//   @keyframes bounceInUp {
//     0% {
//       transform: translateY(48px);
//     }
//     60% {
//       transform: translateY(-5px);
//     }
//     100% {
//       transform: translateY(0px);
//     }
//   }
// `;

// interface ScrollAnimateProps {
//   children: ReactNode;
//   delay?: number;
// }

// const ScrollAnimate: React.FC<ScrollAnimateProps> = ({ children, delay = 0 }) => {
//   const [isInView, setIsInView] = useState(false);
//   const ref = useRef<HTMLDivElement | null>(null);

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting) {
//           setIsInView(true);
//           observer.unobserve(entry.target);
//         }
//       },
//       { threshold: 0.2 }
//     );

//     if (ref.current) observer.observe(ref.current);

//     return () => {
//       if (ref.current) observer.unobserve(ref.current);
//     };
//   }, []);

//   return (
//     <AnimatedWrapper ref={ref} animate={isInView} delay={delay}>
//       {children}
//     </AnimatedWrapper>
//   );
// };

// export default ScrollAnimate;
import { useState, useEffect, useRef, ReactNode } from "react";
import styled, { css } from "styled-components";

interface AnimatedWrapperProps {
  animate: boolean;
  delay: number;
}

const AnimatedWrapper = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "animate" && prop !== "delay"
})<AnimatedWrapperProps>`
  opacity: 0;
  transform: translateY(48px);
  transition: opacity 0.7s ease-out, transform 0.7s ease-out;
  transition-delay: ${({ delay }) => delay}ms;

  ${({ animate }) =>
    animate &&
    css`
      opacity: 1;
      transform: translateY(0);
      animation: bounceInUp 0.7s ease-out;
      animation-delay: ${({ delay }) => delay}ms;
    `}

  @keyframes bounceInUp {
    0% {
      transform: translateY(48px);
    }
    60% {
      transform: translateY(-5px);
    }
    100% {
      transform: translateY(0px);
    }
  }
`;

interface ScrollAnimateProps {
  children: ReactNode;
  delay?: number;
}

const ScrollAnimate: React.FC<ScrollAnimateProps> = ({ children, delay = 0 }) => {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

 // console.log("ScrollAnimate: Component rendered, delay:", delay);

  useEffect(() => {
    console.log("ScrollAnimate: useEffect ran, setting up IntersectionObserver");
    const observer = new IntersectionObserver(
      ([entry]) => {
      //  console.log("ScrollAnimate: IntersectionObserver callback, isIntersecting:", entry.isIntersecting);
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2 }
    );

    if (ref.current) {
    //  console.log("ScrollAnimate: Observing element");
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
      //  console.log("ScrollAnimate: Cleaning up IntersectionObserver");
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return (
    <AnimatedWrapper ref={ref} animate={isInView} delay={delay}>
      {children}
    </AnimatedWrapper>
  );
};

export default ScrollAnimate;