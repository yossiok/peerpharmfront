export class SubTaskModel {
    constructor(
        public _id: string,
        public mainTaskId:string,
        public name: string,
        public dueDate: Date,
        public departments: [string],
        public users: [string],
        public status:string
    ){}
}
