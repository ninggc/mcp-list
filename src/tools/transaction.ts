import { beginTransaction as beginTx, commit as commitTx, rollback as rollbackTx } from '../connection';

export async function begin_transaction(): Promise<{ success: boolean; message: string }> {
  try {
    await beginTx();
    return { success: true, message: 'Transaction started' };
  } catch (error) {
    throw new Error(`Failed to begin transaction: ${error}`);
  }
}

export async function commit(): Promise<{ success: boolean; message: string }> {
  try {
    await commitTx();
    return { success: true, message: 'Transaction committed' };
  } catch (error) {
    throw new Error(`Failed to commit: ${error}`);
  }
}

export async function rollback(): Promise<{ success: boolean; message: string }> {
  try {
    await rollbackTx();
    return { success: true, message: 'Transaction rolled back' };
  } catch (error) {
    throw new Error(`Failed to rollback: ${error}`);
  }
}
