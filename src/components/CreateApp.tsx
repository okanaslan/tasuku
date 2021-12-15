import React from "react";
import { render } from "ink";

import { TaskListApp } from "./TaskListApp";
import { TaskList } from "../types/TaskList";

export function createApp(taskList: TaskList) {
	const inkApp = render(<TaskListApp taskList={taskList} />);
	return {
		remove() {
			inkApp.rerender(null);
			inkApp.unmount();
			inkApp.clear();
			inkApp.cleanup();
		},
	};
}
