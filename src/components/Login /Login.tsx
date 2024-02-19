import { Box, Button, Tabs, Text, TextInput } from "@mantine/core";
import { useFormik } from "formik";
import { useMemo, useState } from "react";
import { v4 as uuid } from "uuid";
import { object, string } from "yup";
import { loginSuccess } from "../../store/auth.state";
import { useAppDispatch } from "../../hooks/useAppDispatch";

export default function Login() {
  const [action, setAction] = useState<string | null>("login");
  const [message, setMessage] = useState("");
  const dispatch = useAppDispatch();
  const handleSubmit = async () => {
    const endpoint = action === "login" ? "/login" : "/signup";
    const body =
      action === "signup" ? { ...formik.values, _id: uuid() } : formik.values;
    try {
      await fetch(import.meta.env.VITE_SOCKET_URL + endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }).then((res) =>
        res
          .json()

          .then((data) => {
            if (res.ok) {
              dispatch(loginSuccess(data.user));
            } else setMessage(data.message);
          })
      );
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const validationSchema = useMemo(
    () =>
      object().shape({
        username: string().required("Username is required"),
        password: string().required("Password is required"),
      }),
    []
  );

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: () => {
      handleSubmit();
    },
  });

  return (
    <Box>
      <Tabs variant="outline" value={action} onChange={setAction}>
        <Tabs.List>
          <Tabs.Tab value="login">Login</Tabs.Tab>
          <Tabs.Tab value="signup">Sign Up</Tabs.Tab>
        </Tabs.List>
      </Tabs>
      <TextInput
        name="username"
        label="Username"
        placeholder="Enter your username"
        value={formik.values.username}
        onChange={formik.handleChange}
        error={
          formik.touched.username && formik.errors.username
            ? formik.errors.username
            : ""
        }
      />
      <TextInput
        label="Password"
        placeholder="Enter your password"
        name="password"
        type="password"
        value={formik.values.password}
        onChange={formik.handleChange}
        error={
          formik.touched.password && formik.errors.password
            ? formik.errors.password
            : ""
        }
      />
      {message && (
        <Text c="red" size="sm">
          {message}
        </Text>
      )}

      <Button type="submit" onClick={formik.submitForm} mt={6}>
        {action === "login" ? "Login" : "Sign Up"}
      </Button>
    </Box>
  );
}
