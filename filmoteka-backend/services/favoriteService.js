
import axios from 'axios';

export const addFavorite = async (userId, movieId) => {
  return await axios.post('/api/favorites/add', { userId, movieId });
};

export const getFavorites = async (userId) => {
  return await axios.get(`/api/favorites/${userId}`);
};

export const removeFavorite = async (userId, movieId) => {
  return await axios.delete('/api/favorites/remove', { data: { userId, movieId } });
};
