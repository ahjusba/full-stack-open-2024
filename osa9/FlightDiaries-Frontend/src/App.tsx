import { getAllDiaries } from "./services/diaryService"
import { useState, useEffect } from "react"
import type { Diary } from "./types"
import './App.css'

const App = () => {

  const [diaries, setDiaries] = useState<Diary[]>([])
  useEffect(() => {
    getAllDiaries().then(response => {
      setDiaries(response)
    })
  }, [])

  return (
    <Diaries diaries={diaries} />
  )
}

const Diary = ({ diary, index }: { diary: Diary, index: number }) => {
  return (
    <div key={index} className="diary">
      <p>Date: {diary.date}</p>
      <p>Weather: {diary.weather}</p>
      <p>Visibility: {diary.visibility}</p>
      <p>Comment: {diary?.comment}</p>
    </div>
  )
}

const Diaries = ({ diaries }: { diaries: Diary[]} ) => {
  return (
    <div className="diaries">
      <h1>Diaries</h1>
      {diaries.map((diary, index) => (
        <Diary diary={diary} index={index} />
      ))}
    </div>
  );
}

export default App
