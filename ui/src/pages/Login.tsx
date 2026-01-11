import {
  TextInput,
  PasswordInput,
  Button,
  Title,
  Group,
  Text,
  Anchor,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState } from "react";
import axios from "axios";
import AuthLayout from "../components/AuthLayout";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { LOGIN_URL } from "../constants/endpoints";


const Login = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const form = useForm({
    initialValues: {
      username: "",
      password: "",
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    setError(null);
    setLoading(true);

    try {
      const res = await api.post(LOGIN_URL, values);
      setMessage(res.data?.message);
      sessionStorage.setItem("access_token", res.data.access_token);
      navigate("/dashboard");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Login failed");
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Title ta="center" mb="md">
        Login
      </Title>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label="Username"
          {...form.getInputProps("username")}
          required
        />

        <PasswordInput
          label="Password"
          mt="md"
          {...form.getInputProps("password")}
          required
        />
        {error && (
          <Text size="xs" c="red" mt="sm">
            {error}
          </Text>
        )}
        {message && (
          <Text size="xs" mt="sm">
            {message}
          </Text>
        )}
        <Button fullWidth mt="xl" type="submit" loading={loading}>
          Login
        </Button>
        <Group justify="center" mt="md">
          <Text size="sm">
            Don't have an account?{" "}
            <Anchor
              component="button"
              type="button"
              size="sm"
              onClick={() => navigate("/register")}
            >
              Register
            </Anchor>
          </Text>
        </Group>
      </form>
    </AuthLayout>
  );
};

export default Login;
