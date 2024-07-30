import React from "react";
import styled from "styled-components";
import HighlightButton from "./HighlightButton";
import ColorPickerButton from "./ColorPickerButton";

interface FloatingButtonProps {
    onHighlight: () => void;
    currentColor: string;
    onColorChange: (color: string) => void;
    top: number;
    left: number;
}

const FloatingHighlightButton: React.FC<FloatingButtonProps> = ({ 
    onHighlight, 
    currentColor, 
    onColorChange, 
    top, 
    left 
}) => {
    return (
        <FloatingButtonsContainer $top={top} $left={left}>
            <HighlightButton onClick={onHighlight} />
            <ColorPickerButton
                currentColor={currentColor}
                onColorChange={onColorChange}
            />
        </FloatingButtonsContainer>
    )
}

interface FloatingButtonsContainerProps {
    $top: number;
    $left: number;
}

const FloatingButtonsContainer = styled.div<FloatingButtonsContainerProps>`
    position: absolute;
    display: flex;
    gap: 10px;
    top: ${props => props.$top}px;
    left: ${props => props.$left}px;
    transform: translate(-50%, -100%);
`

export default FloatingHighlightButton;