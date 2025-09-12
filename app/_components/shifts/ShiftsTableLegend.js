export function ShiftsTableLegend() {
  return (
    <div className="text-sm text-gray-600">
      <h3 className="mb-2 font-semibold">Legenda skratiek:</h3>
      <ul className="list-inside list-disc space-y-1">
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
          <strong>ÚV</strong> – úväzok
        </li>
        <li>
          <strong>NČ</strong> – nadčas
        </li>
        <li>
          <strong>PS</strong> – počet služieb
        </li>
      </ul>
    </div>
  );
}
