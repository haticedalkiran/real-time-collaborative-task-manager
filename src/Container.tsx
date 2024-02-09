import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { receiveTasksSocket } from "./socket";
import { receiveTasks } from "./store/tasks.state";

export default function Container({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();

  useEffect(() => {
    receiveTasksSocket((data: any) => {
      dispatch(receiveTasks(data));
    });

    return () => {};
  }, []);

  return <div>{children}</div>;
}
