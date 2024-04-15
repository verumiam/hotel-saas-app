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
import { convertBufferImageToBlobURL, convertFileImageToBuffer } from '@/helpers/converter-images';
import { getRoom, updateRoom, createRoom } from '@/network/rooms';
import { roomTypes, possibleAmenities } from '@/constants';

export default function RoomEditPage({ params }: { params: { id: string } }) {
  const searchParams = useSearchParams();
  const [roomData, setRoomData] = useState({
    roomNumber: '',
    roomType: '',
    price: '',
    capacity: '',
    amenities: [],
    isAvailable: false,
    description: '',
    squareMeters: '',
    numberOfRooms: '',
    singleBeds: 0,
    doubleBeds: 0,
    sofas: 0,
  });

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

          setRoomData({
            ...roomData,
            ...room,
            price: room.price.toString(),
            capacity: room.capacity.toString(),
            squareMeters: room.squareMeters.toString(),
            numberOfRooms: room.numberOfRooms.toString(),
            singleBeds: room.singleBeds,
            doubleBeds: room.doubleBeds,
            sofas: room.sofas,
          });
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setRoomData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleAmenityChange = (amenity: string) => {
    setRoomData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
    setExistingPhotos(existingPhotos.filter((_, i) => i !== index));
    setPreviewUrls(previewUrls.filter((_, i) => i !== index));
  };

  const handlePhotoChange = (newFiles: File[]) => {
    const updatedPhotos = [...photos, ...Array.from(newFiles)];
    setPhotos(updatedPhotos);
    setPreviewUrls([...previewUrls, ...Array.from(newFiles).map(URL.createObjectURL)]);
  };

  const handleSubmit = async (e: FormEvent<unknown>) => {
    e.preventDefault();
    setLoading(true);

    const photosBuffers = await Promise.all(photos.map((file) => convertFileImageToBuffer(file)));

    const data: Record<string, unknown> = {
      roomNumber: roomData.roomNumber,
      photos: existingPhotos ? [...existingPhotos, ...photosBuffers] : photosBuffers,
      roomType: roomData.roomType,
      price: Number(roomData.price),
      capacity: Number(roomData.capacity),
      singleBeds: Number(roomData.singleBeds),
      doubleBeds: Number(roomData.doubleBeds),
      sofas: Number(roomData.sofas),
      squareMeters: Number(roomData.squareMeters),
      numberOfRooms: Number(roomData.numberOfRooms),
      amenities: roomData.amenities,
      isAvailable: roomData.isAvailable,
      description: roomData.description,
    };

    try {
      if (searchParams.get('mode') === 'edit') {
        await updateRoom(data, params.id);
      } else {
        await createRoom(data);
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
          ? `Редактирование номера: ${roomData.roomNumber}`
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
          value={photos}
          placeholder="Прикрепить фотографии номера"
          className="w-full"
          multiple
          inputProps={{ accept: '.png, .jpeg, .jpg, .webp' }}
          required={!photos || !existingPhotos}
          onChange={handlePhotoChange}
        />
        <TextField
          value={roomData.squareMeters}
          label="Квадратура номера (кв. м)"
          name="squareMeters"
          fullWidth
          type="number"
          margin="normal"
          required
          onChange={handleChange}
        />
        <TextField
          value={roomData.numberOfRooms}
          label="Количество комнат"
          name="numberOfRooms"
          fullWidth
          type="number"
          margin="normal"
          required
          onChange={handleChange}
        />
        <TextField
          value={roomData.singleBeds}
          label="Односпальных кроватей"
          name="singleBeds"
          fullWidth
          type="number"
          margin="normal"
          required
          onChange={handleChange}
        />
        <TextField
          value={roomData.doubleBeds}
          label="Двуспальных кроватей"
          name="doubleBeds"
          fullWidth
          type="number"
          margin="normal"
          required
          onChange={handleChange}
        />
        <TextField
          value={roomData.sofas}
          label="Диванов"
          name="sofas"
          fullWidth
          type="number"
          margin="normal"
          required
          onChange={handleChange}
        />
        <TextField
          value={roomData.roomNumber}
          label="Номер комнаты"
          name="roomNumber"
          fullWidth
          margin="normal"
          required
          onChange={handleChange}
        />
        <Select
          value={roomData.roomType}
          name="roomType"
          fullWidth
          displayEmpty
          inputProps={{ 'aria-label': 'Without label' }}
          required
          onChange={handleChange}
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
          value={roomData.price}
          label="Цена"
          name="price"
          fullWidth
          type="number"
          margin="normal"
          required
          onChange={handleChange}
        />
        <TextField
          value={roomData.capacity}
          label="Вместимость"
          name="capacity"
          fullWidth
          type="number"
          margin="normal"
          required
          onChange={handleChange}
        />
        <FormGroup>
          {possibleAmenities.map((amenity) => (
            <FormControlLabel
              key={amenity}
              control={
                <Checkbox
                  checked={roomData.amenities.includes(amenity)}
                  onChange={() => handleAmenityChange(amenity)}
                />
              }
              label={amenity}
            />
          ))}
        </FormGroup>
        <FormControlLabel
          control={
            <Checkbox name="isAvailable" checked={roomData.isAvailable} onChange={handleChange} />
          }
          label="Доступность"
        />
        <TextField
          value={roomData.description}
          label="Описание"
          name="description"
          fullWidth
          multiline
          rows={4}
          margin="normal"
          required
          onChange={handleChange}
        />
        <Button type="submit" variant="contained" color="error" className="w-full mt-5">
          Сохранить изменения
        </Button>
      </form>
    </Container>
  );
}
