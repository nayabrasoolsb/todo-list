import { Paper, Flex } from "@mantine/core";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Flex h="100dvh" justify="center" align="center">
      <Paper
        w={420}
        maw="90%"
        p="xl"
        radius="md"
        shadow="md"
        withBorder
      >
        {children}
      </Paper>
    </Flex>
  );
};

export default AuthLayout;
