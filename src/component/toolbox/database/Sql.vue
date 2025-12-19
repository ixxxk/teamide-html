<template>
  <div class="toolbox-database-sql">
    <tm-layout height="100%">
      <tm-layout height="120px" class="">
        <div class="pdlr-10 pdt-5 color-orange ft-12">
          可以选择SQL右击执行或根据SQL导出数据；部分数据库查询不同的库需要输入相应的用户名密码；
        </div>
        <el-form
          class="pdt-5 pdl-10"
          ref="form"
          :model="form"
          size="mini"
          inline
        >
          <el-form-item label="数据库" class="mgb-5">
            <el-select v-model="form.ownerName" style="width: 150px" filterable>
              <el-option value="" label="不选中库|模式"> </el-option>
              <el-option
                v-for="(one, index) in owners"
                :key="index"
                :value="one.ownerName"
                :label="one.ownerName"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="开启事务" class="mgb-5">
            <el-switch v-model="form.openTransaction"> </el-switch>
          </el-form-item>
          <el-form-item label="异常继续" class="mgb-5">
            <el-switch v-model="form.errorContinue"> </el-switch>
          </el-form-item>
          <el-form-item
            v-if="toolboxWorker.isMySql()"
            label="Profiling"
            class="mgb-5"
          >
            <el-switch v-model="form.openProfiling"> </el-switch>
          </el-form-item>
          <el-form-item label="用户名" class="mgb-5" title="可以指定执行用户">
            <el-input v-model="form.execUsername" style="width: 80px">
            </el-input>
          </el-form-item>
          <el-form-item label="密码" class="mgb-5" title="可以指定执行用户密码">
            <el-input
              type="password"
              v-model="form.execPassword"
              autocomplete="new-password"
              style="width: 80px"
            >
            </el-input>
          </el-form-item>
          <el-form-item
            label="最大展示行数"
            class="mgb-5"
            title="指定前端最大数据展示行数，超出的数据将被忽略"
          >
            <el-input v-model="form.showDataMaxSize" style="width: 60px">
            </el-input>
          </el-form-item>
          <el-form-item label="" class="mgb-5">
            <div
              class="mgt-2 tm-btn tm-btn-sm bg-green ft-13"
              :class="{
                'tm-disabled': executeSQLIng,
              }"
              @click="toExecuteSql"
            >
              执行
            </div>

            <div
              class="mgt-2 tm-btn tm-btn-sm bg-teal-8 ft-13"
              @click="toSaveSqlFile"
            >
              保存SQL
            </div>
            <div
              v-if="hasSqlFile"
              class="mgt-2 tm-btn tm-btn-sm color-teal ft-13"
              @click="initSqlFile"
            >
              重新加载SQL
            </div>
            <div
              class="mgt-2 tm-btn tm-btn-sm color-teal ft-13"
              @click="toOpenSql"
            >
              打开保存的SQL
            </div>
          </el-form-item>
        </el-form>
      </tm-layout>
      <tm-layout height="300px" class="" style="overflow: hidden">
        <Editor
          ref="Editor"
          :source="source"
          :value="executeSQL"
          language="sql"
          :change="executeSQLChange"
          :onContextMenu="editorContextmenu"
        ></Editor>
      </tm-layout>
      <tm-layout-bar bottom></tm-layout-bar>
      <tm-layout height="auto" v-loading="executeSQLIng">
        <div class="default-tabs-container">
          <WorkspaceTabs :source="source" :itemsWorker="sqlItemsWorker">
          </WorkspaceTabs>
        </div>
        <div class="default-spans-container">
          <WorkspaceSpans :source="source" :itemsWorker="sqlItemsWorker">
            <template v-slot:span="{ item }">
              <template v-if="item.isExecuteList != null">
                <div class="sql-execute-list">
                  <template v-for="(one, index) in executeList">
                    <div :key="index" class="sql-execute-one mgb-10">
                      <div class="color-grey">
                        <span class="pdr-5">{{ one.startTime }}</span>
                        执行
                      </div>
                      <div>
                        <span class="">{{ one.sql }}</span>
                      </div>
                      <template v-if="one.error">
                        <div class="color-orange">
                          执行异常
                          <span class="color-orange pdlr-5">{{
                            one.error
                          }}</span>
                        </div>
                      </template>
                      <template v-else>
                        <div>
                          <span class="color-green pdr-5"> 执行成功 </span>
                          <template
                            v-if="one.rowsAffected == 0 || one.rowsAffected > 0"
                          >
                            <span class="">
                              受影响行数:
                              <span class="color-green pdlr-5">
                                {{ one.rowsAffected }}
                              </span>
                            </span>
                          </template>
                          <template v-if="one.dataList != null">
                            <span class="">
                              查询行数:
                              <span class="color-green pdlr-5">
                                {{ one.dataSize }}
                              </span>
                            </span>
                            <span v-if="one.showDataMaxSize > 0">
                              最大展示行数:
                              <span class="color-green pdlr-5">
                                {{ one.showDataMaxSize }}
                              </span>
                            </span>
                          </template>
                          <span>
                            耗时:
                            <span class="pdlr-5">{{ one.useTime }}毫秒</span>
                          </span>
                          <template v-if="one.profiling != null">
                            <span
                              class="pdlr-5 tm-link color-orange"
                              @click="toolboxWorker.showSqlProfile(one)"
                            >
                              查看SQL Profile
                            </span>
                          </template>
                        </div>
                      </template>
                    </div>
                  </template>
                </div>
              </template>
              <template v-else-if="item.isSelect">
                <div class="sql-execute-select">
                  <SqlSelectDataList
                    :source="source"
                    :toolboxWorker="toolboxWorker"
                    :item="item"
                  >
                  </SqlSelectDataList>
                </div>
              </template>
            </template>
          </WorkspaceSpans>
        </div>
      </tm-layout>
    </tm-layout>
  </div>
