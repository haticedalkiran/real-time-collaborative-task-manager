import { DataTable, DataTableColumn } from "mantine-datatable";
import { useEffect, useMemo, useState } from "react";
import { ActionIcon, Box, Button, Group } from "@mantine/core";
import { IconEdit, IconEye, IconPlus, IconTrash } from "@tabler/icons-react";
import dayjs from "dayjs";
import { Task } from "../../interfaces/task";
import { deleteTaskSocket, receiveTasksSocket } from "../../socket";
import { deleteTask, receiveTasks } from "../../store/tasks.state";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import TaskModal from "../TaskModal/TaskModal";

interface TableProps {
  //onAddClick?: () => void;
}

export default function Table({}: TableProps) {
  const dispatch = useDispatch();
  const [isModalOpened, setIsModalOpened] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const tasks = useSelector((state: RootState) => state.tasks.tasks);

  useEffect(() => {
    receiveTasksSocket((data: any) => {
      dispatch(receiveTasks(data));
    });
    console.log("tasks table", tasks);
    // socket.on("receive-tasks", (data: any) => {
    //   dispatch(receiveTasks(data));
    // });
  }, []);

  const handleDeleteItem = (id: any) => {
    console.log("handleDeleteItem", id._id);
    deleteTaskSocket(id._id);
    dispatch(deleteTask(id.id));
  };
  const handleEditItem = (task: Task) => {
    console.log("handleEditItem", task);
    setSelectedTask(task);

    setIsModalOpened(true);
  };
  const columns: DataTableColumn<Task>[] = useMemo(
    () => [
      { accessor: "title", key: "title" },
      { accessor: "detail", key: "detail" },
      { accessor: "reporter", key: "reporter" },
      { accessor: "assignee", key: "assignee" },
      { accessor: "status", key: "status" },
      {
        accessor: "createdAt",
        title: "Created At",
        key: "createdAt",
        render: ({ createdAt }: { createdAt: string }) =>
          dayjs(createdAt).format("DD.MM.YYYY"),
      },
      {
        accessor: "dueDate",
        title: "Due Date",
        key: "dueDate",
        render: ({ dueDate }: { dueDate: string }) =>
          dayjs(dueDate).format("DD.MM.YYYY"),
      },
      {
        accessor: "actions",
        title: <Box mr={6}>Actions</Box>,
        textAlign: "right",
        render: (t) => (
          <Group gap={4} justify="right" wrap="nowrap">
            <ActionIcon
              size="sm"
              variant="subtle"
              color="blue"
              onClick={() => handleEditItem(t)}
            >
              <IconEdit size={16} />
            </ActionIcon>
            <ActionIcon
              size="sm"
              variant="subtle"
              color="red"
              onClick={() => handleDeleteItem(t)}
            >
              <IconTrash size={16} />
            </ActionIcon>
          </Group>
        ),
      },
    ],
    []
  );

  return (
    <div>
      <Button
        color="blue"
        leftSection={<IconPlus />}
        onClick={() => setIsModalOpened(true)}
      >
        Create New Task
      </Button>

      {tasks.length > 0 && (
        <DataTable
          withColumnBorders
          striped
          highlightOnHover
          verticalSpacing="xs"
          emptyState="No tasks found"
          columns={columns}
          records={tasks}
        />
      )}
      <TaskModal
        task={selectedTask ? selectedTask : undefined}
        isModalOpened={isModalOpened}
        onModalClose={() => setIsModalOpened(false)}
      />
    </div>
  );
}
