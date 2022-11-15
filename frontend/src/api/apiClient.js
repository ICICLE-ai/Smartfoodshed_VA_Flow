import * as https from 'https' 
import axios from 'axios'

export const apiClient = axios.create({
  baseURL: process.env.base_request_url, // Get url from environment variable! Set in docker-compose or local.
  withCredentials: false, 
  httpsAgent: new https.Agent({
    rejectUnauthorized: false
  }), 
  headers: {
    Accpet: 'application/json', 
    'Content-type': 'application/json'
  }
})
