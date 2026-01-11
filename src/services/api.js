import axios from "axios";

const BASE_URL = 'https://take-home-test-api.nutech-integrasi.com';

// axios instance
const api = axios.create({
    baseURL: BASE_URL,
});

// request interceptor untuk attach token setiap request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// response interceptor untuk handle error
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// auth apis
export const loginAPI = (credentials) => {
    return api.post('/login', credentials);
};

export const registerAPI = (userData) => {
    return api.post('/registration', userData);
};

// profile apis
export const getProfileAPI = () => {
    return api.get('/profile');
}

export const updateProfileAPI = (data) => {
    return api.put('/profile/update', data);
}

export const updateProfileImageAPI = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.put('/profile/image', formData);
};

// balance and transaction apis
export const getBalanceAPI = () => {
    return api.get('/balance');
};

export const topUpAPI = (amount) => {
  return api.post('/topup', { top_up_amount: amount });
};

export const getServicesAPI = () => {
  return api.get('/services');
};

export const transactionAPI = (serviceCode) => {
  return api.post('/transaction', { service_code: serviceCode });
};

export const getTransactionsHistoryAPI = (offset = 0, limit = 5) => {
  return api.get(`/transaction/history?offset=${offset}&limit=${limit}`);
};

export const getBannerAPI = () => {
  return api.get('/banner');
};

export default api;