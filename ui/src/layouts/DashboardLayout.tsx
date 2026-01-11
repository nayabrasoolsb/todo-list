import { AppShell, Group, Button, Text } from "@mantine/core";
import { useNavigate } from "react-router-dom";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("access_token");
    navigate("/login", { replace: true });
  };

  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShell.Header>
        <Group justify="space-between" px="md" h="100%">
          <Text fw={600}>Todo Dashboard</Text>

          <Button
            size="xs"
            color="red"
            variant="light"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Group>
      </AppShell.Header>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
};

export default DashboardLayout;
