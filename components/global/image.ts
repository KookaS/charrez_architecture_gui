import Styled from "styled-components";

export const ImageProjectGridContainer = Styled.div`
    height: auto;
    width: 100%;
    grid-template-columns: auto;
    grid-template-rows: auto;
    
    @media only screen and (min-width: 300px) {
        /* For Phones: */
        display: grid-inline;
    }
    
    @media only screen and (min-width: 600px) {
        /* For Desktop: */
        display: grid;
    }
`;

export const ImageProjectGridElement = Styled.div`
    width: 100%;
    height: 500px;
    z-index: 10;
    grid-area: ${props => props.theme.row} / ${props => props.theme.column} / ${props => props.theme.row + 1} / ${props => props.theme.column + 1};
    background-size: cover;
    background-position: center;
    justify-self: center;
    
    :hover {
        opacity: 0.4;
        transition: .3s ease-out;
    
        @media only screen and (min-width: 600px) {
            /* For Desktop: */
            z-index: 9;
            width: 110%;
        }
    }
`;

export const ImageBackground = Styled.div`
    width: 100%;
    height: 100%;
    background-size: cover;
`;