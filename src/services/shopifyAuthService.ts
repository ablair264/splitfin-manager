import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

interface ShopifySession {
  shop: string;
  accessToken: string;
  scope: string;
}

interface ShopifyAuthService {
  isAuthenticated: () => Promise<boolean>;
  getShopData: () => Promise<any>;
  initiateAuth: (shop: string) => void;
  logout: () => void;
}

class ShopifyAuth implements ShopifyAuthService {
  private session: ShopifySession | null = null;

  async isAuthenticated(): Promise<boolean> {
    try {
      const response = await axios.get(API_ENDPOINTS.SHOP, {
        withCredentials: true
      });
      this.session = response.data;
      return true;
    } catch (error) {
      return false;
    }
  }

  async getShopData(): Promise<any> {
    try {
      const response = await axios.get(API_ENDPOINTS.SHOP, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching shop data:', error);
      throw error;
    }
  }

  initiateAuth(shop: string): void {
    window.location.href = `${API_ENDPOINTS.AUTH}?shop=${shop}.myshopify.com`;
  }

  logout(): void {
    this.session = null;
    window.location.href = '/';
  }
}

export const shopifyAuth = new ShopifyAuth();