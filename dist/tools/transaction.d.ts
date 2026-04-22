export declare function begin_transaction(): Promise<{
    success: boolean;
    message: string;
}>;
export declare function commit(): Promise<{
    success: boolean;
    message: string;
}>;
export declare function rollback(): Promise<{
    success: boolean;
    message: string;
}>;
//# sourceMappingURL=transaction.d.ts.map