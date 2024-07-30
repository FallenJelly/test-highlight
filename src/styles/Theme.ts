import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    primaryColor: string;
    highlightColor: string;
    fontSize: string;
    mobile: string;
    tablet: string;
    laptop: string;
  }
}

export const theme = {
  primaryColor: '#4a90e2',
  highlightColor: '#ffff00',
  fontSize: '18px',
  laptop: '1024px',
  tablet: '768px',
  mobile: '430px'
};