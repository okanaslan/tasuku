import { ArrayUtils } from "./utils/arrayUtils";
import { createApp } from "./components/CreateApp";
import { Task } from "./types/Task";
import { TaskList } from "./types/TaskList";
import { TaskState } from "./enums/TaskState";
import pMap, { Options } from "p-map";
import { TaskApi } from "./types/TaskAPI";
import { TaskResults } from "./types/TaskResult";
import { TaskFunction } from "./types/TaskFunction";

export const createTaskInnerApi = (task: Task) => {
    const api = {
        task: createTask(task.children),
        setTitle(title: string) {
            task.title = title;
        },
        setStatus(status: string) {
            task.status = status;
        },
        setOutput(output: string | { message: string }) {
            task.output = typeof output === "string" ? output : "message" in output ? output.message : "";
        },
        setWarning(warning: Error | string) {
            task.state = TaskState.warning;
            api.setOutput(warning);
        },
        setError(error: Error | string) {
            task.state = TaskState.error;
            api.setOutput(error);
        },
    };
    return api;
};

let app: ReturnType<typeof createApp>;

function registerTask(taskList: TaskList, taskTitle: string, taskFunction: TaskFunction): TaskApi {
    if (app == null) {
        taskList.isRoot = true;
        app = createApp(taskList);
    }

    const task = ArrayUtils.addTo(taskList, {
        title: taskTitle,
        state: TaskState.pending,
        children: [],
    });

    return {
        async run(): Promise<ReturnType<TaskFunction>> {
            const api = createTaskInnerApi(task);

            task.state = TaskState.loading;

            try {
                const taskResult = await taskFunction(api);

                if (task.state == TaskState.loading) {
                    task.state = TaskState.success;
                }
                return taskResult;
            } catch (error) {
                api.setError(error as Error | string);
                throw error;
            }
        },
        clear() {
            ArrayUtils.removeFrom(taskList, task);

            if (taskList.isRoot && taskList.length == 0) {
                app.remove();
            }
        },
    };
}

function createTask(taskList: TaskList) {
    async function task(title: string, taskFunction: TaskFunction) {
        const task = registerTask(taskList, title, taskFunction);
        const result = await task.run();

        return Object.assign(task, { result });
    }

    const createTask = (title: string, taskFunction: TaskFunction) => registerTask(taskList, title, taskFunction);

    task.group = async (createTasks: (taskCreator: typeof createTask) => readonly [...TaskApi[]], options?: Options) => {
        const tasksQueue = createTasks(createTask);
        const results = (await pMap(tasksQueue, async (taskApi) => await taskApi.run(), {
            concurrency: 1,
            ...options,
        })) as unknown as TaskResults;

        return {
            results,
            clear() {
                for (const taskApi of tasksQueue) {
                    taskApi.clear();
                }
            },
        };
    };

    return task;
}

export const task = createTask([]);
