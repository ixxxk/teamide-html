let sqlNames = []
// 使用可变数组以便后续根据方言动态调整关键字列表
let baseKeywords = []

// 依据方言初始化关键字集合
const keywordMap = {
    mysql: ["SELECT", "FROM", "WHERE", "LIKE", "AND", "OR", "ASC", "DESC", "LIMIT", "IN", "NOT", "AS", "COUNT", "COUNT(*)", "ORDER BY", "GROUP BY", "DISTINCT", "BETWEEN", "HAVING", "JOIN", "LEFT JOIN", "RIGHT JOIN", "UNION", "INSERT", "INSERT INTO", "UPDATE", "SET", "DELETE", "CREATE DATABASE", "CREATE TABLE", "CREATE INDEX", "ALTER TABLE", "DROP DATABASE", "DROP TABLE", "DROP INDEX", "SHOW DATABASES", "SHOW TABLES", "SHOW COLUMNS FROM", "DESC", "NOW()", "MIN()", "MAX()", "SUM()", "AVG()", "EXPLAIN"],
    mariadb: ["SELECT", "FROM", "WHERE", "LIKE", "AND", "OR", "ASC", "DESC", "LIMIT", "IN", "NOT", "AS", "COUNT", "COUNT(*)", "ORDER BY", "GROUP BY", "DISTINCT", "BETWEEN", "HAVING", "JOIN", "LEFT JOIN", "RIGHT JOIN", "UNION", "INSERT", "INSERT INTO", "UPDATE", "SET", "DELETE", "CREATE DATABASE", "CREATE TABLE", "CREATE INDEX", "ALTER TABLE", "DROP DATABASE", "DROP TABLE", "DROP INDEX", "SHOW DATABASES", "SHOW TABLES", "SHOW COLUMNS FROM", "DESC", "NOW()", "MIN()", "MAX()", "SUM()", "AVG()"],
    postgresql: ["SELECT", "FROM", "WHERE", "ILIKE", "LIKE", "AND", "OR", "ASC", "DESC", "LIMIT", "OFFSET", "IN", "NOT", "AS", "COUNT", "COUNT(*)", "ORDER BY", "GROUP BY", "DISTINCT", "BETWEEN", "HAVING", "JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL JOIN", "UNION", "INSERT", "INSERT INTO", "UPDATE", "SET", "DELETE", "CREATE DATABASE", "CREATE TABLE", "CREATE INDEX", "ALTER TABLE", "DROP DATABASE", "DROP TABLE", "DROP INDEX", "SHOW ALL", "CURRENT_DATE", "CURRENT_TIMESTAMP", "NOW()", "MIN()", "MAX()", "SUM()", "AVG()"],
    sqlserver: ["SELECT", "FROM", "WHERE", "LIKE", "AND", "OR", "ASC", "DESC", "TOP", "IN", "NOT", "AS", "COUNT", "COUNT(*)", "ORDER BY", "GROUP BY", "DISTINCT", "BETWEEN", "HAVING", "JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL JOIN", "UNION", "INSERT", "INSERT INTO", "UPDATE", "SET", "DELETE", "CREATE DATABASE", "CREATE TABLE", "CREATE INDEX", "ALTER TABLE", "DROP DATABASE", "DROP TABLE", "DROP INDEX", "GETDATE()", "MIN()", "MAX()", "SUM()", "AVG()"],
    oracle: ["SELECT", "FROM", "WHERE", "LIKE", "AND", "OR", "ASC", "DESC", "ROWNUM", "IN", "NOT", "AS", "COUNT", "COUNT(*)", "ORDER BY", "GROUP BY", "DISTINCT", "BETWEEN", "HAVING", "JOIN", "LEFT JOIN", "RIGHT JOIN", "UNION", "INSERT", "INSERT INTO", "UPDATE", "SET", "DELETE", "CREATE TABLE", "CREATE INDEX", "ALTER TABLE", "DROP TABLE", "DROP INDEX", "SYSDATE", "MIN()", "MAX()", "SUM()", "AVG()"],
    sqlite: ["SELECT", "FROM", "WHERE", "LIKE", "AND", "OR", "ASC", "DESC", "LIMIT", "IN", "NOT", "AS", "COUNT", "COUNT(*)", "ORDER BY", "GROUP BY", "DISTINCT", "BETWEEN", "HAVING", "JOIN", "LEFT JOIN", "RIGHT JOIN", "UNION", "INSERT", "INSERT INTO", "UPDATE", "SET", "DELETE", "CREATE TABLE", "CREATE INDEX", "ALTER TABLE", "DROP TABLE", "DROP INDEX", "DATE()", "DATETIME()", "MIN()", "MAX()", "SUM()", "AVG()"],
    default: ["SELECT", "FROM", "WHERE", "LIKE", "AND", "OR", "ASC", "DESC", "LIMIT", "IN", "NOT", "AS", "COUNT", "COUNT(*)", "ORDER BY", "GROUP BY", "DISTINCT", "BETWEEN", "HAVING", "JOIN", "LEFT JOIN", "RIGHT JOIN", "UNION", "INSERT", "INSERT INTO", "UPDATE", "SET", "DELETE", "CREATE TABLE", "CREATE INDEX", "ALTER TABLE", "DROP TABLE", "DROP INDEX", "NOW()", "MIN()", "MAX()", "SUM()", "AVG()"]
}

// 默认使用通用关键字
baseKeywords.push(...keywordMap.default)

let registerSql = () => {
    let monaco = window.monaco;
    if (monaco == null || monaco.languages == null) {
        return
    }
    let Keyword = monaco.languages.CompletionItemKind.Keyword;

    monaco.languages.registerCompletionItemProvider("sql", {
        triggerCharacters: [".", " ", "\t", "\n"],
        provideCompletionItems: function (model, position) {
            let suggestions = []
            sqlNames.forEach(one => {
                suggestions.push({
                    label: one,
                    kind: Keyword,
                    insertText: one + " ",
                })
            })
            baseKeywords.forEach(one => {
                suggestions.push({
                    label: one,
                    kind: Keyword,
                    insertText: one + " ",
                })
            })
            return {
                suggestions: suggestions,
            };
        },
    });
}

let addSqlName = (a) => {
    if (!a) {
        return;
    }
    // 去重并同时收录大小写，方便不同数据库大小写敏感场景
    let names = [a];
    if (a.toLowerCase() !== a) {
        names.push(a.toLowerCase());
    }
    if (a.toUpperCase() !== a) {
        names.push(a.toUpperCase());
    }
    names.forEach(n => {
        if (sqlNames.indexOf(n) < 0) {
            sqlNames.push(n)
        }
    })
}

let setSqlDialect = (dialect) => {
    dialect = ("" + (dialect || "")).toLowerCase();
    let list = keywordMap[dialect] || keywordMap.default;
    baseKeywords.length = 0;
    baseKeywords.push(...list);
}

let registerLanguagesEd = false;
let registerLanguages = () => {
    if (registerLanguagesEd) {
        return;
    }
    registerLanguagesEd = true;
    registerSql()
}

export default {
    addSqlName,
    registerLanguages,
    setSqlDialect,
}
