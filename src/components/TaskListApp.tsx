import React, { FC } from "react";
import { TaskList } from "ink-task-list";

import { Task } from "../types/Task";
import { TaskListItem } from "./TaskListItem";

export const TaskListApp: FC<{ taskList: Task[] }> = ({ taskList }) => {
	return (
		<TaskList>
			{taskList.map((task, index) => (
				<TaskListItem key={index} task={task} />
			))}
		</TaskList>
	);
};
