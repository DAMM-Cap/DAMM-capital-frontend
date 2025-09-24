import { Label } from "../index";

function BrandHeader() {
  return (
    <div className="flex flex-row items-center gap-2 max-w-[8rem] h-[2rem]">
      {/* Image Container */}
      <div className="flex items-center justify-center h-[2rem] w-[2rem]">
        <img
          src="/Damm_Capital_Isotipo_Fondo Oscuro.svg"
          alt="Damm Capital"
          className="max-w-[2rem] max-h-[2rem] h-full w-full object-contain"
        />
      </div>
      {/* Text Container */}
      <div className="flex flex-col h-[2rem] mt-1.5">
        <Label
          label="DAMM"
          className="[&_label]:text-[1.075rem] [&_label]:text-textLight [&_label]:font-black [&_label]:font-[950] [&_label]:text-center [&_label]:tracking-[0.24em] [&_label]:leading-none [&_label]:m-0 [&_label]:drop-shadow-sm [&_div]:w-auto"
        />
        <Label
          label="CAPITAL"
          className="[&_label]:text-[0.525rem] [&_label]:text-textLight [&_label]:text-justify [&_label]:tracking-[0.65em] [&_label]:leading-none [&_label]:m-0 [&_label]:w-full [&_div]:w-full [&_label]:ml-0.5 [&_label]:mt-1.0"
        />
      </div>
    </div>
  );
}

export default BrandHeader;
