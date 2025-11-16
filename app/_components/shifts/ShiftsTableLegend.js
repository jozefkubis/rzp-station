export function ShiftsTableLegend() {
  return (
    <div className="text-[0.6rem] text-gray-600 2xl:text-sm">
      <h3 className="mb-2 font-semibold">Legenda skratiek:</h3>
      <div className="flex justify-between 2xl:gap-8">
        <ul className="grid list-inside list-disc space-y-1 sm:grid-cols-4 sm:items-center sm:gap-x-3 sm:gap-y-1 sm:space-y-0 lg:grid-cols-1">
          <li>
            <strong>ÚV</strong> – úväzok
          </li>
          <li>
            <strong>SH</strong> – spolu hodín
          </li>
          <li>
            <strong>D</strong> – denná služba
          </li>
          <li>
            <strong>N</strong> – nočná služba
          </li>
          <li>
            <strong>RD</strong> – riadna dovolenka
          </li>
          <li>
            <strong>PN</strong> – práceneschopnosť
          </li>
          <li>
            <strong>NČ</strong> – nadčas
          </li>
          <li>
            <strong>PS</strong> – počet služieb
          </li>
        </ul>

        <ul className="list-inside list-disc space-y-1">
          <li className="flex gap-2">
            <div className="h-[1rem] w-[1rem] bg-primary-100 2xl:h-[1.3rem] 2xl:w-[1.3rem]"></div>{" "}
            – dnešný deň
          </li>
          <li className="flex gap-2">
            <div className="h-[1rem] w-[1rem] bg-holiday 2xl:h-[1.3rem] 2xl:w-[1.3rem]"></div>{" "}
            – štátny sviatok
          </li>
          <li className="flex gap-2">
            <div className="h-[1rem] w-[1rem] bg-amber-100 2xl:h-[1.3rem] 2xl:w-[1.3rem]"></div>{" "}
            – weekend
          </li>
        </ul>
      </div>
    </div>
  );
}
