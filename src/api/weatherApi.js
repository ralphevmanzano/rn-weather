import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://api.openweathermap.org/data/2.5/',
});

instance.interceptors.request.use(request => {
  // console.log('Starting Request: ', request);
  return request;
});

instance.interceptors.response.use(response => {
  // console.log('Response: ', response);
  return response;
});

export default instance;