import { FormuleItem } from './formule-item';
import { FormulePhase } from './formule-phase';

export class Formule {
    number: number;
    name: string;
    category: string;
    lastUpdate: Date;
    ph: string;
    client: string ;
    items: FormuleItem[];
    phases: FormulePhase[];
}
