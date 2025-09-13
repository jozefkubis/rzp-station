export function ShiftsTableLegend() {
  return (
    <div className="text-sm text-gray-600">
      <h3 className="mb-2 font-semibold">Legenda skratiek:</h3>
      <div className="flex gap-8">
        <ul className="list-inside list-disc space-y-1">
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
            <div className="h-[1.3rem] w-[1.3rem] bg-primary-100"></div> –
            dnešný deň
          </li>
          <li className="flex gap-2">
            <div className="h-[1.3rem] w-[1.3rem] bg-holiday"></div> – štátny
            sviatok
          </li>
          <li className="flex gap-2">
            <div className="h-[1.3rem] w-[1.3rem] bg-amber-100"></div> – weekend
          </li>
        </ul>
      </div>
    </div>
  );
}
