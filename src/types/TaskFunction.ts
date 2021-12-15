import { TaskInnerApi } from "./TaskInnerAPI";

export type TaskFunction = (taskHelpers: TaskInnerApi) => Promise<unknown>;
