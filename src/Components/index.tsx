import Panel from './Panel';
import  Auth from './Auth';

import DI from '../Core/DependencyInjection';

const WapperPanel = DI(Panel);
const WapperAuth = DI(Auth);

export { WapperPanel as Panel, WapperAuth as Auth };