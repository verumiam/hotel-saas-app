'use client';

import React, { FormEvent, useEffect, useState } from 'react';
import { MuiFileInput } from 'mui-file-input';
import {
  Container,
  TextField,
  Button,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Typography,
  IconButton,
  Box,
  CircularProgress,
  Select,
  MenuItem,
} from '@mui/material';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import DeleteIcon from '@mui/icons-material/Delete';
import { useRouter } from 'next/navigation';
import { convertBufferImageToBlobURL, convertFileImageToBuffer } from '@/helpers/converter-images';
import { getRoom } from '@/network/rooms/getRoom';
import { updateRoom } from '@/network/rooms/updateRoom';
import { createRoom } from '@/network/rooms/createRoom';

const roomTypes = [
  'Делюкс с двуспальной кроватью',
  'Делюкс с двумя односпальными кроватями',
  'Делюкс с двуспальной кроватью с видом на город',
  'Двухкомнатный полулюкс',
  'Двухкомнатные апартаменты с одной спальней',
  'Трехкомнатные апартаменты с одной спальней',
  'Семейные апартаменты с двумя спальнями',
  'Президентский люкс',
];

const possibleAmenities = [
  'Wi-Fi',
  'Телевизор',
  'Кондиционер',
  'Мини-бар',
  'Кухня',
  'Кофемашина',
  'Гостевой санузел',
  'Ванная и душевая',
  'Джакузи',
  'Вид на центр города',
];

