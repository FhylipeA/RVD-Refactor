import * as fs from 'fs';

type TagSql = [parametro: string, valor: number | string];

export const transformaElementosArrayParaCamelCase = (array: any[]) => {
  return array.map((element) => {
    const result: any = {};
    for (const key of Object.keys(element)) {
      const camelKey = key.toLowerCase().replace(/_([a-z])/g, (_, c) => c.toUpperCase());
      result[camelKey] = element[key];
    }
    return result;
  });
};

export const alteraParametrosQuery = (sql: string, params: TagSql[]) => {
  let sqlChanged = sql;
  for (const param of params) {
    const regex = new RegExp(`:${param[0]}`, 'gi');
    sqlChanged = sqlChanged.replace(regex, String(param[1]));
  }
  return sqlChanged;
};

export const geraQuery = (
  integrationDir: string,
  fileSuffix: string,
  params?: TagSql[],
): string => {
  try {
    const query = fs.readFileSync(`${integrationDir}/${fileSuffix}.sql`, 'utf-8');
    if (params) {
      return alteraParametrosQuery(query, params);
    }
    return query;
  } catch (error: any) {
    throw new Error(
      `Não foi possível ler a query ${fileSuffix}: ${error.message}`,
    );
  }
};