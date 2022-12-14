import { FormuleItem } from './formule-item';
import { FormulePhase } from './formule-phase';

export class Formule {
    _id:string; 
    number: number;
    name: string;
    category: string;
    lastUpdate: Date;
    lastUpdateUser:string;
    ph: number;
    client: string ;
    // items: FormuleItem[];
    phases: FormulePhase[];
}
