import BaseApi from './BaseApi';

export const getTasks = () => BaseApi.getRequest('/tasks');
