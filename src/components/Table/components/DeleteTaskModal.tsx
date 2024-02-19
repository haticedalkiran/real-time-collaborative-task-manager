import { Alert, Button, Group, Modal, Stack, Text } from "@mantine/core";
import { Task } from "../../../interfaces/task";
import { IconInfoCircle } from "@tabler/icons-react";
import { deleteTaskSocket } from "../../../socket";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { setSelectedTask } from "../../../store/modal.state";
import { useAppDispatch } from "../../../hooks/useAppDispatch";

interface DeleteTaskModalProps {
  isModalOpened: boolean;
  onClose: () => void;
}

export default function DeleteTaskModal({
  isModalOpened,
  onClose,
}: DeleteTaskModalProps) {
  const dispatch = useAppDispatch();
  const selectedTask = useSelector((state: RootState) => state.modal.task);

  const handleDeleteItem = () => {
    deleteTaskSocket(selectedTask._id as string);
    handleModalClose();
  };

  //reset selected task
  const handleModalClose = () => {
    dispatch(setSelectedTask({} as Task));
    onClose();
  };

  return (
    <Modal
      opened={isModalOpened}
      onClose={handleModalClose}
      title={<Text fw={"bold"}>Task Name: {selectedTask.title}</Text>}
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
