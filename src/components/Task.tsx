import React, { FC, ReactElement, isValidElement, Children } from "react";
import { Text, Box } from "ink";
import Spinner from "ink-spinner";
import { SpinnerName } from "cli-spinners";
import { TaskState } from "../enums/TaskState";

const getSymbol = (state?: TaskState) => {
    switch (state) {
        case TaskState.error:
            return <Text color="red">{"✖"}</Text>;
        case TaskState.success:
            return <Text color="green">{"√"}</Text>;
        case TaskState.pending:
            return <Text color="gray">{"■"}</Text>;
        default:
            return " ";
    }
};

const getPointer = (state?: TaskState) => <Text color={state === TaskState.error ? "red" : "yellow"}>{">"}</Text>;

export const Task: FC<{
    label: string;
    state?: TaskState;
    status?: string;
    output?: string;
    spinnerType?: string;
    isExpanded?: boolean;
    children?: ReactElement | ReactElement[];
}> = ({ label, state, status, output, spinnerType, isExpanded, children }) => {
    const childrenArray = Children.toArray(children);
    const listChildren = childrenArray.filter((node) => isValidElement(node));
    let icon =
        state == TaskState.loading ? (
            <Text color="yellow">
                <Spinner type={spinnerType as SpinnerName} />
            </Text>
        ) : (
            getSymbol(state)
        );

    if (isExpanded) {
        icon = getPointer(state);
    }

    return (
        <Box flexDirection="column">
            <Box>
                <Box marginRight={1}>
                    <Text>{icon}</Text>
                </Box>
                <Text>{label}</Text>
                {status ? (
                    <Box marginLeft={1}>
                        <Text dimColor>[{status}]</Text>
                    </Box>
                ) : undefined}
            </Box>
            {output ? (
                <Box marginLeft={2}>
                    <Text color="gray">{`${"→"} ${output}`}</Text>
                </Box>
            ) : undefined}
            {isExpanded && listChildren.length > 0 && (
                <Box flexDirection="column" marginLeft={2}>
                    {listChildren}
                </Box>
            )}
        </Box>
    );
};
