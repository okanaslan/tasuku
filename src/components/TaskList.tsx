import { Box } from "ink";
import React, { FC } from "react";

import { Task } from "../types/Task";
import { TaskListItem } from "./TaskListItem";

const TaskListApp: FC = ({ children }) => <Box flexDirection="column">{children}</Box>;
export const TaskList: FC<{ taskList: Task[] }> = ({ taskList }) => {
    return (
        <TaskListApp>
            {taskList.map((task, index) => (
                <TaskListItem key={index} task={task} />
            ))}
        </TaskListApp>
    );
};
