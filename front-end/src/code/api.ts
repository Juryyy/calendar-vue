import Config from "@/config";
import axios from "axios";

// TODO: Set up axios instance, e.g. base url from config.
export const axiosInstance = axios.create({
  baseURL: Config.apiUrl
});

// TODO: Implement setBearerAuthToken. Set the token to the Authorization header of the axios instance.
export const setBearerAuthToken = (token: string | undefined) => {
  axiosInstance.defaults.headers.common["Authorization"] = token ? `Bearer ${token}` : "";
};
