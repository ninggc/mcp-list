import { createPool } from '../connection';
import { MySQLConfig } from '../types';

export function connect(config: MySQLConfig): { success: boolean; message: string } {
  try {
    createPool(config);
    return { success: true, message: 'Connected to MySQL' };
  } catch (error) {
    throw new Error(`Failed to connect: ${error}`);
  }
}
