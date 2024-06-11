import axios from 'axios';

const BASE_URL = `https://${process.env.REACT_APP_BASE_URL}`;
const config = {
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'multipart/form-data',
    Accept: 'application/json',
  },
};

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export const callAPI = async (resource) => {
  const { data } = await api.get(`${resource}`);
  return data;
};
export const postImgAPI = async (resource, body) => {
  console.log(body, 'body');
  const { data } = await axios.post(`${resource}`, body, config);
  return data;
};

export default api;
