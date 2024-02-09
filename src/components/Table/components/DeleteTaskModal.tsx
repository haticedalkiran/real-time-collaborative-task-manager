import {
  Alert,
  Box,
  Button,
  Divider,
  Group,
  Modal,
  Stack,
  Text,
} from "@mantine/core";
import { Task } from "../../../interfaces/task";
import { useState } from "react";
import { IconInfoCircle } from "@tabler/icons-react";
import { deleteTaskSocket } from "../../../socket";
import { deleteTask } from "../../../store/tasks.state";
import { useDispatch } from "react-redux";

interface DeleteTaskModalProps {
  task: Task | undefined;
  isModalOpened: boolean;
  onClose: () => void;
}

export default function DeleteTaskModal({
  task,
  isModalOpened,
  onClose,
}: DeleteTaskModalProps) {
  const dispatch = useDispatch();

  const handleDeleteItem = () => {
    console.log("handleDeleteItem", task);
    // setIsDeleteModalOpened(true);
    // setSelectedTask(task);
    deleteTaskSocket(task?._id);
    dispatch(deleteTask(task?._id));
    handleModalClose();
  };
  const handleModalClose = () => {
    onClose();
  };

  return (
    <Modal
      opened={isModalOpened}
      onClose={handleModalClose}
      title={<Text fw={"bold"}>Task Name: {task?.title}</Text>}
    >
      <Stack>
        <Text>Are you sure you want to delete this task?</Text>

        <Alert
          p={"sm"}
          variant="light"
          color="orange"
          title="Warning"
          icon={<IconInfoCircle />}
        >
          <Text>Task will be deleted permanently</Text>
        </Alert>
        {/* modal footer */}
        <Group justify="flex-end">
          <Button variant="outline" color="gray" onClick={handleModalClose}>
            Cancel
          </Button>
          <Button variant="filled" color="red" onClick={handleDeleteItem}>
            Delete
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
