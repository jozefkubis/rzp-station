import { dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeekFn from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import sk from 'date-fns/locale/sk';

export const localizer = dateFnsLocalizer({
    format,
    parse,
    // explicitne hovoríme: pondelok pre Slovensko
    startOfWeek: date => startOfWeekFn(date, { locale: sk }),
    getDay,
    locales: { sk },
});
