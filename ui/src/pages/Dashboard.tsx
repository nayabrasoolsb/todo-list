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
  Grid,
} from '@mantine/core';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { TODOS } from '../constants/endpoints';
import api from '../api/axios';
import { ActionIcon } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';

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
      setTotalPages(res.data.meta.totalPages);
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

  const handleDeleteTodo = async (id: number) => {
    await api.delete(`${TODOS}/${id}`);
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };


  return (
    <Container size="lg" py="md" style={{ marginTop: "24px" }}>
      <Grid gutter="xl" align="flex-start">
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Box w="100%" maw={420}>
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

              <Button onClick={handleAddTodo}>
                Add Todo
              </Button>
            </Stack>
          </Box>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 8 }}>
          {loading ? (
            <Group justify="center">
              <Loader />
            </Group>
          ) : (
            <>
              {todos.length > 0 ? <Box style={{ overflowX: 'auto' }}>
                <Table
                  highlightOnHover
                  verticalSpacing="sm"
                  horizontalSpacing="md"
                  style={(theme) => ({
                    'thead th': {
                      backgroundColor: theme.colors.gray[0],
                      color: theme.colors.gray[7],
                      fontWeight: 600,
                      fontSize: theme.fontSizes.sm,
                      borderBottom: `1px solid ${theme.colors.gray[3]}`,
                    },

                    'tbody td': {
                      borderBottom: `1px solid ${theme.colors.gray[2]}`,
                    },

                    'th:first-of-type, td:first-of-type': {
                      width: 120,
                      textAlign: 'center',
                    },
                  })}
                >
                  <thead>
                    <tr>
                      <th>Status</th>
                      <th>Title</th>
                      <th>Created</th>
                      <th>Created By</th>
                      <th style={{ width: 60 }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {todos.map((todo) => (
                      <tr key={todo.id}>
                        <td>
                          <Group justify="center">
                            <Select
                              size="xs"
                              radius="md"
                              w={120}
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
                          </Group>
                        </td>

                        <td>
                          <Text ta="center" fw={500}>
                            {todo.title}
                          </Text>
                        </td>

                        <td>
                          <Text ta="center" size="xs" c="dimmed">
                            {dayjs(todo.createdAt).fromNow()}
                          </Text>
                        </td>

                        <td>
                          <Text ta="center" size="sm">
                            {todo.createdBy}
                          </Text>
                        </td>

                        <td>
                          <Group justify="center">
                            <ActionIcon
                              color="red"
                              variant="subtle"
                              onClick={() => handleDeleteTodo(todo.id)}
                              aria-label="Delete todo"
                            >
                              <IconTrash size={16} />
                            </ActionIcon>
                          </Group>
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Box> : <div>
                All todos are done!
              </div>}
            </>

          )}
        </Grid.Col>
      </Grid>

      {todos.length > 0 && <Group justify="center" mt="lg">
        <Pagination total={totalPages} value={page} onChange={setPage} />
      </Group>}
    </Container>
  );

}
