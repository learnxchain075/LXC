/* eslint-disable react/prop-types */

import TitleStyleWrapper from './Title.style'
import { ReactNode } from "react";

interface TitleWithBadgeProps {
    children: ReactNode;
    badge: string;
}

const TitleWithBadge: React.FC<TitleWithBadgeProps> = ({ children, badge }) => {
    return (
        <TitleStyleWrapper>
            <div>
                <span>{badge}</span>
                <h1>{children}</h1>
            </div>
        </TitleStyleWrapper>
    )
}

export default TitleWithBadge