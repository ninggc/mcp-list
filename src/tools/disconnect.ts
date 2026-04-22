import { closePool } from '../connection';

export async function disconnect(): Promise<{ success: boolean; message: string }> {
  try {
    await closePool();
    return { success: true, message: 'Disconnected from MySQL' };
  } catch (error) {
    throw new Error(`Failed to disconnect: ${error}`);
  }
}
