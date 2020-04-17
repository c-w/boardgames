import axios from 'axios';
import game from './game';

export default axios.create({
  baseURL: `${process.env.REACT_APP_SERVER_URL}/games/${game.name}`,
});
