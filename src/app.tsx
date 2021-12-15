import React from "react";
import { Instance, render } from "ink";

import { TaskList as ReactTaskList } from "./components/TaskList";
import { TaskList } from "./types/TaskList";

export class App {
    inkApp: Instance;

    constructor() {
        const taskList = [] as TaskList;
        taskList.isRoot = true;
        this.inkApp = render(<ReactTaskList taskList={taskList} />);
    }

    remove() {
        this.inkApp.rerender(null);
        this.inkApp.unmount();
        this.inkApp.clear();
        this.inkApp.cleanup();
    }
}
