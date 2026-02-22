const rawBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
const hasProtocol = /^https?:\/\//i.test(rawBaseUrl);
const BASE_URL = hasProtocol ? rawBaseUrl : `https://${rawBaseUrl}`;

export const USER_API_END_POINT = `${BASE_URL}/api/v1/user`;
export const JOB_API_END_POINT = `${BASE_URL}/api/v1/job`;
export const APPLICATION_API_END_POINT = `${BASE_URL}/api/v1/application`;
export const COMPANY_API_END_POINT = `${BASE_URL}/api/v1/company`;

