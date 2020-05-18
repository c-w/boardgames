import axios from 'axios';
import config from './config';

export default function newHttpClient(gameName) {
  return axios.create({
    baseURL: `${config.REACT_APP_SERVER_URL}/games/${gameName}`,
  });
}
