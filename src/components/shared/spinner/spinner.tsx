import { CircularProgress } from '@mui/material';

export default function Spinner() {
  return (
    <div className="h-[calc(100dvh-300px)] flex items-center justify-center">
      <CircularProgress color="error" />
    </div>
  );
}
