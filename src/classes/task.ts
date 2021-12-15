import { TaskState } from "../enums/TaskState";

export class Task<ResultType = unknown> {
    title: string;
    state: TaskState;
    children: Task[];
    error?: Error;
    result?: ResultType;

    job: () => Promise<ResultType>;

    constructor(title: string, job: () => any) {
        this.title = title;
        this.state = TaskState.pending;
        this.children = [];

        this.job = job;
    }

    run = async () => {
        this.state = TaskState.loading;
        try {
            const result = await this.job();
            this.state = TaskState.success;
            this.result = result;
        } catch (error) {
            this.state = TaskState.error;
        }
    };
}
