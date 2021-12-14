import React, { FC } from "react";
import { TaskList } from "ink-task-list";
import { useSnapshot } from "valtio";

import { Task } from "../types/Task";
import { TaskListItem } from "./TaskListItem";

export const TaskListApp: FC<{ taskList: Task[] }> = ({ taskList }) => {
	const state = useSnapshot(taskList);

	return (
		<TaskList>
			{state.map((task, index) => (
				<TaskListItem key={index} task={task} />
			))}
		</TaskList>
	);
};
