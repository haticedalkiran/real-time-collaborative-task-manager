import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { receiveTasksSocket } from "./socket";
import { receiveTasks } from "./store/tasks.state";
import { Container } from "@mantine/core";

export default function ContainerListener({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch();

  useEffect(() => {
    receiveTasksSocket((data: any) => {
      dispatch(receiveTasks(data));
    });

    return () => {};
  }, []);

  return (
    <Container size={"xl"} p={"20px"}>
      {children}
    </Container>
  );
}
