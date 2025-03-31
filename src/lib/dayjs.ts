import * as dayjs from 'dayjs';

import * as localizedFormat from 'dayjs/plugin/localizedFormat';
import * as utc from 'dayjs/plugin/utc';

import * as ptBR from 'dayjs/locale/pt-br';

dayjs.extend(localizedFormat);
dayjs.extend(utc);

dayjs.locale(ptBR);

export default dayjs;
