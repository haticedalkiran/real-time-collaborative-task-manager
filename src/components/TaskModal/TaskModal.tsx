import { Button, Modal, Select, TextInput, Textarea, Box } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { Task } from "../../interfaces/task";
import { useFormik } from "formik";
import { useEffect, useMemo } from "react";
import { date, object, string } from "yup";
import { createTaskSocket, updateTaskSocket } from "../../socket";
import { TaskStatus } from "../../enums/task-status";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { setSelectedTask } from "../../store/modal.state";
import { v4 as uuid } from "uuid";
import { fetchUsers } from "../../store/auth.state";
import { useAppDispatch } from "../../hooks/useAppDispatch";

interface TaskModalProps {
  isModalOpened: boolean;
  onModalClose: () => void;
}

export default function TaskModal({
  isModalOpened,
  onModalClose,
}: TaskModalProps) {
  const dispatch = useAppDispatch();
  const { task, action } = useSelector((state: RootState) => state.modal);
  const activeUser = useSelector((state: RootState) => state.auth.user);
  const userList = useSelector((state: RootState) => state.auth.userList);

  useEffect(() => {
    dispatch(fetchUsers());
  }, []);

  const userListData = useMemo(
    () =>
      userList.map((user) => ({
        value: user._id,
        label: user.username,
      })),
    [userList]
  );

  const handleModalClose = () => {
    dispatch(setSelectedTask({} as Task));
    formik.resetForm();
    onModalClose();
  };

  const taskValidation = useMemo(
    () =>
      object().shape({
        title: string().required("Title is required"),
        assignee: string().required("Assignee is required"),
        dueDate: date().required("Due date is required"),
      }),
    []
  );

  const formik = useFormik({
    initialValues: {
      title: task?.title || "",
      detail: task?.detail || "",
      assignee: task?.assignee || "",
      dueDate: task?.dueDate ? new Date(task?.dueDate) : undefined,
      status: task?.status || TaskStatus.Open,
    },
    validationSchema: taskValidation,
    enableReinitialize: true,
    onSubmit: (values) => {
      if (action === "create") {
        createTaskSocket({
          ...values,
          _id: uuid(),

          dueDate: values.dueDate?.toISOString(),
          reporter: activeUser?.username || "",
          createdAt: new Date().toISOString(),
        });
      } else if (action === "update")
        updateTaskSocket({
          ...task,
          ...values,

          dueDate: values.dueDate?.toISOString(),
          updatedAt: new Date().toISOString(),
          updatedBy: activeUser?.username || "",
        });
      formik.resetForm();

      handleModalClose();
    },
  });

  return (
    <Modal
      opened={isModalOpened}
      onClose={handleModalClose}
      title="Create Task"
      overlayProps={{
        backgroundOpacity: 0.55,
      }}
    >
      <Box>
        <TextInput
          name="title"
          label="Title"
          placeholder="Title"
          onChange={formik.handleChange}
          value={formik.values.title}
          required
          error={
            formik.touched.title && formik.errors.title
              ? formik.errors.title
              : ""
          }
          mt="md"
        />
        <Textarea
          name="detail"
          label="Detail"
          placeholder="Detail"
          value={formik.values.detail}
          onChange={formik.handleChange}
          mt="md"
        />
        <Select
          name="assignee"
          value={formik.values.assignee}
          label="Assignee"
          placeholder="Select assignee"
          clearable
          searchable
          data={userListData}
          required
          onChange={(value) => formik.setFieldValue("assignee", value)}
          error={
            formik.touched.assignee && formik.errors.assignee
              ? formik.errors.assignee
              : ""
          }
          mt="md"
        />
        {action === "update" && (
          <Select
            data={[
              { value: TaskStatus.Open, label: "Open" },
              { value: TaskStatus.InProgress, label: "In Progress" },
              { value: TaskStatus.Done, label: "Done" },
              { value: TaskStatus.Declined, label: "Declined" },
              { value: TaskStatus.Waiting, label: "Waiting" },
            ]}
            value={formik.values.status}
            onChange={(e) => formik.setFieldValue("status", e)}
            label="Status"
            placeholder="Select status"
            mt="md"
            required
            error={
              formik.touched.status && formik.errors.status
                ? formik.errors.status
                : ""
            }
          />
        )}

        <DateInput
          name="dueDate"
          value={formik.values.dueDate}
          label="Due Date"
          placeholder="Due Date"
          onChange={(e) => formik.setFieldValue("dueDate", e)}
          required
          minDate={new Date()}
          mt="md"
          error={
            formik.touched.dueDate && formik.errors.dueDate
              ? formik.errors.dueDate
              : ""
          }
        />

        <Button type="submit" onClick={formik.submitForm} mt="md">
          {action === "create" ? "Create" : "Update"}
        </Button>
      </Box>
    </Modal>
  );
}
