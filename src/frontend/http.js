import axios from 'axios';
import config from './config';
import game from '../shared/game';

export default axios.create({
  baseURL: `${config.REACT_APP_SERVER_URL}/games/${game.name}`,
});
