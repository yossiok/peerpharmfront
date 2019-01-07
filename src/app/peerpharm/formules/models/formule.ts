import { FormuleItem } from './formule-item';

export class Formule {
    number: number;
    name: string;
    category: string;
    lastUpdate: Date;
    ph: string;
    client: string ;
    items: FormuleItem[];
}
