import axios from 'axios';
import type { Diary, NewDiary } from "../types";

const baseUrl = 'http://localhost:3000/api/diaries'

const getAllDiaries = async () => {
  return axios
    .get<Diary[]>(baseUrl)
    .then(response => response.data)
}

const createDiary = (object: NewDiary) => {
  return axios
    .post<Diary>(baseUrl, object)
    .then(response => response.data)
}

export { getAllDiaries, createDiary }