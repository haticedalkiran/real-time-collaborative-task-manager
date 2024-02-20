import { useEffect, useState } from "react";
import {
  ActionIcon,
  Box,
  Button,
  Group,
  MultiSelect,
  TextInput,
  Tooltip,
} from "@mantine/core";
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
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import TaskModal from "../TaskModal/TaskModal";
import DeleteTaskModal from "./components/DeleteTaskModal";
import { DataTable, DataTableSortStatus } from "mantine-datatable";
import { useDebouncedValue } from "@mantine/hooks";
import { setAction, setSelectedTask } from "../../store/modal.state";
import { sortBy } from "lodash";
import { TaskStatus } from "../../enums/task-status";
import { useAppDispatch } from "../../hooks/useAppDispatch";

export default function Table() {
  const dispatch = useAppDispatch();
  const [records, setRecords] = useState<Task[]>([]);
  const [isModalOpened, setIsModalOpened] = useState(false);
  const [query, setQuery] = useState("");
  const [isDeleteModalOpened, setIsDeleteModalOpened] = useState(false);
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus<Task>>({
    columnAccessor: "title",
    direction: "asc",
  });
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const { tasks, loading } = useSelector((state: RootState) => state.tasks);
  const [debouncedQuery] = useDebouncedValue(query, 200);
  const users = useSelector((state: RootState) => state.auth.userList);

  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

  useEffect(() => {
    receiveTasksSocket((data: Task[]) => {
      dispatch(receiveTasks(data));
    });
  }, []);

  const handleDeleteItem = (task: Task) => {
    if (!isLoggedIn) return;

    dispatch(setSelectedTask(task));
    setIsDeleteModalOpened(true);
  };

  const handleEditItem = (task: Task) => {
    if (!isLoggedIn) return;
    dispatch(setSelectedTask(task));
    dispatch(setAction("update"));

    setIsModalOpened(true);
  };

  const handleCreateTask = () => {
    if (!isLoggedIn) return;

    dispatch(setAction("create"));
    setIsModalOpened(true);
  };

  useEffect(() => {
    const filteredTasks = tasks.filter((task) => {
      if (selectedStatus.length > 0) {
        if (!selectedStatus.includes(task.status)) return false;
      }

      return task.title.toLowerCase().includes(debouncedQuery.toLowerCase());
    });

    setRecords(filteredTasks);
  }, [debouncedQuery, tasks, selectedStatus]);

  useEffect(() => {
    const data = sortBy(records, sortStatus.columnAccessor) as Task[];
    setRecords(sortStatus.direction === "desc" ? data.reverse() : data);
  }, [sortStatus]);

  return (
    <div>
      <Group justify="flex-end">
        <Tooltip
          label="Please login to create a new task."
          events={{
            hover: !isLoggedIn && true,
            focus: !isLoggedIn && true,
            touch: !isLoggedIn && true,
          }}
        >
          <Button
            disabled={!isLoggedIn}
            color="blue"
            leftSection={<IconPlus />}
            onClick={handleCreateTask}
            mb={6}
          >
            Create New Task
          </Button>
        </Tooltip>
      </Group>

      <DataTable
        striped
        highlightOnHover
        withTableBorder={true}
        withColumnBorders
        verticalSpacing="xs"
        textSelectionDisabled
        emptyState="No tasks found"
        noRecordsText="No records to show"
        sortStatus={sortStatus}
        onSortStatusChange={setSortStatus}
        fetching={loading}
        columns={[
          {
            accessor: "title",

            filter: (
              <TextInput
                label="Titles"
                description="Search by title"
                placeholder="Search by title"
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
            sortable: true,
          },
          { accessor: "detail" },
          {
            accessor: "reporter",
            sortable: true,
          },
          {
            accessor: "assignee",
            sortable: true,
            render: ({ assignee: string }) =>
              users.find((user) => user._id === string)?.username || "",
          },
          {
            accessor: "status",
            sortable: true,
            filter: (
              <MultiSelect
                label="Status"
                description="Filter by status"
                data={[
                  { value: TaskStatus.Open, label: "Open" },
                  { value: TaskStatus.InProgress, label: "In Progress" },
                  { value: TaskStatus.Done, label: "Done" },
                  { value: TaskStatus.Declined, label: "Declined" },
                  { value: TaskStatus.Waiting, label: "Waiting" },
                ]}
                value={selectedStatus}
                placeholder="Search task status"
                onChange={setSelectedStatus}
                leftSection={<IconSearch size={16} />}
                clearable
                searchable
              />
            ),
            filtering: selectedStatus.length > 0,
          },
          {
            accessor: "createdAt",
            title: "Created At",
            sortable: true,
            render: (record) => dayjs(record.createdAt).format("DD.MM.YYYY"),
          },
          {
            accessor: "dueDate",
            title: "Due Date",
            sortable: true,
            render: (record) => dayjs(record.dueDate).format("DD.MM.YYYY"),
          },
          {
            accessor: "actions",
            title: <Box mr={6}>Actions</Box>,
            textAlign: "center",
            render: (t) => (
              <Group gap={4} justify="center" wrap="nowrap" align="center">
                <Tooltip
                  label="Please login to create a new task."
                  events={{
                    hover: !isLoggedIn && true,
                    focus: !isLoggedIn && true,
                    touch: !isLoggedIn && true,
                  }}
                >
                  <ActionIcon
                    size="sm"
                    variant="subtle"
                    color="blue"
                    onClick={() => handleEditItem(t)}
                    disabled={!isLoggedIn}
                  >
                    <IconEdit size={16} />
                  </ActionIcon>
                </Tooltip>

                <Tooltip
                  label="Please login to create a new task."
                  events={{
                    hover: !isLoggedIn && true,
                    focus: !isLoggedIn && true,
                    touch: !isLoggedIn && true,
                  }}
                >
                  <ActionIcon
                    size="sm"
                    variant="subtle"
                    color="red"
                    onClick={() => handleDeleteItem(t)}
                    disabled={!isLoggedIn}
                  >
                    <IconTrash size={16} />
                  </ActionIcon>
                </Tooltip>
              </Group>
            ),
          },
        ]}
        minHeight={100}
        idAccessor={(record) => record._id ?? ""}
        records={records}
      />

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
