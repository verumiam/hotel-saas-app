import React from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  Box,
} from '@mui/material';
import Link from 'next/link';

export default function Home() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Добро пожаловать в Mariott Krasnodar!
        </Typography>
        <Typography variant="h6" component="h2" gutterBottom>
          Ваш идеальный выбор для незабываемого отдыха и успешных деловых встреч.
        </Typography>
      </Box>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardMedia
              component="img"
              height="250"
              image="https://static.tildacdn.com/tild6262-6361-4533-b163-623336306563/Facade_Air_view.jpg"
              alt="Mariott Krasnodar"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                О нас
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Отель Mariott Krasnodar расположен в сердце Краснодара, предлагая гостям
                высококлассное обслуживание и комфорт.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardMedia
              component="img"
              height="250"
              image="https://optim.tildacdn.com/tild3232-6362-4837-a331-333733386538/-/resize/1000x/-/format/webp/0P1A4948.jpg"
              alt="Интерьер"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Наши услуги
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Предлагаем лучшие услуги для вашего комфорта: спа-центр, фитнес-зал, ресторан
                мирового класса и многое другое.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Box sx={{ my: 4, textAlign: 'center' }}>
        <Button variant="contained" color="error">
          <Link href="/rooms">Бронировать сейчас</Link>
        </Button>
      </Box>
      <Box sx={{ mt: 4 }}>
        <Typography variant="body1" gutterBottom>
          © 2024 Mariott Krasnodar. Все права защищены.
        </Typography>
      </Box>
    </Container>
  );
}
