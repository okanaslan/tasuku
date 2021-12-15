import { TaskState } from "../enums/TaskState";

export type Task = {
	title: string;
	state: TaskState;
	children: Task[];
	status?: string;
	output?: string;
};
