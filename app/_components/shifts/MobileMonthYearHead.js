import ArrowBack from "./ArrowBack";
import ArrowForword from "./ArrowForword";
import { getDaysArray, MONTHS } from "./helpers_shifts";

function MobileMonthYearHead() {
    const days = getDaysArray(year, month);
    const year = date.getFullYear();
    const monthName = MONTHS()[mIndex];
    const monthLabel =
        monthName.charAt(0).toUpperCase() + monthName.slice(1).toLowerCase();
    const weekdays = days.filter(({ isWeekend }) => !isWeekend).length;
    const normHours = weekdays * 7.5;

    return (
        <div>
            <ArrowBack goTo={goTo} shiftsOffset={shiftsOffset} disabled={disabled} />
            <div>
                {monthLabel} {year} - Norma hodín: {normHours}
            </div>
            <ArrowForword
                goTo={goTo}
                shiftsOffset={shiftsOffset}
                disabled={disabled}
            />
        </div>
    );
}

export default MobileMonthYearHead;
