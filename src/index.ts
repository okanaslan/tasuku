import { App } from "./app";
import { TaskState } from "./enums/TaskState";
import { ArrayUtils } from "./utils/arrayUtils";

import { Task } from "./types/Task";
import { TaskApi } from "./types/TaskAPI";
import { TaskList } from "./types/TaskList";
import { TaskFunction } from "./types/TaskFunction";

export const createTaskInnerApi = (task: Task) => {
    const api = {
        task: init(task.children),
        setTitle(title: string) {
            task.title = title;
        },
        setStatus(status: string) {
            task.status = status;
        },
        setOutput(message: string) {
            task.output = message;
        },
        setError(error: Error | string) {
            task.state = TaskState.error;
            if (typeof error == "string") {
                api.setOutput(error);
            } else {
                api.setOutput(error.message);
            }
        },
    };
    return api;
};

function registerTask(taskList: TaskList, taskTitle: string, taskFunction: TaskFunction): TaskApi {
    const app = new App();
    const task: Task = {
        title: taskTitle,
        state: TaskState.pending,
        children: [],
    };
    taskList.push(task);

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

function init(taskList: TaskList) {
    async function task(title: string, taskFunction: TaskFunction) {
        const task = registerTask(taskList, title, taskFunction);
        const result = await task.run();

        return Object.assign(task, { result });
    }

    const createTask = (title: string, taskFunction: TaskFunction) => registerTask(taskList, title, taskFunction);
    task.group = async (createTasks: (taskCreator: typeof createTask) => readonly [...TaskApi[]]) => {
        const tasksQueue = createTasks(createTask);
        const results = await Promise.all(
            tasksQueue.map(async (task) => {
                await task.run();
            })
        );
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

export const task = init([]);

export const queue = async (title: string, taskFunction: TaskFunction) => {
    const task = registerTask([], title, taskFunction);
    const result = await task.run();

    return Object.assign(task, { result });
};

// export const group = async (tasks: (task: typeof queue) => readonly [...TaskApi[]]) => {
//     const createTask = async (title: string, taskFunction: TaskFunction) => registerTask([], title, taskFunction);

//     const tasksQueue = tasks(createTask);
//     const results = await Promise.all(
//         tasksQueue.map(async (task) => {
//             await task.run();
//         })
//     );
//     return {
//         results,
//         clear() {
//             for (const task of tasksQueue) {
//                 task.clear();
//             }
//         },
//     };
// };
