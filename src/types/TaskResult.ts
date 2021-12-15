import { TaskApi } from "./TaskAPI";

export type TaskResults = {
    [key in keyof TaskApi[]]: TaskApi[][key] extends TaskApi ? ReturnType<TaskApi[][key]["run"]> : TaskApi[][key];
};
