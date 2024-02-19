import { Avatar, Button, Container, Popover, Title } from "@mantine/core";
import Login from "../Login /Login";
import { RootState } from "../../store/store";
import { useSelector } from "react-redux";
import { logout } from "../../store/auth.state";
import { useAppDispatch } from "../../hooks/useAppDispatch";
export default function Header() {
  const { user, isLoggedIn } = useSelector((state: RootState) => state.auth);
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <header style={{ backgroundColor: "#F6F9FC" }}>
      <Container
        size="xl"
        mb={8}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
        py="md"
      >
        <Title>Task Manager</Title>

        {!isLoggedIn ? (
          <Popover
            width={300}
            trapFocus
            position="bottom"
            withArrow
            shadow="md"
          >
            <Popover.Target>
              <Button>Login or Sign Up</Button>
            </Popover.Target>
            <Popover.Dropdown>
              <Login />
            </Popover.Dropdown>
          </Popover>
        ) : (
          <>
            <Popover trapFocus position="bottom" withArrow shadow="md">
              <Popover.Target>
                <Avatar>{user?.username[0]} </Avatar>
              </Popover.Target>
              <Popover.Dropdown>
                <Button variant="outline" color="red" onClick={handleLogout}>
                  Logout
                </Button>
              </Popover.Dropdown>
            </Popover>
          </>
        )}
      </Container>
    </header>
  );
}
