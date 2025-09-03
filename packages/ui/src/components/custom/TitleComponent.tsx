import React from "react";

interface TitleComponentProps {
  label: string;
  title: string;
  leftIcon: React.ReactNode;
  secondaryTitle: string;
}

const TitleComponent: React.FC<TitleComponentProps> = ({
  label,
  title,
  leftIcon,
  secondaryTitle,
}) => {
  return (
    <div className="flex flex-col gap-2 mb-8 mt-4">
      <label className="block font-montserrat font-normal text-sm leading-none text-[#BDBDBD] w-[400px] h-[17px]">
        {label}
      </label>
      <div className="flex items-center gap-3">
        {leftIcon}
        <h4 className="font-montserrat font-bold text-xl leading-none text-[#F7FEE7]">{title}</h4>
        <span className="font-montserrat font-large text-base leading-none text-[#F7FEE7]">
          ({secondaryTitle})
        </span>
      </div>
    </div>
  );
};

export default TitleComponent;
