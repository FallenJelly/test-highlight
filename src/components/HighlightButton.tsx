import React from "react";
import styled from "styled-components";

const HighlightButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
    return (
        <StyledButton onClick={onClick}>
            Highlight
        </StyledButton>
    )
}

const StyledButton = styled.button`
    background: black;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 5px 10px;
    cursor: pointer;
`

export default HighlightButton;