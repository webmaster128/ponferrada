import { makeStyles, Theme } from "@material-ui/core";
import * as React from "react";

import ThemeProvider from "../../theme/MedulasThemeProvider";

interface Props {
  readonly children: React.ReactNode;
}

const globalStyles = makeStyles((theme: Theme) => ({
  "@global": {
    "*": {
      boxSizing: "inherit",
      WebkitFontSmoothing: "antialiased", // Antialiasing.
      MozOsxFontSmoothing: "grayscale", // Antialiasing.
    },
    "a:-webkit-any-link": {
      color: "inherit",
    },
    "*::before, *::after": {
      boxSizing: "inherit",
    },
    html: {
      fontSize: "62.5%",
    },
    body: {
      margin: "0",
      padding: "0",
      bottom: "0",
      top: "0",
      left: "0",
      right: "0",
      overflowX: "hidden",
      fontFamily: '"Muli", sans-serif',
      boxSizing: "border-box",
      backgroundColor: theme.palette.background.default,
      textRendering: "geometricPrecision",
      "-webkit-font-smoothing": "antialiased",
      "-moz-osx-font-smoothing": "grayscale",
    },
  },
}));

export const Storybook = ({ children }: Props): JSX.Element => (
  <ThemeProvider injectFonts injectStyles={globalStyles}>
    {children}
  </ThemeProvider>
);

export const medulasRoot = "Medulas React Components";
