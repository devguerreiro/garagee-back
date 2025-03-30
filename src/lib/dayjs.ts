import * as dayjs from 'dayjs';

import * as localizedFormat from 'dayjs/plugin/localizedFormat';

import * as ptBR from 'dayjs/locale/pt-br';

dayjs.extend(localizedFormat);

dayjs.locale(ptBR);

export default dayjs;
