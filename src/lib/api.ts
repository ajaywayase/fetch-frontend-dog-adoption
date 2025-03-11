import axios from 'axios';
import type { Dog, LoginCredentials, SearchResponse, Location } from '../types';

const api = axios.create({
  baseURL: 'https://frontend-take-home-service.fetch.com',
  withCredentials: true,
});

export async function login(credentials: LoginCredentials) {
  return api.post('/auth/login', credentials);
}

export async function logout() {
  return api.post('/auth/logout');
}

export async function searchDogs(params: {
  breeds?: string[];
  zipCodes?: string[];
  ageMin?: number;
  ageMax?: number;
  size?: number;
  from?: string;
  sort?: string;
}): Promise<SearchResponse> {
  const { data } = await api.get('/dogs/search', { params });
  return data;
}

export async function getBreeds(): Promise<string[]> {
  const { data } = await api.get('/dogs/breeds');
  return data;
}

export async function getDogs(ids: string[]): Promise<Dog[]> {
  const { data } = await api.post('/dogs', ids);
  return data;
}

export async function getMatch(favoriteIds: string[]): Promise<{ match: string }> {
  const { data } = await api.post('/dogs/match', favoriteIds);
  return data;
}

export async function searchLocations(params: {
  city?: string;
  states?: string[];
  size?: number;
  from?: number;
}): Promise<{ results: Location[]; total: number }> {
  const { data } = await api.post('/locations/search', params);
  return data;
}

export async function getLocations(zipCodes: string[]): Promise<Location[]> {
  const { data } = await api.post('/locations', zipCodes);
  return data;
}