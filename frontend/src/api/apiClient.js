import * as https from 'https' 
import axios from 'axios'
import { base_request_url, dev_request_url } from "./config";

export const apiClient = axios.create({
  baseURL: dev_request_url, 
  withCredentials: false, 
  httpsAgent: new https.Agent({
    rejectUnauthorized: false
  }), 
  headers: {
    Accpet: 'application/json', 
    'Content-type': 'application/json'
  }
})
