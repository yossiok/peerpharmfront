import { FormuleItem } from './formule-item';

export class FormulePhase {
    _id: string;
    phaseNumber: number;
    phaseName: string;
    phaseInstructions: string;
    // items: [FormuleItem];
    items: FormuleItem[];
    formuleId: string;
    formuleNumber: number;
    formuleName: string;
}
