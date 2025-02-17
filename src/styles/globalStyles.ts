import { createGlobalStyle } from 'styled-components';
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
    font-family: ${({ theme }) => theme.typography.fontFamily.primary};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    line-height: ${({ theme }) => theme.typography.lineHeight.normal};
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: ${({ theme }) => theme.typography.fontFamily.heading};
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    line-height: ${({ theme }) => theme.typography.lineHeight.tight};
    color: ${({ theme }) => theme.colors.text};
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }

  p {
    margin-bottom: ${({ theme }) => theme.spacing.md};
    line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
  }

  a {
    text-decoration: none;
    color: ${({ theme }) => theme.colors.primary};
    transition: ${({ theme }) => theme.transition.default};

    &:hover {
      color: ${({ theme }) => theme.colors.accent};
    }
  }

  button {
    border: none;
    background: none;
    cursor: pointer;
    font-family: inherit;
    transition: ${({ theme }) => theme.transition.default};

    &:disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }
  }

  ul, ol {
    list-style: none;
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }

  img {
    max-width: 100%;
    height: auto;
    display: block;
  }

  input, textarea, select {
    font-family: inherit;
    font-size: ${({ theme }) => theme.fontSizes.medium};
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.borderRadius.medium};
    background-color: ${({ theme }) => theme.colors.background};
    transition: ${({ theme }) => theme.transition.default};

    &:focus {
      outline: none;
      border-color: ${({ theme }) => theme.colors.primary};
      box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}25;
    }
  }

  ::selection {
    background-color: ${({ theme }) => theme.colors.primary}25;
    color: ${({ theme }) => theme.colors.primary};
  }

  .container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 ${({ theme }) => theme.spacing.md};
  }

  .card {
    background: ${({ theme }) => theme.colors.cardBg};
    border-radius: ${({ theme }) => theme.borderRadius.medium};
    box-shadow: ${({ theme }) => theme.shadows.medium};
    transition: ${({ theme }) => theme.transition.default};

    &:hover {
      transform: translateY(-2px);
      box-shadow: ${({ theme }) => theme.shadows.large};
    }
  }
`;