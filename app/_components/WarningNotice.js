import { FaSkullCrossbones } from "react-icons/fa";
// import { GiRadioactive } from "react-icons/gi";


function WarningNotice() {
    return (
        <div className="flex flex-col items-center justify-center">
            <FaSkullCrossbones className="text-white bg-primary-700 rounded-full ring-[6px] ring-red-500 p-2 motion-rotate-in-[0.5turn]" size={90} />
            {/* <GiRadioactive className="bg-yellow-400 rounded-full ring-4 ring-black" size={100} /> */}
            <h1 className="mt-6 text-3xl font-semibold text-primary-700">
                Do vybranej zložky má prístup iba admin!
            </h1>
        </div>

    );
}

export default WarningNotice;