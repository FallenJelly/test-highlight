import styled from "styled-components";

interface RemoveHighlightButtonProps {
    color: string;
}

export const RemoveHighlightButton = styled.button<RemoveHighlightButtonProps>`
    background-color: ${props => props.color};
    color: ${props => isLightColor(props.color) ? 'black' : 'white'};
    border: none;
    padding: 5px 10px;
    margin: 5px;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
        opacity: 0.8;
    }
`;

const isLightColor = (color: string) => {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return brightness > 155;
}