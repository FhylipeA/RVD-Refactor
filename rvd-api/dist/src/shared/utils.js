"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.geraQuery = exports.alteraParametrosQuery = exports.transformaElementosArrayParaCamelCase = void 0;
const fs = __importStar(require("fs"));
const transformaElementosArrayParaCamelCase = (array) => {
    return array.map((element) => {
        const result = {};
        for (const key of Object.keys(element)) {
            const camelKey = key.toLowerCase().replace(/_([a-z])/g, (_, c) => c.toUpperCase());
            result[camelKey] = element[key];
        }
        return result;
    });
};
exports.transformaElementosArrayParaCamelCase = transformaElementosArrayParaCamelCase;
const alteraParametrosQuery = (sql, params) => {
    let sqlChanged = sql;
    for (const param of params) {
        const regex = new RegExp(`:${param[0]}`, 'gi');
        sqlChanged = sqlChanged.replace(regex, String(param[1]));
    }
    return sqlChanged;
};
exports.alteraParametrosQuery = alteraParametrosQuery;
const geraQuery = (integrationDir, fileSuffix, params) => {
    try {
        const query = fs.readFileSync(`${integrationDir}/${fileSuffix}.sql`, 'utf-8');
        if (params) {
            return (0, exports.alteraParametrosQuery)(query, params);
        }
        return query;
    }
    catch (error) {
        throw new Error(`Não foi possível ler a query ${fileSuffix}: ${error.message}`);
    }
};
exports.geraQuery = geraQuery;
//# sourceMappingURL=utils.js.map