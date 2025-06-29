import { ReactNode } from "react";
import TitleStyleWrapper from "./Title.style";

interface TitleComponentProps {
  children: ReactNode;
}

const TitleComponent: React.FC<TitleComponentProps> = ({ children }) => {
  return (
    <TitleStyleWrapper>
      <div className={children.parentClass}>
        <span className="sub-title">{children.subtitle}</span>
        <h2 className="title">{children.title}</h2>
      </div>
    </TitleStyleWrapper>
  );
};

export default TitleComponent;
