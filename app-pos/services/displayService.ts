import { NativeModules, Platform } from 'react-native';

const { DisplayManager } = NativeModules;

export interface DisplayInfo {
  id: number;
  name: string;
  width: number;
  height: number;
  isPrimary: boolean;
}

export class DisplayService {
  static isAvailable(): boolean {
    return Platform.OS === 'android' && DisplayManager;
  }

  static async getDisplays(): Promise<DisplayInfo[]> {
    if (!this.isAvailable()) {
      throw new Error('DisplayManager is not available on this platform');
    }
    return DisplayManager.getDisplays();
  }

  static async hasMultipleDisplays(): Promise<boolean> {
    if (!this.isAvailable()) {
      return false;
    }
    return DisplayManager.hasMultipleDisplays();
  }

  static async showOnSecondaryDisplay(): Promise<string> {
    if (!this.isAvailable()) {
      throw new Error('DisplayManager is not available on this platform');
    }
    return DisplayManager.showOnSecondaryDisplay();
  }

  static async updateCart(cart: { item: any; quantity: number }[]): Promise<string> {
    if (!this.isAvailable()) {
      throw new Error('DisplayManager is not available on this platform');
    }
    return DisplayManager.updateCart(JSON.stringify(cart));
  }

  static async hidePresentation(): Promise<string> {
    if (!this.isAvailable()) {
      throw new Error('DisplayManager is not available on this platform');
    }
    return DisplayManager.hidePresentation();
  }
}
