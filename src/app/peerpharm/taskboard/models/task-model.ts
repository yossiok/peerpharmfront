export class TaskModel {
    constructor(
        public _id: string,
        public name: string,
        public list: string,
        public dueDate: Date,
        public priority: number,
        public departments: [string]
    ){}
}
