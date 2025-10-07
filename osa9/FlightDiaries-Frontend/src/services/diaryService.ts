import axios from 'axios';
import type { Diary, NewDiary } from "../types";

const baseUrl = 'http://localhost:3000/api/diaries';

const getAllDiaries = async (): Promise<Diary[]> => {
  const response = await axios.get<Diary[]>(baseUrl);
  return response.data;
};

const createDiary = async (object: NewDiary): Promise<Diary> => {
  const response = await axios.post<Diary>(baseUrl, object);
  return response.data;
};

export { getAllDiaries, createDiary };