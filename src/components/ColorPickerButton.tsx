import React from "react";
import styled from "styled-components";

const ColorPickerButton: React.FC<{
    currentColor: string,
    onColorChange: (color: string) => void
}> = ({ currentColor, onColorChange}) => {
    return (
        <StyledColorPicker
            type="color"
            value={currentColor}
            onChange={(e) => onColorChange(e.target.value)}
        />
    )
}

const StyledColorPicker = styled.input.attrs({ type: 'color' })`
    width: 30px;
    height: 30px;
    padding: 0
    border: none;
    cursor: pointer;
`

export default ColorPickerButton;