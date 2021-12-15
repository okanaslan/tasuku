import { App } from "../app";
import { Task } from "./task";

export class Controller {
    app: App;
    queue: Task[];

    constructor() {
        this.app = new App();
        this.queue = [];
    }

    enqueue = async (title: string, job: () => Promise<unknown>) => {
        const task = new Task<ReturnType<typeof job>>(title, job);
        this.queue.push(task);
    };

    run = async () => {
        await Promise.all(
            this.queue.map(async (task) => {
                return task.run();
            })
        );
        const responses = this.queue.map((task) => task.result);
        console.log(responses);
        return responses;
    };
}
