export class SubTaskModel {
    constructor(
        public _id: string,
        public mainTaskId:string,
        public name: string,
        public dueDate: Date,
        public departments: [string],
        public userId: string,
        public status:string
    ){}
}
