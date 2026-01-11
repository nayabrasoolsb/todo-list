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
import { REGISTER_URL } from "../constants/endpoints";

const Register = () => {
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const form = useForm({
    initialValues: {
      name: "",
      email: "",
      password: "",
      username: "",
    },

    validate: {
      email: (value) =>
        /^\S+@\S+\.\S+$/.test(value) ? null : "Invalid email address",

      username: (value) =>
        /^[a-z0-9_.]+$/.test(value)
          ? null
          : "Username can contain only lowercase letters, numbers, _ and .",

      password: (value) =>
        value.length >= 8
          ? null
          : "Password must be at least 8 characters long",
    },
  });


  const handleSubmit = async (values: typeof form.values) => {
    setError(null);
    setLoading(true);

    try {
      const resp = await api.post(REGISTER_URL, values);
      if(resp.data?.id) {
        setMessage("registered successfully!");
      }

    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Registration failed");
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
        Register
      </Title>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label="Name"
          {...form.getInputProps("name")}
          required
        />

        <TextInput
          label="Email"
          mt="md"
          {...form.getInputProps("email")}
          required
        />


        <TextInput
          label="Username"
          mt="md"
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
          Register
        </Button>

        <Group justify="center" mt="md">
          <Text size="sm">
            Already have an account?{" "}
            <Anchor
              component="button"
              size="sm"
              onClick={() => navigate("/login")}
            >
              Login
            </Anchor>
          </Text>
        </Group>
      </form>
    </AuthLayout>
  );
};

export default Register;
