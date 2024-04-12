'use client';

import React from 'react';
import { Container, Grid, Card, CardContent, CardActions, Button, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function AdminLayout() {
  const router = useRouter();

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  return (
    <Container className="mt-[60px]">
      <h1 className="text-[24px] mb-5">Панель администрирования</h1>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="h2">
                Клиенты
              </Typography>
              <Typography>
                Управление списком клиентов: просмотр, добавление, редактирование и удаление.
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                className="w-full"
                variant="contained"
                color="error"
                size="small"
                onClick={() => handleNavigate('/admin/manage/clients')}
              >
                Перейти
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="h2">
                Номера отеля
              </Typography>
              <Typography>
                Управление номерами отеля: просмотр, добавление, редактирование и удаление.
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                className="w-full"
                variant="contained"
                color="error"
                size="small"
                onClick={() => handleNavigate('/admin/manage/rooms')}
              >
                Перейти
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
