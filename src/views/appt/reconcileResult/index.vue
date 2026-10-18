<template>
  <div class="p-2 page-shell appt-reconcileResult-page">
    <div class="search-wrap">
      <el-card shadow="hover" class="search-panel" :class="{ 'is-collapsed': !showSearch }">
        <template #header>
          <div class="panel-heading search-panel-toggle" @click.stop="showSearch = !showSearch">
            <div><h3>筛选条件</h3></div>
          </div>
        </template>
        <el-form ref="queryFormRef" :model="queryParams" :inline="true" class="query-form">
            
            <el-form-item label="批次号" prop="batchNo">
              <el-input v-model="queryParams.batchNo" placeholder="请输入对账批次号" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="检查项" prop="checkType">
              <el-select v-model="queryParams.checkType" placeholder="请选择检查项" clearable filterable style="width: 180px">
                <el-option v-for="opt in CHECK_TYPE_OPTIONS" :key="String(opt.value)" :label="opt.label" :value="opt.value" />
              </el-select>
            </el-form-item>
            
            <el-form-item label="处理动作" prop="action">
              <el-select v-model="queryParams.action" placeholder="请选择处理动作" clearable filterable style="width: 180px">
                <el-option v-for="opt in CHECK_ACTION_OPTIONS" :key="String(opt.value)" :label="opt.label" :value="opt.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="结果状态" prop="status">
              <el-select v-model="queryParams.status" placeholder="请选择结果状态" clearable filterable style="width: 180px">
                <el-option v-for="opt in CHECK_STATUS_OPTIONS" :key="String(opt.value)" :label="opt.label" :value="opt.value" />
              </el-select>
            </el-form-item>
            
            <el-form-item label="创建时间" style="width: 308px">
              <el-date-picker
                v-model="dateRangeCreateTime"
                value-format="YYYY-MM-DD HH:mm:ss"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
              <el-button icon="Refresh" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>
      </el-card>
    </div>

    <el-card shadow="hover" class="table-panel">
      <template #header>
        <div class="toolbar-shell">
          <div class="table-heading">
            <h3>对账结果列表</h3>
          </div>
          <div class="toolbar-actions">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['appt:reconcileResult:export']">导出</el-button>
            <right-toolbar v-model:show-search="showSearch" :search="false" @query-table="getList"></right-toolbar>
          </div>
        </div>
      </template>

      <el-table v-loading="loading" border class="data-table" :data="reconcileResultList">
        <el-table-column label="主键" align="center" prop="id" />
        <el-table-column label="批次号" align="center" prop="batchNo" />
        <el-table-column label="检查项" align="center" prop="checkType" :formatter="(r) => labelOf(CHECK_TYPE_OPTIONS, r.checkType)" />
        <el-table-column label="目标ID" align="center" prop="targetId" />
        <el-table-column label="处理动作" align="center" prop="action" :formatter="(r) => labelOf(CHECK_ACTION_OPTIONS, r.action)" />
        <el-table-column label="结果状态" align="center" prop="status" :formatter="(r) => labelOf(CHECK_STATUS_OPTIONS, r.status)" />
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
  </div>
</template>

<script setup name="ReconcileResult" lang="ts">
import {
  listReconcileResult,
} from '@/api/appt/reconcileResult';
import { ReconcileResultQuery, ReconcileResultVO } from '@/api/appt/reconcileResult/types';
import { useLoading } from '@/hooks/async/useLoading';
import { useDateRangeQuery } from '@/hooks/form/useDateRangeQuery';
import { useSearchReset } from '@/hooks/form/useSearchReset';
import { useSearchToggle } from '@/hooks/form/useSearchToggle';
import { download as requestDownload } from '@/utils/request';
import { CHECK_TYPE_OPTIONS, CHECK_ACTION_OPTIONS, CHECK_STATUS_OPTIONS, labelOf } from '@/views/appt/options';



const reconcileResultList = ref<ReconcileResultVO[]>([]);
const { loading, withLoading } = useLoading(true);
const { showSearch } = useSearchToggle();
const total = ref(0);
const {
  dateRange: dateRangeCreateTime,
  applyDateRange: applyCreateTimeDateRange,
  resetDateRange: resetCreateTimeDateRange
} = useDateRangeQuery('CreateTime');

const queryFormRef = ref<ElFormInstance>();
const reconcileResultFormRef = ref<ElFormInstance>();

const queryParams = ref<ReconcileResultQuery>({
    pageNum: 1,
    pageSize: 10,
    id: undefined,
    batchNo: undefined,
    checkType: undefined,
    targetId: undefined,
    action: undefined,
    status: undefined,
    detail: undefined,
    params: {
      createTime: undefined,
    }
});


/** 查询对账结果列表 */
const getList = async () => {
  await withLoading(async () => {
    let params = queryParams.value;
params = applyCreateTimeDateRange(params);
    const res = await listReconcileResult(params);
    reconcileResultList.value = res.data?.rows;
    total.value = res.data?.total;
  });
};


/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageNum = 1;
  getList();
};

const { resetQuery } = useSearchReset({
  queryFormRef,
  queryParams,
  pageNumKey: 'pageNum',
  pageSizeKey: 'pageSize',
  initialPageSize: 10,
  resetExtras: () => {
resetCreateTimeDateRange();
  },
  afterReset: () => {
    handleQuery();
  }
});





/** 导出按钮操作 */
const handleExport = () => {
  requestDownload(
    'appt/admin/reconcileResult/export',
    {
      ...queryParams.value
    },
    `reconcileResult_${new Date().getTime()}.xlsx`
  );
};



onMounted(() => {
  getList();
});
</script>

