import axios from 'axios';
import config from './config/client';
import game from './game';

export default axios.create({
  baseURL: `${config.REACT_APP_SERVER_URL}/games/${game.name}`,
});
