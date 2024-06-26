'use client';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TextField, Typography } from '@mui/material';
import { Container, Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import Image from 'next/image';
import { convertBufferImageToBlobURL } from '@/helpers/converter-images';
import { IRoom } from '@/models/room';
import { startOfDay } from 'date-fns';
import Modal from '@/components/widgets/modal';
import { useSession } from 'next-auth/react';
import { updateUser } from '@/network/user/updateUser';
import { createBooking } from '@/network/booking/createBooking';
import { updateRoom, getRoomsList } from '@/network/rooms';
import Spinner from '@/components/shared/spinner/spinner';
import { useRouter } from 'next/navigation';

interface IRoomWithPhotoURLs extends Omit<IRoom, 'photos'> {
  photos: string[];
}

const today = startOfDay(new Date());

export default function Rooms() {
  const session = useSession();
  const router = useRouter();
  const [rooms, setRooms] = useState<IRoomWithPhotoURLs[]>([]);
  const [uniqueRooms, setUniqueRooms] = useState<IRoom[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingBooking, setLoadingBooking] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoomType, setSelectedRoomType] = useState<IRoomWithPhotoURLs['roomType']>('');
  const [passportData, setPassportData] = useState({
    passportNumber: '',
    passportSeries: '',
    registrationAddress: '',
  });
  const [checkInDate, setCheckInDate] = useState<Date | null>(today);
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(new Date());
  const [availableRooms, setAvailableRooms] = useState<IRoomWithPhotoURLs[]>([]);
  const [selectedRoom, setSelectedRoom] = useState('');

  const [errors, setErrors] = useState({
    passportNumber: false,
    passportSeries: false,
    registrationAddress: false,
  });

  useEffect(() => {
    setErrors({
      passportNumber: false,
      passportSeries: false,
      registrationAddress: false,
    });

    setPassportData({
      passportNumber: session?.data?.user.passportNumber,
      passportSeries: session?.data?.user.passportSeries,
      registrationAddress: session?.data?.user.registrationAddress,
    });
  }, [isModalOpen, session?.data]);

  useEffect(() => {
    const filteredRooms = rooms.filter(
      (room) => room.roomType === selectedRoomType && room.isAvailable
    );
    setAvailableRooms(filteredRooms);
    setSelectedRoom(filteredRooms.length > 0 ? filteredRooms[0].roomNumber : '');
  }, [selectedRoomType, rooms]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const fetchedRooms = await getRoomsList();

        const roomsWithPhotoUrls = fetchedRooms.map((room: IRoom) => ({
          ...room,
          photos: convertBufferImageToBlobURL(room.photos),
        }));

        const uniqueRooms: IRoom[] = Object.values(
          roomsWithPhotoUrls.reduce(
            (acc: IRoom | Record<string, string>, room: IRoomWithPhotoURLs) => {
              acc[room.roomType] = room;
              return acc;
            },
            {}
          )
        );

        setRooms(roomsWithPhotoUrls as IRoomWithPhotoURLs[]);
        setUniqueRooms(uniqueRooms);
      } catch (error) {
        console.error('Failed to fetch rooms:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  useEffect(() => {
    const days = calculateDaysBetweenDates(checkInDate, checkOutDate);
    const selectedRoomInfo = availableRooms.find((room) => room.roomNumber === selectedRoom);
    if (selectedRoomInfo) {
      const totalPrice = days * selectedRoomInfo.price;
    }
  }, [checkInDate, checkOutDate, selectedRoom, availableRooms]);

  const calculateDaysBetweenDates = (startDate: Date | null, endDate: Date | null) => {
    if (!startDate || !endDate) {
      return 0;
    }
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    return Math.round((end - start) / (1000 * 60 * 60 * 24));
  };

  const validateForm = () => {
    const newErrors = {
      passportNumber: !passportData.passportNumber,
      passportSeries: !passportData.passportSeries,
      registrationAddress: !passportData.registrationAddress,
    };

    setErrors(newErrors);

    return !Object.values(newErrors).some((error) => error);
  };

  const handleSelectRoom = (roomNumber: any) => {
    setSelectedRoom(roomNumber);
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setLoadingBooking(true);

    if (validateForm()) {
      const roomInfo = rooms.filter((room) => room.roomNumber === selectedRoom)[0];

      const userId = session?.data?.user.id;
      const roomId = roomInfo._id;

      const userUpdateData = {
        passportNumber: passportData.passportNumber,
        passportSeries: passportData.passportSeries,
        registrationAddress: passportData.registrationAddress,
      };

      const bookingData = {
        userId,
        roomId,
        checkInDate,
        checkOutDate,
        totalPrice: Number(calculateDaysBetweenDates(checkInDate, checkOutDate) * roomInfo.price),
      };

      try {
        await Promise.all([
          createBooking(bookingData),
          updateUser(userUpdateData, userId),
          updateRoom({ occupants: userId, isAvailable: false }, roomId),
        ]);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingBooking(false);
        setIsModalOpen(false);
        router.push('/profile');
      }
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <>
      <Container className="mt-[60px]">
        {uniqueRooms.map((room) => (
          <div key={room._id} className="grid grid-flow-col-dense col-span-2 mt-10">
            <div className="flex flex-row items-center justify-between py-8">
              <div className="max-w-[460px]">
                <span className="text-[32px] font-bold">{room.roomType}</span>
                <p className="my-5">{room.description}</p>
                <ul className="mb-5 text-[14px]">
                  <li>
                    {room.capacity} основных спальных мест | {room.squareMeters} м² |{' '}
                    {room.numberOfRooms} комната(ы)
                  </li>
                  <li>{room.singleBeds} односпальная(ые) кровать(и)</li>
                  <li>{room.doubleBeds} двуспальная(ые) кровать(и)</li>
                  {room.sofas > 0 && <li>{room.sofas} диван(ов)</li>}
                  {room.amenities.map((amenity, index) => (
                    <li key={index}>{amenity}</li>
                  ))}
                </ul>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => {
                    if (session.status !== 'authenticated') {
                      router.push('/auth/login');
                    } else {
                      setIsModalOpen(true);
                      setSelectedRoomType(room.roomType);
                    }
                  }}
                >
                  Забронировать
                </Button>
              </div>
              <div className="w-[640px] h-auto">
                <Swiper
                  modules={[Pagination, Navigation]}
                  spaceBetween={50}
                  slidesPerView={1}
                  navigation={false}
                  pagination={{ clickable: true }}
                >
                  {room.photos.map((photoUrl, index) => (
                    <SwiperSlide key={index}>
                      <div style={{ position: 'relative', width: '100%', height: '500px' }}>
                        <Image
                          // @ts-ignore
                          src={photoUrl}
                          alt={`${room.roomType} photo ${index}`}
                          layout="fill"
                          objectFit="cover"
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>
          </div>
        ))}
      </Container>
      <Modal open={isModalOpen} handleClose={() => setIsModalOpen(false)}>
        {loadingBooking ? (
          <Spinner />
        ) : (
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <form onSubmit={handleSubmit} className="flex flex-col gap-y-4 items-center">
              <Typography variant="subtitle1">
                {availableRooms.length <= 0
                  ? 'Извините, нет свободных комнат для брони'
                  : 'Для бронирования заполните данные'}
              </Typography>
              <TextField
                size="small"
                type="text"
                fullWidth
                label="Номер паспорта"
                value={passportData.passportNumber}
                onChange={(e) =>
                  setPassportData({ ...passportData, passportNumber: e.target.value })
                }
                error={errors.passportNumber}
                helperText={errors.passportNumber ? 'Вы не заполнили номер паспорта' : ''}
              />
              <TextField
                size="small"
                label="Серия паспорта"
                value={passportData.passportSeries}
                onChange={(e) =>
                  setPassportData({ ...passportData, passportSeries: e.target.value })
                }
                error={errors.passportSeries}
                helperText={errors.passportSeries ? 'Вы не заполнили серию паспорта' : ''}
                fullWidth
              />
              <TextField
                size="small"
                type="text"
                label="Адрес регистрации"
                fullWidth
                error={errors.registrationAddress}
                helperText={errors.registrationAddress ? 'Вы не заполнили адрес регистрации' : ''}
                value={passportData.registrationAddress}
                onChange={(e) =>
                  setPassportData({ ...passportData, registrationAddress: e.target.value })
                }
              />
              <Typography variant="subtitle1">Выберите номер комнаты</Typography>
              <div className="w-full flex items-center flex-col gap-y-4 overflow-y-auto max-h-[200px]">
                {availableRooms.map((room) => (
                  <div key={room._id} className="w-full">
                    <label>
                      <input
                        type="radio"
                        name="selectedRoom"
                        value={room.roomNumber}
                        checked={selectedRoom === room.roomNumber}
                        onChange={() => handleSelectRoom(room.roomNumber)}
                      />
                      Номер: {room.roomNumber} Цена: {room.price}, Удобства:
                      <ul>
                        {room.amenities.map((amenity, index) => (
                          <li key={index}>{amenity}</li>
                        ))}
                      </ul>
                    </label>
                  </div>
                ))}
              </div>
              <DatePicker
                className="w-full"
                label="Дата заезда"
                value={checkInDate}
                onChange={(newValue) => setCheckInDate(newValue)}
                minDate={today}
              />
              <DatePicker
                className="w-full"
                label="Дата выезда"
                value={checkOutDate}
                onChange={(newValue) => setCheckOutDate(newValue)}
                minDate={checkInDate || today}
              />
              <Typography variant="h6" className="text-center mb-4">
                Итоговая сумма:
                {calculateDaysBetweenDates(checkInDate, checkOutDate) *
                  (availableRooms.find((room) => room.roomNumber === selectedRoom)?.price ||
                    0)}{' '}
                ₽
              </Typography>
              <Button
                disabled={availableRooms.length <= 0}
                type="submit"
                fullWidth
                variant="contained"
                color="error"
              >
                Забронировать
              </Button>
            </form>
          </LocalizationProvider>
        )}
      </Modal>
    </>
  );
}
