import { Button, Modal, Select, TextInput, Textarea, Box } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { Task } from "../../interfaces/task";
import { useFormik } from "formik";
import { useMemo } from "react";
import { date, object, string } from "yup";
import { useDispatch } from "react-redux";
import { addTask } from "../../store/tasks.state";
import { createTaskSocket, updateTaskSocket } from "../../socket";
import { TaskStatus } from "../../enums/task-status";

interface TaskModalProps {
  task?: Task;
  isModalOpened: boolean;
  onModalClose: () => void;
}

export default function TaskModal({
  task,
  isModalOpened,
  onModalClose,
}: TaskModalProps) {
  const dispatch = useDispatch();
  const taskValidation = useMemo(
    () =>
      object().shape({
        title: string().required("Title is required"),

        assignee: string().required("Assignee is required"),
        dueDate: date().required("Due date is required"),
      }),
    []
  );

  //TODO: handlemodalclose and clear task state

  const formik = useFormik({
    initialValues: {
      title: task?.title || "",
      detail: task?.detail || "",
      assignee: task?.assignee || "",
      dueDate: task?.dueDate ? new Date(task?.dueDate) : undefined,
    },
    validationSchema: taskValidation,
    enableReinitialize: true,
    onSubmit: (values) => {
      createTaskSocket({
        ...values,
        dueDate: values.dueDate?.toISOString(),
        reporter: "hatice",
        createdAt: new Date().toISOString(),
        status: TaskStatus.Open,
      });

      //  formik.resetForm(););
      dispatch(addTask(values));

      // console.log("values", task);
      // updateTaskSocket({
      //   ...values,
      //   id: task?._id,
      //   dueDate: values.dueDate?.toISOString(),
      //   reporter: "hatice",
      //   createdAt: new Date().toISOString(),
      //   status: TaskStatus.Done,
      // });
      onModalClose();
    },
  });

  return (
    <Modal
      opened={isModalOpened}
      onClose={() => onModalClose()}
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
          data={[
            { value: "user1", label: "User 1" },
            { value: "user2", label: "User 2" },
          ]}
          required
          onChange={(e) => formik.setFieldValue("assignee", e)}
          error={
            formik.touched.assignee && formik.errors.assignee
              ? formik.errors.assignee
              : ""
          }
          mt="md"
        />

        <DateInput
          name="dueDate"
          value={formik.values.dueDate}
          label="Due Date"
          placeholder="Due Date"
          onChange={(e) => formik.setFieldValue("dueDate", e)}
          required
          minDate={new Date()}
          mt="md"
        />

        <Button type="submit" onClick={formik.submitForm} mt="md">
          Create
        </Button>
      </Box>
    </Modal>
  );
}
