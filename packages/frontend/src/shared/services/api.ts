import axios, { type AxiosInstance } from 'axios';
import { auth } from '@/shared/providers/firebase';

/**
 * Cliente HTTP base. Inyecta automáticamente el ID token de Firebase
 * en cada request. Cuando generes el SDK (@base-template/sdk) podés
 * configurarlo para usar esta misma instancia de axios.
 */
export const api: AxiosInstance = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use(async config => {
	const user = auth.currentUser;
	if (user) {
		const token = await user.getIdToken();
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});
