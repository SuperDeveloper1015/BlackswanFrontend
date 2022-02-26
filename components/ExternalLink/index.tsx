import React, { HTMLProps, useCallback } from "react";

import { classNames } from "../../functions/styling";

const COLOR = {
  default: "text-primary hover:text-high-emphesis focus:text-high-emphesis",
  blue: "text-blue opacity-80 hover:opacity-100 focus:opacity-100",
};

function ExternalLink({
  target = "_blank",
  href,
  children,
  rel = "noopener noreferrer",
  className = "",
  color = "default",
  startIcon = undefined,
  endIcon = undefined,
  ...rest
}: Omit<HTMLProps<HTMLAnchorElement>, "as" | "ref" | "onClick"> & {
  href: string;
  startIcon?: JSX.Element;
  endIcon?: JSX.Element;
}): JSX.Element {
  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      // don't prevent default, don't redirect if it's a new tab
      if (target === "_blank" || event.ctrlKey || event.metaKey) {
      } else {
        event.preventDefault();
        // send a ReactGA event and then trigger a location change
      }
    },
    [href, target]
  );

  return (
    <a
      target={target}
      rel={rel}
      href={href}
      onClick={handleClick}
      className={classNames(
        "text-baseline whitespace-nowrap",
        COLOR[color],
        (startIcon || endIcon) && "space-x-1 flex items-center justify-center",
        className
      )}
      {...rest}
    >
      {startIcon && startIcon}
      {children}
      {endIcon && endIcon}
    </a>
  );
}

export default ExternalLink;
