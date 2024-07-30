import styled, { DefaultTheme } from "styled-components";

export const PageHome = styled.div<{ theme : DefaultTheme }>`
    width: 100%;
    gap: 10px;
    display: flex;
    align-items: center;
    padding: 10px 1.5rem;

    @media( max-width: ${props => props.theme.laptop}) {
        display: block;
    }
    @media( max-width: ${props => props.theme.tablet}) {
        flex-direction: column;
    }
    @media( max-width: ${props => props.theme.mobile}) {
        flex-direction: column;
    }
`

export const Container = styled.div`
    font-family: Arial, sans-serif;
    max-width: 600px;
    width: 50%
    padding: 0 2rem;
    margin: 20px auto;
    text-align: left;

    img {
        border-radius: 10px;
        max-width: 600px;
        width: 50;
    }

    @media( max-width: ${props => props.theme.tablet}) {
        max-width: 700px;
        padding: 5px 2rem;
    }
`;

export const SearchInput = styled.input<{ theme: DefaultTheme }>`
    width: 80%;
    padding: 10px;
    margin-bottom: 20px;
    border-radius: 5px;
    font-size: ${props => props.theme.fontsize};
    border: 2px solid ${props => props.theme.primaryColor};
`;

export const HighlightedText = styled.div<{ theme: DefaultTheme }>`
    font-size: ${props => props.theme.fontSize};
    line-height: 1.6;
    padding: 0;
    position: relative;
    white-space: pre-wrap;
    word-wrap: break-word;
    user-select: text;

    .highlight {
        background-color: ${props => props.theme.highlightColor};
        font-weight: bold;
    }

    .custom-highlight {
        position: absolute;
        opacity: 0.5;
        pointer-event: none;
    }

    @media( max-width: ${props => props.theme.tablet}) {
        padding: 5px 0;
    }
`;

export const ControlPanel = styled.div`
    margin-bottom: 20px;
    display: flex;
    gap: 10px;
`;

export const Button = styled.button`
    padding: 5px 10px;
    background-color: ${props => props.theme.primaryColor};
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
`;

export const ColorPicker = styled.input`
    height: 30px;
`;