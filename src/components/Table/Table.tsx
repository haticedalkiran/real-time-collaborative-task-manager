import { useEffect, useState } from "react";
import { ActionIcon, Box, Button, Group, TextInput } from "@mantine/core";
import {
  IconEdit,
  IconPlus,
  IconSearch,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import { Task } from "../../interfaces/task";
import { receiveTasksSocket } from "../../socket";
import { receiveTasks } from "../../store/tasks.state";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import TaskModal from "../TaskModal/TaskModal";
import DeleteTaskModal from "./components/DeleteTaskModal";
import { DataTable } from "mantine-datatable";
import { useDebouncedValue } from "@mantine/hooks";
import { setAction, setSelectedTask } from "../../store/modal.state";

interface TableProps {
  onAddClick?: () => void;
}

export default function Table({}: TableProps) {
  const dispatch = useDispatch();
  const [records, setRecords] = useState<Task[]>([]);
  const [isModalOpened, setIsModalOpened] = useState(false);
  const [query, setQuery] = useState("");
  const [isDeleteModalOpened, setIsDeleteModalOpened] = useState(false);

  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const [debouncedQuery] = useDebouncedValue(query, 200);

  useEffect(() => {
    receiveTasksSocket((data: any) => {
      dispatch(receiveTasks(data));
    });
  }, []);

  const handleDeleteItem = (task: any) => {
    dispatch(setSelectedTask(task));
    setIsDeleteModalOpened(true);
  };

  const handleEditItem = (task: any) => {
    dispatch(setSelectedTask(task));
    dispatch(setAction("update"));

    setIsModalOpened(true);
  };

  const handleCreateTask = () => {
    dispatch(setAction("create"));
    setIsModalOpened(true);
  };

  useEffect(() => {
    const filteredTasks = tasks.filter((task) => {
      return task.title.toLowerCase().includes(debouncedQuery.toLowerCase());
    });

    setRecords(filteredTasks);
  }, [debouncedQuery, tasks]);

  return (
    <div>
      <Group justify="flex-end">
        <Button
          color="blue"
          leftSection={<IconPlus />}
          onClick={handleCreateTask}
        >
          Create New Task
        </Button>
      </Group>

      {tasks.length > 0 && (
        <DataTable
          striped
          highlightOnHover
          withTableBorder={true}
          withColumnBorders
          verticalSpacing="xs"
          stripedColor={"gray"}
          emptyState="No tasks found"
          columns={[
            {
              accessor: "title",

              filter: (
                <TextInput
                  label="Employees"
                  description="Show employees whose names include the specified text"
                  placeholder="Search employees..."
                  leftSection={<IconSearch size={16} />}
                  rightSection={
                    <ActionIcon
                      size="sm"
                      variant="transparent"
                      c="dimmed"
                      onClick={() => setQuery("")}
                    >
                      <IconX size={14} />
                    </ActionIcon>
                  }
                  value={query}
                  onChange={(e) => setQuery(e.currentTarget.value)}
                />
              ),
              filtering: query !== "",
            },
            { accessor: "detail" },
            { accessor: "reporter" },
            { accessor: "assignee" },
            { accessor: "status" },
            {
              accessor: "createdAt",
              title: "Created At",

              render: ({ createdAt }: { createdAt: string }) =>
                dayjs(createdAt).format("DD.MM.YYYY"),
            },
            // {
            //   accessor: "dueDate",
            //   title: "Due Date",
            //   key: "dueDate",
            //   render: ({ dueDate }: { dueDate: string }) =>
            //     dayjs(dueDate).format("DD.MM.YYYY"),
            // },
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
          ]}
          records={records}
        />
      )}

      <TaskModal
        isModalOpened={isModalOpened}
        onModalClose={() => setIsModalOpened(false)}
      />
      <DeleteTaskModal
        isModalOpened={isDeleteModalOpened}
        onClose={() => setIsDeleteModalOpened(false)}
      />
    </div>
  );
}
