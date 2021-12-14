import React, { FC } from "react";
import { Task as InkTask } from "ink-task-list";

import { Task } from "../types/Task";

export const TaskListItem: FC<{ task: Task }> = ({ task }) => {
	const childTasks =
		task.children.length > 0 ? task.children.map((childTask: Task, index: number) => <TaskListItem key={index} task={childTask} />) : undefined;

	return (
		<InkTask state={task.state} label={task.title} status={task.status} output={task.output} isExpanded={(childTasks?.length ?? 0) > 0}>
			{childTasks}
		</InkTask>
	);
};
