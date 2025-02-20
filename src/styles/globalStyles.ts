import { createGlobalStyle, DefaultTheme } from 'styled-components';
import { Theme } from './theme';

export const GlobalStyles = createGlobalStyle<{ theme: Theme }>`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-size: 16px;
    scroll-behavior: smooth;
  }

  body {
    font-family: ${props => props.theme.typography.fontFamily.primary};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.text};
    line-height: ${props => props.theme.typography.lineHeight.normal};
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: ${props => props.theme.typography.fontFamily.heading};
    font-weight: ${props => props.theme.typography.fontWeight.bold};
    line-height: ${props => props.theme.typography.lineHeight.tight};
    color: ${props => props.theme.colors.text};
    margin-bottom: ${props => props.theme.spacing.md};
  }

  p {
    margin-bottom: ${props => props.theme.spacing.md};
    line-height: ${props => props.theme.typography.lineHeight.relaxed};
  }

  a {
    text-decoration: none;
    color: ${props => props.theme.colors.primary};
    transition: ${props => props.theme.transition.default};

    &:hover {
      color: ${props => props.theme.colors.accent};
    }
  }

  button {
    border: none;
    background: none;
    cursor: pointer;
    font-family: inherit;
    transition: ${props => props.theme.transition.default};

    &:disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }
  }

  ul, ol {
    list-style: none;
    margin-bottom: ${props => props.theme.spacing.md};
  }

  img {
    max-width: 100%;
    height: auto;
    display: block;
  }

  input, textarea, select {
    font-family: inherit;
    font-size: ${props => props.theme.fontSizes.medium};
    padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
    border: 1px solid ${props => props.theme.colors.border};
    border-radius: ${props => props.theme.borderRadius.medium};
    background-color: ${props => props.theme.colors.background};
    transition: ${props => props.theme.transition.default};

    &:focus {
      outline: none;
      border-color: ${props => props.theme.colors.primary};
      box-shadow: 0 0 0 2px ${props => props.theme.colors.primary}25;
    }
  }

  ::selection {
    background-color: ${props => props.theme.colors.primary}25;
    color: ${props => props.theme.colors.primary};
  }

  .container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 ${props => props.theme.spacing.md};
  }

  .card {
    background: ${props => props.theme.colors.cardBg};
    border-radius: ${props => props.theme.borderRadius.medium};
    box-shadow: ${props => props.theme.shadows.medium};
    transition: ${props => props.theme.transition.default};

    &:hover {
      transform: translateY(-2px);
      box-shadow: ${props => props.theme.shadows.large};
    }
  }
`;