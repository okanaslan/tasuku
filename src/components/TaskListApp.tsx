import React, { FC } from "react";

import { Task } from "../types/Task";
import { TaskList } from "./TaskList";
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
