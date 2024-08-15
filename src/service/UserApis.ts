import axios from 'axios';
import { BACKEND_URL } from '../constant';

export class UserApis {
  /**
   * Register user
   */
  static async registerUser({
    username,
    email,
    password,
  }: {
    username: string;
    email: string;
    password: string;
  }) {
    try {
      const response = await axios.post(`${BACKEND_URL}/api/v1/user/register`, {
        username,
        email,
        password,
      });
      if (response.status === 200) {
        return response.data;
      }
      return '';
    } catch (e) {
      console.log(e);
      return '';
    }
  }

  /**
   * Login user
   */
  static async loginUser({
    username,
    password,
  }: {
    username: string;
    password: string;
  }): Promise<{
    success: boolean;
    message: string;
    data?: any;
  }> {
    try {
      const response = await axios.post(`${BACKEND_URL}/api/v1/user/login`, {
        username,
        password,
      });
      console.log(
        `[loginUser] response.data: ${JSON.stringify(response.data)}`,
      );
      return response.data;
    } catch (e: any) {
      console.log(`[loginUser] error message: ${e.message}`);
      return {
        success: false,
        message: 'Something went wrong, please try again',
      };
    }
  }

  /**
   * verify user token
   */
  static async verifyToken(): Promise<boolean> {
    try {
      const token = localStorage.getItem('fcd-token');

      if (!token) {
        return false;
      }

      // console.log(`[getPlayerList] token: ${token}`);
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/user/verify-token`,
        {},
        { headers: { token } },
      );
      if (response.status === 200) {
        console.log(
          `[verifyToken] response.data: ${JSON.stringify(response.data)}`,
        );
        return true;
      } else {
        return false;
      }
    } catch (e: any) {
      console.log(`[verifyToken] error.status: ${e.response.status}`);
      console.log(
        `[verifyToken] error.data: ${JSON.stringify(e.response.data)}`,
      );
      return false;
    }
  }

  static async doLogout(): Promise<boolean> {
    try {
      const token = localStorage.getItem('fcd-token');
      // console.log(`[getPlayerList] token: ${token}`);
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/user/logout`,
        {},
        {
          headers: {
            Accept: '*/*',
            token: token,
          },
        },
      );
      console.log(`[doLogout] response: ${JSON.stringify(response)}`);
      if (response.status !== 200) {
        return false;
      }
      if (!response.data.success) {
        return false;
      }

      localStorage.removeItem('fcd-token');
      return true;
    } catch (e) {
      console.log(`[doLogout] error: ${e}`);
      return false;
    }
  }

  /**
   * Get user secret key
   */
  static async getSecretKey(): Promise<string> {
    try {
      const token = localStorage.getItem('fcd-token');
      // console.log(`[getPlayerList] token: ${token}`);
      const response = await axios.get(`${BACKEND_URL}/api/v1/user/secret`, {
        headers: {
          Accept: '*/*',
          token: token,
        },
      });
      console.log(`[getSecretKey] response: ${JSON.stringify(response)}`);

      if (response.status !== 200) {
        return '';
      }
      if (!response.data.success) {
        return '';
      }
      return response.data.data.secretKey;
    } catch (e) {
      console.log(e);
      return '';
    }
  }

  static async doRefreshSecretKey(): Promise<string> {
    try {
      const token = localStorage.getItem('fcd-token');
      // console.log(`[getPlayerList] token: ${token}`);
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/user/secret/refresh`,
        {},
        {
          headers: {
            Accept: '*/*',
            token: token,
          },
        },
      );
      console.log(`[doRefreshSecretKey] response: ${JSON.stringify(response)}`);
      if (response.status !== 200) {
        return '';
      }
      if (!response.data.success) {
        return '';
      }
      return response.data.data.secretKey;
    } catch (e) {
      console.log(`[doRefreshSecretKey] error: ${e}`);
      return '';
    }
  }
}