export default function RoomEditPage({ params }: { params: { id: string } }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [roomNumber, setRoomNumber] = useState('');
  const [roomType, setRoomType] = useState('');
  const [price, setPrice] = useState('');
  const [capacity, setCapacity] = useState('');
  const [amenities, setAmenities] = useState<string[]>([]);
  const [isAvailable, setIsAvailable] = useState(false);
  const [description, setDescription] = useState('');
  const [squareMeters, setSquareMeters] = useState('');
  const [numberOfRooms, setNumberOfRooms] = useState('');

  const [singleBeds, setSingleBeds] = useState(0);
  const [doubleBeds, setDoubleBeds] = useState(0);
  const [sofas, setSofas] = useState(0);

  const [photos, setPhotos] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [existingPhotos, setExistingPhotos] = useState<Buffer[]>([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRoomData = async () => {
      if (params.id && searchParams.get('mode') === 'edit') {
        setLoading(true);
        try {
          const room = await getRoom(params.id);

          setRoomNumber(room.roomNumber);
          setRoomType(room.roomType);
          setPrice(room.price.toString());
          setCapacity(room.capacity.toString());
          setAmenities(room.amenities);
          setIsAvailable(room.isAvailable);
          setDescription(room.description);
          setSquareMeters(room.squareMeters.toString());
          setNumberOfRooms(room.numberOfRooms.toString());
          setSingleBeds(room.singleBeds);
          setDoubleBeds(room.doubleBeds);
          setSofas(room.sofas);
          setExistingPhotos(room.photos);

          if (room.photos && room.photos.length > 0) {
            const urls = convertBufferImageToBlobURL(room.photos);
            setPreviewUrls(urls);
          }
        } catch (error) {
          console.error('Ошибка при получении данных номера:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchRoomData();

    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [params.id, searchParams]);

  const handleAmenityChange = (amenity: string) => {
    if (amenities.includes(amenity)) {
      setAmenities(amenities.filter((a) => a !== amenity));
    } else {
      setAmenities([...amenities, amenity]);
    }
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
    setExistingPhotos(existingPhotos.filter((_, i) => i !== index));
    setPreviewUrls(previewUrls.filter((_, i) => i !== index));
  };

  const handlePhotoChange = (newFiles: File[]) => {
    const fileArray = Array.from(newFiles);

    const updatedPhotos = [...photos, ...fileArray];
    setPhotos(updatedPhotos);

    const updatedPreviewUrls = [
      ...previewUrls,
      ...fileArray.map((file) => URL.createObjectURL(file)),
    ];
    setPreviewUrls(updatedPreviewUrls);
  };

  const handleSubmit = async (e: FormEvent<unknown>) => {
    e.preventDefault();
    setLoading(true);

    const photosBuffers = await Promise.all(photos.map((file) => convertFileImageToBuffer(file)));

    const roomData: Record<string, unknown> = {
      roomNumber,
      photos: existingPhotos ? [...existingPhotos, ...photosBuffers] : photosBuffers,
      roomType,
      price: Number(price),
      capacity: Number(capacity),
      singleBeds: Number(singleBeds),
      doubleBeds: Number(doubleBeds),
      sofas: Number(sofas),
      squareMeters: Number(squareMeters),
      numberOfRooms: Number(numberOfRooms),
      amenities,
      isAvailable,
      description,
    };

    try {
      if (searchParams.get('mode') === 'edit') {
        await updateRoom(roomData, params.id);
      } else {
        await createRoom(roomData);
        router.push('/admin/manage/rooms');
      }
    } catch (error) {
      console.error('Error saving room:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-1/2 flex items-center justify-center">
        <CircularProgress color="error" />
      </div>
    );
  }

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h1" gutterBottom>
        {searchParams.get('mode') === 'edit'
          ? `Редактирование номера: ${roomNumber}`
          : 'Создание нового номера'}
      </Typography>
      <form className="mb-5" onSubmit={handleSubmit}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 2,
            marginTop: 2,
            marginBottom: '20px',
          }}
        >
          {previewUrls.map((url, index) => (
            <Box key={index} sx={{ position: 'relative', maxWidth: '100%', minHeight: 'auto' }}>
              <Image
                src={url}
                alt={`preview-${index}`}
                width={300}
                height={300}
                objectFit="contain"
                layout="responsive"
              />
              <IconButton
                size="small"
                sx={{ position: 'absolute', top: 0, right: 0 }}
                onClick={() => handleRemovePhoto(index)}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
        </Box>
        <MuiFileInput
          className="w-full"
          value={photos}
          multiple
          placeholder="Прикрепить фотографии номера"
          inputProps={{ accept: '.png, .jpeg, .jpg, .webp' }}
          onChange={handlePhotoChange}
        />
        <TextField
          fullWidth
          label="Квадратура номера (кв. м)"
          type="number"
          value={squareMeters}
          onChange={(e) => setSquareMeters(e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Количество комнат"
          type="number"
          value={numberOfRooms}
          onChange={(e) => setNumberOfRooms(e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Односпальных кроватей"
          type="number"
          value={singleBeds}
          onChange={(e) => setSingleBeds(Number(e.target.value))}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Двуспальных кроватей"
          type="number"
          value={doubleBeds}
          onChange={(e) => setDoubleBeds(Number(e.target.value))}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Диванов"
          type="number"
          value={sofas}
          onChange={(e) => setSofas(Number(e.target.value))}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Номер комнаты"
          value={roomNumber}
          onChange={(e) => setRoomNumber(e.target.value)}
          margin="normal"
        />
        <Select
          fullWidth
          value={roomType}
          onChange={(e) => setRoomType(e.target.value)}
          displayEmpty
          inputProps={{ 'aria-label': 'Without label' }}
        >
          <MenuItem disabled value="">
            Выберите тип комнаты
          </MenuItem>
          {roomTypes.map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </Select>
        <TextField
          fullWidth
          label="Цена"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Вместимость"
          type="number"
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
          margin="normal"
        />
        <FormGroup>
          {possibleAmenities.map((amenity) => (
            <FormControlLabel
              key={amenity}
              control={
                <Checkbox
                  checked={amenities.includes(amenity)}
                  onChange={() => handleAmenityChange(amenity)}
                />
              }
              label={amenity}
            />
          ))}
        </FormGroup>
        <FormControlLabel
          control={
            <Checkbox checked={isAvailable} onChange={(e) => setIsAvailable(e.target.checked)} />
          }
          label="Доступность"
        />
        <TextField
          fullWidth
          label="Описание"
          multiline
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          margin="normal"
        />
        <Button type="submit" variant="contained" color="error" className="w-full mt-5">
          Сохранить изменения
        </Button>
      </form>
    </Container>
  );
}
