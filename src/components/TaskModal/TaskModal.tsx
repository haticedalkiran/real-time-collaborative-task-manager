import { Button, Modal, Select, TextInput, Textarea, Box } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { Task } from "../../interfaces/task";
import { useFormik } from "formik";
import { useMemo } from "react";
import { date, object, string } from "yup";

export default function TaskModal(task: Task) {
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
      title: task.title || "",
      description: task.description || "",
      assignee: task.assignee || "",
      dueDate: task.dueDate || "",
    },
    validationSchema: taskValidation,
    //enableReinitialize: true,
    onSubmit: (values) => {
      console.log(values);
      //clear form;
      formik.resetForm();
    },
  });

  return (
    <Modal
      opened={true}
      onClose={() => {}}
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
          name="description"
          label="Description"
          placeholder="Description"
          value={formik.values.description}
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
          error={
            formik.touched.dueDate && formik.errors.dueDate
              ? formik.errors.dueDate
              : ""
          }
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
