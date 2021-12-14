import pMap, { Options } from "p-map";
import { ArrayUtils } from "./utils/arrayUtils";
import { createApp } from "./components/CreateApp";
import { Task } from "./types/Task";
import { TaskList } from "./types/TaskList";
import { TaskState } from "./enums/TaskState";

const createTaskInnerApi = (task: Task) => {
    const api = {
        task: createTaskFunction(task.children),
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

export type TaskInnerApi = ReturnType<typeof createTaskInnerApi>;
export type TaskFunction = (taskHelpers: TaskInnerApi) => Promise<unknown>;

type TaskApi<T extends TaskFunction> = {
    run: () => Promise<ReturnType<T>>;
    clear: () => void;
};
type TaskResults<T extends TaskFunction, Tasks extends TaskApi<T>[]> = {
    [key in keyof Tasks]: Tasks[key] extends TaskApi<T> ? ReturnType<Tasks[key]["run"]> : Tasks[key];
};

let app: ReturnType<typeof createApp>;

function registerTask<T extends TaskFunction>(taskList: TaskList, taskTitle: string, taskFunction: T): TaskApi<T> {
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
        async run(): Promise<ReturnType<T>> {
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

function createTaskFunction(taskList: TaskList) {
    async function task<T extends TaskFunction>(title: string, taskFunction: T) {
        const task = registerTask(taskList, title, taskFunction);
        const result = await task.run();

        return Object.assign(task, { result });
    }

    const createTask = <T extends TaskFunction>(title: string, taskFunction: T) => registerTask(taskList, title, taskFunction);

    task.group = async <T extends TaskFunction, Tasks extends TaskApi<T>[]>(
        createTasks: (taskCreator: typeof createTask) => readonly [...Tasks],
        options?: Options
    ) => {
        const tasksQueue = createTasks(createTask);
        const results = (await pMap(tasksQueue, async (taskApi) => await taskApi.run(), {
            concurrency: 1,
            ...options,
        })) as unknown as TaskResults<T, Tasks>;

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

const rootTaskList = [] as TaskList;
const task = createTaskFunction(rootTaskList);

export default task;
