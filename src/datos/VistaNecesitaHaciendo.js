import getVistaNecesita from './VistaNecesita';
import { NO_NECESITA } from '../utils/constantes';

export default data => getVistaNecesita(data, item => item.stockmateriales < item.cantidadpedidos, true).filter(item => item.haciendomateriales > NO_NECESITA);
