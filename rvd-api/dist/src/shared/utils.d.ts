type TagSql = [parametro: string, valor: number | string];
export declare const transformaElementosArrayParaCamelCase: (array: any[]) => any[];
export declare const alteraParametrosQuery: (sql: string, params: TagSql[]) => string;
export declare const geraQuery: (integrationDir: string, fileSuffix: string, params?: TagSql[]) => string;
export {};
