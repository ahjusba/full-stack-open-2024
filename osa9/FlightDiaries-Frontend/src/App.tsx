import { getAllDiaries, createDiary } from "./services/diaryService"
import { useState, useEffect } from "react"
import { type Diary, Weather, Visibility } from "./types"
import './App.css'
import axios from "axios";

const weatherOptions = Object.values(Weather);
const visibilityOptions = Object.values(Visibility);

const App = () => {
  const [errorMessage, setErrorMessage] = useState('')
  const [diaries, setDiaries] = useState<Diary[]>([])

  useEffect(() => {
    getAllDiaries().then(response => {
      setDiaries(response)
    })
  }, [])

  const entryCreation = async (newEntry: Omit<Diary, 'id'>) => {
    const newDiary: Diary = {
      ...newEntry,
      id: diaries.length + 1,
    };

    try {
      const data = await createDiary(newDiary);
      console.log("DATA: ", data);
      setDiaries([...diaries, data]);
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      console.error(message)
      setErrorMessage(message);
      setTimeout(() => {
        setErrorMessage('');
      }, 2000);
    }
  };

  return (
    <>
      <ErrorMessage message={errorMessage} />
      <DiaryForm entryCreation={entryCreation} />
      <Diaries diaries={diaries} />
    </>
  )
}

const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const message =
      error.response?.data?.error?.[0]?.message ||
      error.response?.data?.message ||
      error.message;

    return message || "An unknown Axios error occurred.";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred.";
};

const ErrorMessage = ({ message }: { message: string }) => {
  if (!message) return null;

  return <h2 className="errorMessage">{message}</h2>;
};

type DiaryFormProps = {
  entryCreation: (entry: Omit<Diary, 'id'>) => void;
};

const DiaryForm = ({ entryCreation }: DiaryFormProps) => {
  const [date, setDate] = useState('');
  const [weather, setWeather] = useState<Weather>(Weather.Sunny);
  const [visibility, setVisibility] = useState<Visibility>(Visibility.Great);
  const [comment, setComment] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    entryCreation({ date, weather, visibility, comment });
    setDate('');
    setWeather(Weather.Sunny);
    setVisibility(Visibility.Great);
    setComment('');
  };

  return (
    <form onSubmit={handleSubmit} className="diaryForm">
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />

      <select value={weather} onChange={(e) => setWeather(e.target.value as Weather)}>
        {weatherOptions.map((w) => (
          <option key={w} value={w}>{w}</option>
        ))}
      </select>

      <select value={visibility} onChange={(e) => setVisibility(e.target.value as Visibility)}>
        {visibilityOptions.map((v) => (
          <option key={v} value={v}>{v}</option>
        ))}
      </select>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Comment"
      />

      <button type="submit">Add Diary Entry</button>
    </form>
  );
};

const Diary = ({ diary }: { diary: Diary }) => {
  return (
    <div className="diary">
      <p>Date: {diary.date}</p>
      <p>Weather: {diary.weather}</p>
      <p>Visibility: {diary.visibility}</p>
      {diary.comment && <p>Comment: {diary.comment}</p>}
      <p>ID: {diary.id}</p>
    </div>
  )
}

const Diaries = ({ diaries }: { diaries: Diary[] }) => {
  return (
    <div className="diaries">
      <h1>Diaries</h1>
      {diaries.map((diary, index) => (
        <Diary diary={diary} key={index} />
      ))}
    </div>
  );
}

export default App