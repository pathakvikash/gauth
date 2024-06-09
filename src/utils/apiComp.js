import axios from 'axios';

const BASE_URL = 'http://localhost:4000';
const config = {
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
};

export const callAPI = async (resource) => {
  const { data } = await axios.get(
    `${process.env.REACT_APP_API_BASE_URL || BASE_URL}/${resource}`,
    config
  );
  return data;
};
export const postAPI = async (resource, body) => {
  const { data } = await axios.post(
    `${process.env.REACT_APP_API_BASE_URL || BASE_URL}/${resource}`,
    body,
    config
  );
  return data;
};
