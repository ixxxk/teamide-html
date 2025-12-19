import http from '@/server/http';

const splitDatabaseName = function (param) {
    param = param || {};
    let databaseName = param.databaseName;
    // 避免把 databaseName 放进 body（后端读取 Query 参数）
    let body = Object.assign({}, param);
    delete body.databaseName;
    return { body, databaseName };
};

const buildConfig = function (databaseName) {
    if (databaseName == null || databaseName === "") {
        return undefined;
    }
    return {
        params: { databaseName: databaseName },
    };
};

let database = {
    check(param) {
        let p = splitDatabaseName(param);
        return http.post('api/database/check', p.body, buildConfig(p.databaseName));
    },
    info(param) {
        let p = splitDatabaseName(param);
        return http.post('api/database/info', p.body, buildConfig(p.databaseName));
    },
    data(param) {
        let p = splitDatabaseName(param);
        return http.post('api/database/data', p.body, buildConfig(p.databaseName));
    },
    owners(param) {
        let p = splitDatabaseName(param);
        return http.post('api/database/owners', p.body, buildConfig(p.databaseName));
    },
    ownerCreate(param) {
        let p = splitDatabaseName(param);
        return http.post('api/database/ownerCreate', p.body, buildConfig(p.databaseName));
    },
    ownerDelete(param) {
        let p = splitDatabaseName(param);
        return http.post('api/database/ownerDelete', p.body, buildConfig(p.databaseName));
    },
    ownerCreateSql(param) {
        let p = splitDatabaseName(param);
        return http.post('api/database/ownerCreateSql', p.body, buildConfig(p.databaseName));
    },
    ddl(param) {
        let p = splitDatabaseName(param);
        return http.post('api/database/ddl', p.body, buildConfig(p.databaseName));
    },
    model(param) {
        let p = splitDatabaseName(param);
        return http.post('api/database/model', p.body, buildConfig(p.databaseName));
    },
    tables(param) {
        let p = splitDatabaseName(param);
        return http.post('api/database/tables', p.body, buildConfig(p.databaseName));
    },
    tableDetail(param) {
        let p = splitDatabaseName(param);
        return http.post('api/database/tableDetail', p.body, buildConfig(p.databaseName));
    },
    tableCreate(param) {
        let p = splitDatabaseName(param);
        return http.post('api/database/tableCreate', p.body, buildConfig(p.databaseName));
    },
    tableCreateSql(param) {
        let p = splitDatabaseName(param);
        return http.post('api/database/tableCreateSql', p.body, buildConfig(p.databaseName));
    },
    tableUpdate(param) {
        let p = splitDatabaseName(param);
        return http.post('api/database/tableUpdate', p.body, buildConfig(p.databaseName));
    },
    tableUpdateSql(param) {
        let p = splitDatabaseName(param);
        return http.post('api/database/tableUpdateSql', p.body, buildConfig(p.databaseName));
    },
    tableDelete(param) {
        let p = splitDatabaseName(param);
        return http.post('api/database/tableDelete', p.body, buildConfig(p.databaseName));
    },
    tableDataTrim(param) {
        let p = splitDatabaseName(param);
        return http.post('api/database/tableDataTrim', p.body, buildConfig(p.databaseName));
    },
    tableData(param) {
        let p = splitDatabaseName(param);
        return http.post('api/database/tableData', p.body, buildConfig(p.databaseName));
    },
    dataListSql(param) {
        let p = splitDatabaseName(param);
        return http.post('api/database/dataListSql', p.body, buildConfig(p.databaseName));
    },
    dataListExec(param) {
        let p = splitDatabaseName(param);
        return http.post('api/database/dataListExec', p.body, buildConfig(p.databaseName));
    },
    executeSQL(param) {
        let p = splitDatabaseName(param);
        return http.post('api/database/executeSQL', p.body, buildConfig(p.databaseName));
    },
    import(param) {
        let p = splitDatabaseName(param);
        return http.post('api/database/import', p.body, buildConfig(p.databaseName));
    },
    export(param) {
        let p = splitDatabaseName(param);
        return http.post('api/database/export', p.body, buildConfig(p.databaseName));
    },
    sync(param) {
        let p = splitDatabaseName(param);
        return http.post('api/database/sync', p.body, buildConfig(p.databaseName));
    },
    taskStatus(param) {
        let p = splitDatabaseName(param);
        return http.post('api/database/taskStatus', p.body, buildConfig(p.databaseName));
    },
    taskStop(param) {
        let p = splitDatabaseName(param);
        return http.post('api/database/taskStop', p.body, buildConfig(p.databaseName));
    },
    taskClean(param) {
        let p = splitDatabaseName(param);
        return http.post('api/database/taskClean', p.body, buildConfig(p.databaseName));
    },
    close(param) {
        let p = splitDatabaseName(param);
        return http.post('api/database/close', p.body, buildConfig(p.databaseName));
    },

    test: {
        start(param) {
            let p = splitDatabaseName(param);
            return http.post('api/database/test/start', p.body, buildConfig(p.databaseName));
        },
        info(param) {
            let p = splitDatabaseName(param);
            return http.post('api/database/test/info', p.body, buildConfig(p.databaseName));
        },
        stop(param) {
            let p = splitDatabaseName(param);
            return http.post('api/database/test/stop', p.body, buildConfig(p.databaseName));
        },
        list(param) {
            let p = splitDatabaseName(param);
            return http.post('api/database/test/list', p.body, buildConfig(p.databaseName));
        },
        delete(param) {
            let p = splitDatabaseName(param);
            return http.post('api/database/test/delete', p.body, buildConfig(p.databaseName));
        },
    },
};


export default database;
