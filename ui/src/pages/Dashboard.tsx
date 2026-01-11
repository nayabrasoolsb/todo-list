import {
  Button,
  TextInput,
  Textarea,
  Table,
  Select,
  Group,
  Box,
  Pagination,
  Text,
  Stack,
  Loader,
  Container,
} from '@mantine/core';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { TODOS } from '../constants/endpoints';
import api from '../api/axios';

dayjs.extend(relativeTime);

type TodoStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

interface Todo {
  id: number;
  title: string;
  description?: string;
  status: TodoStatus;
  createdAt: string;
  createdBy: string;
}

const PAGE_SIZE = 10;

export default function Dashboard() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchTodos = async (pageNumber = page) => {
    setLoading(true);
    try {
      const res = await api.get(TODOS, {
        params: {
          page: pageNumber,
          limit: PAGE_SIZE,
        },
      });

      setTodos(res.data.data);
      setTotalPages(Math.ceil(res.data.total / PAGE_SIZE));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, [page]);

  const handleAddTodo = async () => {
    if (!title.trim()) return;

    await api.post(TODOS, {
      title,
      description,
    });

    setTitle('');
    setDescription('');
    fetchTodos(1);
    setPage(1);
  };

  const handleStatusChange = async (id: number, status: TodoStatus) => {
    await api.patch(`${TODOS}/${id}/status`, { status });
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status } : t)),
    );
  };

  return (
    <Container size="lg" py="md">
      <Box
        mx="auto"
        maw={900}
        mb="xl"
      >
        <Stack gap="sm">
          <TextInput
            label="Title"
            placeholder="Enter todo title"
            value={title}
            onChange={(e) => setTitle(e.currentTarget.value)}
          />

          <Textarea
            label="Description"
            placeholder="Optional description"
            value={description}
            onChange={(e) => setDescription(e.currentTarget.value)}
          />

          <Button fullWidth onClick={handleAddTodo}>
            Add Todo
          </Button>
        </Stack>
      </Box>

      {loading ? (
        <Group justify="center">
          <Loader />
        </Group>
      ) : (
        <Box mx="auto" maw={900} style={{ overflowX: 'auto' }}>
          <Table
            striped
            highlightOnHover
            withTableBorder
            withColumnBorders
          >
            <thead>
              <tr>
                <th>Status</th>
                <th>Title</th>
                <th>Created</th>
                <th>Created By</th>
              </tr>
            </thead>
            <tbody>
              {todos.map((todo) => (
                <tr key={todo.id}>
                  <td>
                    <Select
                      data={[
                        { value: 'TODO', label: 'TODO' },
                        { value: 'IN_PROGRESS', label: 'IN PROGRESS' },
                        { value: 'DONE', label: 'DONE' },
                      ]}
                      value={todo.status}
                      onChange={(value) =>
                        handleStatusChange(todo.id, value as TodoStatus)
                      }
                    />
                  </td>
                  <td>{todo.title}</td>
                  <td>
                    <Text size="sm" c="dimmed">
                      {dayjs(todo.createdAt).fromNow()}
                    </Text>
                  </td>
                  <td>{todo.createdBy}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Box>
      )}

      <Group justify="center" mt="lg">
        <Pagination total={totalPages} value={page} onChange={setPage} />
      </Group>
    </Container>
  );

}
