import React from "react";

interface LinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  target?: "_blank" | "_self" | "_parent" | "_top";
  rel?: string;
}

const Link: React.FC<LinkProps> = ({
  href,
  children,
  className = "",
  target = "_blank",
  rel = "noopener noreferrer",
}) => {
  return (
    <a
      href={href}
      target={target}
      rel={rel}
      className={`text-[#A3E635] hover:text-[#84CC16] underline ${className}`}
    >
      {children}
    </a>
  );
};

export default Link;
