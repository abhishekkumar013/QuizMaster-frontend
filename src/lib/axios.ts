import axios from "axios";

const axiosInstance = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4040/api/v1",
  withCredentials: true,
});

export default axiosInstance;
