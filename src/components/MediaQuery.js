import React from "react";
import { useMediaQuery } from "react-responsive";

const Mobile = function ({ children }) {
  const isMobile = useMediaQuery({
    query: "(max-width:767px)",
  });
  return <React.Fragment>{isMobile && children}</React.Fragment>;
};

const PC = function ({ children }) {
  const isPc = useMediaQuery({
    query: "(min-width:768px) ",
  });
  return <React.Fragment>{isPc && children}</React.Fragment>;
};

export { Mobile, PC };
