import { Task } from "./Task";

export type TaskList = Task[] & {
	isRoot?: boolean;
};
