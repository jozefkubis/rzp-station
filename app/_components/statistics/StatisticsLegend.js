export function StatisticsLegend() {
  return (
    <div className="mt-6 text-sm text-gray-600">
      <h3 className="mb-2 font-semibold">Legenda skratiek:</h3>
      <ul className="list-inside list-disc space-y-1">
        <li>
          <strong>D</strong> – denná smena
        </li>
        <li>
          <strong>N</strong> – nočná smena
        </li>
        <li>
          <strong>RD</strong> – riadna dovolenka
        </li>
        <li>
          <strong>PN</strong> – práceneschopnosť
        </li>
        <li>
          <strong>X</strong> – voľno (požiadavka)
        </li>
        <li>
          <strong>ŠS D</strong> – denná smena počas štátneho sviatku
        </li>
        <li>
          <strong>ŠS N</strong> – nočná smena počas štátneho sviatku
        </li>
        <li>
          <strong>ŠS spolu</strong> – všetky smeny počas štátnych sviatkov
        </li>
      </ul>
    </div>
  );
}
