export interface MySQLConfig {
    host: string;
    port: number;
    user: string;
    password: string;
    database?: string;
    readOnly?: boolean;
    maxRetries?: number;
    retryDelay?: number;
}
export interface QueryResult {
    columns: string[];
    rows: Record<string, any>[];
    rowCount: number;
}
export interface ToolDefinition {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties?: Record<string, any>;
        required?: string[];
    };
}
export interface MySQLPool {
    query<T = any>(sql: string, params?: any[]): Promise<T>;
    execute<T = any>(sql: string, params?: any[]): Promise<T>;
    getConnection(): Promise<any>;
    end(): Promise<void>;
}
//# sourceMappingURL=types.d.ts.map