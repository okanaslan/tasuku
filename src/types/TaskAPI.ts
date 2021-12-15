import { TaskFunction } from "./TaskFunction";

export type TaskApi = {
    run: () => Promise<ReturnType<TaskFunction>>;
    clear: () => void;
};
