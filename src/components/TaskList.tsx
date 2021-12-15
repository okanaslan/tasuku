import React, { FC } from "react";
import { Box } from "ink";

export const TaskList: FC = ({ children }) => <Box flexDirection="column">{children}</Box>;

// TaskList.propTypes = {
//     children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
// };
