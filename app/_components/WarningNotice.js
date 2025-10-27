import { FaSkullCrossbones } from "react-icons/fa";
// import { GiRadioactive } from "react-icons/gi";

function WarningNotice() {
  return (
    <div className="flex flex-col items-center justify-center">
      <FaSkullCrossbones
        className="rounded-full bg-primary-700 p-2 text-5xl text-white ring-[4px] ring-red-500 motion-rotate-in-[0.5turn] md:text-8xl md:ring-[6px]"
        // size={90}
      />
      {/* <GiRadioactive className="bg-yellow-400 rounded-full ring-4 ring-black" size={100} /> */}
      <h1 className="mt-3 text-center text-base font-semibold text-primary-700 md:mt-6 md:text-3xl">
        Do vybranej zložky má prístup iba admin!
      </h1>
    </div>
  );
}

export default WarningNotice;
