import React from 'react';
import { Container, Typography, Grid, Card, CardMedia, CardContent, Box } from '@mui/material';
import Image from 'next/image';

const specialOffers = [
  {
    title: 'Романтический уикенд',
    description:
      'Проведите незабываемый уикенд в атмосфере романтики с эксклюзивным пакетом услуг, включая ужин при свечах и спа-процедуры для двоих.',
    imageUrl: '/romantic-weekend.jpg',
  },
  {
    title: 'Семейный отдых',
    description:
      'Наши младшие гости будут в восторге от развлекательных программ и специального детского меню. Забронируйте сейчас и получите бесплатное проживание для детей.',
    imageUrl: '/family.jpg',
  },
  {
    title: 'Бизнес-пакет',
    description:
      'Идеальное предложение для деловых людей: удобное размещение, конференц-залы и все необходимое для работы в номере.',
    imageUrl: '/conference.webp',
  },
];

export default function SpecialOffers() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Спецпредложения
        </Typography>
        <Typography variant="h6" component="h2" gutterBottom>
          Исключительные предложения от Mariott Krasnodar для идеального отдыха и эффективной
          работы.
        </Typography>
      </Box>
      <Grid container spacing={4}>
        {specialOffers.map((offer, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card>
              <CardMedia
                component={Image}
                priority
                className="h-[250px]"
                image={offer.imageUrl}
                alt={offer.title}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {offer.title}
                </Typography>
                <Typography className="min-h-[85px]" variant="body2" color="text.secondary">
                  {offer.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
