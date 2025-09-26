import { Label } from "@/components";
import React from "react";

interface InfoLabelProps {
  children: React.ReactNode;
}

const InfoLabel: React.FC<InfoLabelProps> = ({ children }) => {
  // If children is a string, split and render with line breaking
  if (typeof children === "string") {
    const contentLines = children.split(". ");
    return (
      <div className="space-y-4 overflow-y-auto max-h-[60vh] pt-1 pb-3">
        {contentLines.map((content, index) => (
          <Label
            key={index}
            label={`${content}${contentLines.length - 1 === index ? (content[content.length - 1] === "." ? "" : ".") : "."}`}
            className="!text-sm"
          />
        ))}
      </div>
    );
  }

  // For ReactNode content, we need to reconstruct the text and split properly
  const reconstructAndSplit = (nodes: React.ReactNode[]): React.ReactNode[] => {
    const result: React.ReactNode[] = [];
    let currentLine: React.ReactNode[] = [];

    const processNode = (node: React.ReactNode) => {
      if (typeof node === "string") {
        const parts = node.split(". ");
        parts.forEach((part, index) => {
          if (index === 0) {
            // First part goes to current line
            currentLine.push(part);
          } else {
            // Subsequent parts start new lines
            if (currentLine.length > 0) {
              // Ensure the line ends with a period
              const lineWithPeriod = [...currentLine];
              const lastElement = lineWithPeriod[lineWithPeriod.length - 1];
              if (typeof lastElement === "string" && !lastElement.endsWith(".")) {
                lineWithPeriod[lineWithPeriod.length - 1] = lastElement + ".";
              }
              result.push(
                <div
                  key={result.length}
                  className="!text-sm text-neutral font-montserrat font-normal leading-none"
                >
                  {lineWithPeriod}
                </div>,
              );
            }
            currentLine = [part];
          }
        });
      } else {
        // React elements (like Link) stay in current line
        currentLine.push(node);
      }
    };

    nodes.forEach(processNode);

    // Add the last line if it has content
    if (currentLine.length > 0) {
      // Ensure the last line ends with a period
      const lineWithPeriod = [...currentLine];
      const lastElement = lineWithPeriod[lineWithPeriod.length - 1];
      if (typeof lastElement === "string" && !lastElement.endsWith(".")) {
        lineWithPeriod[lineWithPeriod.length - 1] = lastElement + ".";
      }
      result.push(
        <div
          key={result.length}
          className="!text-sm text-neutral font-montserrat font-normal leading-none"
        >
          {lineWithPeriod}
        </div>,
      );
    }

    return result;
  };

  const processedContent = reconstructAndSplit(React.Children.toArray(children));

  return <div className="space-y-4 overflow-y-auto max-h-[60vh] pt-1 pb-3">{processedContent}</div>;
};
export default InfoLabel;