</template>


<script>
import SqlSelectDataList from "./SqlSelectDataList.vue";

export default {
  components: { SqlSelectDataList },
  props: ["source", "toolboxWorker", "actived", "extend", "owners", "tabId"],
  data() {
    let sqlItemsWorker = this.tool.newItemsWorker({
      async onRemoveItem(item) {},
      async onActiveItem(item) {},
    });

    return {
      ready: false,
      executeSQL: null,
      executeSQLIng: false,
      sqlItemsWorker: sqlItemsWorker,
      form: {
        ownerName: null,
        openTransaction: true,
        errorContinue: false,
        execUsername: null,
        execPassword: null,
        showDataMaxSize: 500,
        openProfiling: true,
      },
      executeList: [],
      extendId: null,
      hasSqlFile: false,
      preloadIng: false,
      preloadDone: false,
      preloadNextOwner: null,
    };
  },
  computed: {},
  watch: {
    "form.ownerName"(val) {
      // 切换库时，优先加载对应库的字段补全
      this.preloadDone = false;
      this.preloadCompletion(val);
    },
  },
  methods: {
    onFocus() {
      if (this.inited) {
        return;
      }
      this.$nextTick(async () => {
        this.init();
      });
    },
    async autoSaveSql() {
      if (this.isDestroyed) {
        return;
      }
      let keyValueMap = {};
      if (!this.hasSqlFile) {
        if (this.lastSavedExecuteSQL != this.executeSQL) {
          this.lastSavedExecuteSQL = this.executeSQL;
          keyValueMap.executeSQL = this.executeSQL;
        }
      }
      if (this.lastSavedDatabase != this.form.ownerName) {
        this.lastSavedDatabase = this.form.ownerName;
        keyValueMap.ownerName = this.form.ownerName;
      }
      await this.toolboxWorker.updateOpenTabExtend(this.tabId, keyValueMap);
      setTimeout(this.autoSaveSql, 300);
    },
    async initSqlFile() {
      if (this.extendId == null) {
        return;
      }
      let param = this.toolboxWorker.getWorkParam({
        extendId: this.extendId,
      });

      let res = await this.server.toolbox.extend.loadFile(param);
      if (res.code != 0) {
        this.tool.error(res.msg);
        this.hasSqlFile = false;
      } else {
        this.executeSQL = res.data;
        this.hasSqlFile = true;
        this.$refs.Editor.setValue(this.executeSQL);
      }
    },
    async toSaveSqlFile() {
      if (this.tool.isEmpty(this.extendId)) {
        let name =
          "SQL-" + this.tool.formatDate(new Date(), "yyyy-MM-dd hh:mm:ss");
        let filePath =
          "sql-files/toolbox-" +
          this.toolboxWorker.toolboxId +
          "-" +
          this.tool.formatDate(new Date(), "yyyyMMddhhmmss") +
          "-" +
          this.tool.getNumber() +
          ".sql";
        let param = this.toolboxWorker.getWorkParam({
          extendType: "sqlFile",
          name: name,
          extend: {
            filePath: filePath,
          },
        });
        let res = await this.server.toolbox.extend.save(param);
        if (res.code != 0) {
          this.tool.error(res.msg);
          return;
        }
        this.extendId = res.data.extendId;
        await this.toolboxWorker.updateOpenTabExtend(this.tabId, {
          extendId: this.extendId,
        });
      }
      this.hasSqlFile = true;
      let res = await this.server.toolbox.extend.saveFile({
        extendId: this.extendId,
        text: this.executeSQL || "",
      });
      if (res.code != 0) {
        this.tool.error(res.msg);
      } else {
        this.tool.success("保存成功");
      }
    },
    toOpenSql() {
      this.toolboxWorker.showSqlFiles({
        onOpen: (data) => {
          this.extendId = data.extendId;
          this.toolboxWorker.updateOpenTabExtend(this.tabId, {
            extendId: this.extendId,
          });
          this.initSqlFile();
        },
      });
    },
    async init() {
      this.inited = true;
      this.form.openProfiling = this.toolboxWorker.isMySql();
      if (this.extend) {
        this.extendId = this.extend.extendId;
        this.executeSQL = this.extend.executeSQL;
        this.form.ownerName = this.extend.ownerName;
      }
      this.autoSaveSql();
      this.ready = true;
      this.$refs.Editor.setValue(this.executeSQL);
      this.initSqlFile();
      // 预加载补全词
      this.preloadCompletion();
    },
    executeSQLChange(value) {
      this.executeSQL = value;
    },
    editorContextmenu() {
      let menus = [];
      let sql = this.$refs.Editor.getSelection();
      menus.push({
        text: "执行选中",
        disabled: this.tool.isEmpty(sql),
        onClick: () => {
          this.toExecuteSelectSql();
        },
      });
      menus.push({
        text: "根据选中SQL导出",
        disabled: this.tool.isEmpty(sql),
        onClick: () => {
          this.toExportBySql(sql);
        },
      });
      menus.push({
        text: "执行全部",
        onClick: () => {
          this.toExecuteSql();
        },
      });

      if (menus.length > 0) {
        this.tool.showContextmenu(menus);
      }
    },
    async preloadCompletion(ownerName) {
      if (this.preloadIng) {
        // 记录下一次需要优先加载的库
        this.preloadNextOwner = ownerName;
        return;
      }
      if (this.preloadDone) {
        return;
      }
      this.preloadIng = true;
      try {
        // 1. 所有库名称
        let owners = await this.toolboxWorker.loadOwners();
        // 2. 表名
        for (let i = 0; i < owners.length; i++) {
          let owner = owners[i];
          await this.toolboxWorker.loadTables(owner.ownerName);
        }

        // 3. 字段名（按当前库优先，防止一次性加载过大）
        let targetOwners = [];
        if (ownerName) {
          owners.forEach((o) => {
            if (o.ownerName === ownerName) {
              targetOwners.push(o);
            }
          });
        }
        if (targetOwners.length == 0) {
          // 至少加载第一个库，避免空字段补全
          if (owners.length > 0) {
            targetOwners.push(owners[0]);
          }
        }
        const TABLE_COLUMN_LIMIT = 10; // 控制单库加载表数量，防止大库卡顿
        for (let oi = 0; oi < targetOwners.length; oi++) {
          let owner = targetOwners[oi];
          let tables = await this.toolboxWorker.loadTables(owner.ownerName);
          if (!tables) continue;
          for (
            let ti = 0;
            ti < tables.length && ti < TABLE_COLUMN_LIMIT;
            ti++
          ) {
            await this.toolboxWorker.getTableDetail(
              owner.ownerName,
              tables[ti].tableName
            );
          }
        }
        this.preloadDone = true;
      } catch (e) {
        // 静默失败即可，避免影响查询
        console.error("preload sql completion error", e);
      } finally {
        this.preloadIng = false;
        if (this.preloadNextOwner) {
          let next = this.preloadNextOwner;
          this.preloadNextOwner = null;
          this.preloadDone = false;
          this.preloadCompletion(next);
        }
      }
    },
    toExportBySql(selectSql) {
      let extend = {
        options: {
          from: {
            type: "database",
            toolboxId: this.toolboxWorker.toolboxId,
            selectSql: selectSql,
          },
        },
      };
      if (this.extend && this.extend.databaseName) {
        extend.options.from.databaseName = this.extend.databaseName;
        extend.databaseName = this.extend.databaseName;
      }
      let title = "[导出][根据SQL]";
      if (this.form.ownerName) {
        extend.options.from.ownerName = this.form.ownerName;
      }
      extend.type = "datamove";
      extend.name = title;
      extend.title = title;
      this.toolboxWorker.openTabByExtend(extend);
    },
    async toExecuteSelectSql() {
      let sql = this.$refs.Editor.getSelection();
      if (this.tool.isEmpty(sql)) {
        this.tool.warn("没有SQL被选中");
        return;
      }

      await this.doExecuteSql(sql);
    },
    async toExecuteSql() {
      await this.doExecuteSql(this.executeSQL);
    },
    async doExecuteSql(executeSQL) {
      if (this.executeSQLIng) {
        this.tool.warn("有SQL正在执行");
        return;
      }
      this.executeSQLIng = true;
      let param = this.toolboxWorker.getWorkParam(Object.assign({}, this.form));
      param.showDataMaxSize = Number(param.showDataMaxSize);
      let showDataMaxSize = param.showDataMaxSize;

      param.executeSQL = executeSQL;
      let res = await this.server.database.executeSQL(param);
      if (res.code != 0) {
        this.tool.error(res.msg);
      }
      let data = res.data || {};
      this.executeList = data.executeList || [];
      this.initExecuteList(showDataMaxSize);
      this.executeSQLIng = false;
    },
    initExecuteList(showDataMaxSize) {
      this.cleanTab();
      this.addExecuteListTab();
      let selectIndex = 0;
      this.executeList.forEach((one, index) => {
        one.executeIndex = index;
        if (one.isSelect && one.error == null) {
          one.selectIndex = selectIndex;
          one.showDataMaxSize = showDataMaxSize;
          this.addExecuteSelectTab(one);
          selectIndex++;
        }
      });
    },
    addExecuteListTab() {
      let tab = {};
      tab.key = "执行结果-" + this.tool.getNumber();
      tab.title = "执行结果";
      tab.name = "执行结果";
      tab.isExecuteList = true;
      this.addTab(tab);
      this.doActiveTab(tab);
    },
    addExecuteSelectTab(executeData) {
      executeData.dataList = executeData.dataList || [];
      let title = `第${executeData.selectIndex + 1}条查询结果（${
        executeData.dataSize
      }条记录）`;
      let tab = {
        sql: executeData.sql,
        error: executeData.error,
        rowsAffected: executeData.rowsAffected,
        useTime: executeData.useTime,
      };
      tab.key = "查询结果-" + this.tool.getNumber();
      tab.title = title;
      tab.name = title;
      tab.isSelect = true;
      tab.columnList = executeData.columnList || [];
      tab.dataList = executeData.dataList;
      tab.showDataMaxSize = executeData.showDataMaxSize;
      tab.dataSize = executeData.dataSize;
      tab.profiling = executeData.profiling;
      this.addTab(tab);
      this.doActiveTab(tab);
    },
    getTab(tab) {
      return this.sqlItemsWorker.getItem(tab);
    },
    addTab(tab) {
      this.sqlItemsWorker.addItem(tab);
    },
    cleanTab() {
      return this.sqlItemsWorker.toRemoveAll();
    },
    doActiveTab(tab) {
      return this.sqlItemsWorker.toActiveItem(tab);
    },
  },
  created() {},
  mounted() {
    if (this.actived) {
      this.init();
    }
  },
  beforeDestroy() {
    this.isDestroyed = true;
  },
};
</script>

<style>
.toolbox-database-sql {
  width: 100%;
  height: 100%;
}
.sql-execute-list {
  font-size: 12px;
  user-select: text;
}
.sql-execute-one {
  padding: 0px 5px;
}
.sql-execute-select {
  width: 100%;
  height: 100%;
}
</style>
