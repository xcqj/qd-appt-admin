<template>
  <div class="p-2 page-shell appt-suspend-page">
    <div class="search-wrap">
      <el-card shadow="hover" class="search-panel" :class="{ 'is-collapsed': !showSearch }">
        <template #header>
          <div class="panel-heading search-panel-toggle" @click.stop="showSearch = !showSearch">
            <div><h3>筛选条件</h3></div>
          </div>
        </template>
        <el-form ref="queryFormRef" :model="queryParams" :inline="true" class="query-form">
            
            <el-form-item label="停诊批号" prop="batchNo">
              <el-input v-model="queryParams.batchNo" placeholder="请输入批号" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="停诊范围" prop="scopeType">
              <el-select v-model="queryParams.scopeType" placeholder="请选择停诊范围" clearable filterable style="width: 180px">
                <el-option v-for="opt in SCOPE_TYPE_OPTIONS" :key="String(opt.value)" :label="opt.label" :value="opt.value" />
              </el-select>
            </el-form-item>
            
            <el-form-item label="医务人员" prop="staffId">
              <el-select v-model="queryParams.staffId" placeholder="请选择医务人员" clearable filterable style="width: 200px">
                <el-option v-for="item in staffOptions" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
            
            <el-form-item label="处理状态" prop="status">
              <el-select v-model="queryParams.status" placeholder="请选择处理状态" clearable filterable style="width: 180px">
                <el-option v-for="opt in SUSPEND_STATUS_OPTIONS" :key="String(opt.value)" :label="opt.label" :value="opt.value" />
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
            <h3>停诊登记列表</h3>
          </div>
          <div class="toolbar-actions">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['appt:suspend:export']">导出</el-button>
            <right-toolbar v-model:show-search="showSearch" :search="false" @query-table="getList"></right-toolbar>
          </div>
        </div>
      </template>

      <el-table v-loading="loading" border class="data-table" :data="suspendList">
        <el-table-column label="主键" align="center" prop="id" />
        <el-table-column label="停诊批号" align="center" prop="batchNo" />
        <el-table-column label="停诊范围" align="center" prop="scopeType" :formatter="(r) => labelOf(SCOPE_TYPE_OPTIONS, r.scopeType)" />
        <el-table-column label="范围值" align="center" prop="scopeValue" />
        <el-table-column label="医务人员" align="center" prop="staffId" />
        <el-table-column label="原因" align="center" prop="reason" />
        <el-table-column label="处理状态" align="center" prop="status" :formatter="(r) => labelOf(SUSPEND_STATUS_OPTIONS, r.status)" />
        <el-table-column label="操作人" align="center" prop="operator" />
        <el-table-column label="操作" align="center" width="100" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-button
              v-if="scope.row.status === 'PENDING'"
              type="primary"
              link
              icon="VideoPlay"
              @click="handleHandle(scope.row)"
              v-hasPermi="['appt:suspend:handle']"
            >处理</el-button>
            <span v-else>-</span>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
  </div>
</template>

<script setup name="Suspend" lang="ts">
import {
  handleSuspend,
  listSuspend,
} from '@/api/appt/suspend';
import { SuspendQuery, SuspendVO } from '@/api/appt/suspend/types';
import modal from '@/plugins/modal';
import { useLoading } from '@/hooks/async/useLoading';
import { useDateRangeQuery } from '@/hooks/form/useDateRangeQuery';
import { useSearchReset } from '@/hooks/form/useSearchReset';
import { useSearchToggle } from '@/hooks/form/useSearchToggle';
import { download as requestDownload } from '@/utils/request';
import { useApptOptions } from '@/views/appt/useApptOptions';
import { SCOPE_TYPE_OPTIONS, SUSPEND_STATUS_OPTIONS, labelOf } from '@/views/appt/options';



const suspendList = ref<SuspendVO[]>([]);
const { campusOptions, deptOptions, staffOptions, loadApptOptions } = useApptOptions();
const { loading, withLoading } = useLoading(true);
const { showSearch } = useSearchToggle();
const total = ref(0);
const {
  dateRange: dateRangeCreateTime,
  applyDateRange: applyCreateTimeDateRange,
  resetDateRange: resetCreateTimeDateRange
} = useDateRangeQuery('CreateTime');

const queryFormRef = ref<ElFormInstance>();
const suspendFormRef = ref<ElFormInstance>();

const queryParams = ref<SuspendQuery>({
    pageNum: 1,
    pageSize: 10,
    id: undefined,
    batchNo: undefined,
    scopeType: undefined,
    scopeValue: undefined,
    staffId: undefined,
    reason: undefined,
    status: undefined,
    operator: undefined,
    params: {
      createTime: undefined,
    }
});


/** 查询停诊登记列表 */
const getList = async () => {
  await withLoading(async () => {
    let params = queryParams.value;
params = applyCreateTimeDateRange(params);
    const res = await listSuspend(params);
    suspendList.value = res.data?.rows;
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





/**
 * F2 停诊处理：批量停诊号源 + 被动退号 + 退款 + 通知（重复点击幂等，不会重复退号/退款）
 */
const handleHandle = async (row: any) => {
  try {
    await modal.confirm(
      `确认处理批号「${row.batchNo}」（${labelOf(SCOPE_TYPE_OPTIONS, row.scopeType)} / ${row.scopeValue}）？\n将置停诊该范围排班与号源、把待支付/已预约的单批量被动退号并自动退款，操作不可撤销。`
    );
  } catch {
    return;
  }
  const res: any = await handleSuspend(row.id);
  const data = res?.data ?? {};
  modal.msgSuccess(`处理完成：${data.message ?? ''}`);
  getList();
};

/** 导出按钮操作 */
const handleExport = () => {
  requestDownload(
    'appt/admin/suspend/export',
    {
      ...queryParams.value
    },
    `suspend_${new Date().getTime()}.xlsx`
  );
};



onMounted(() => {
  getList();
  loadApptOptions();
});
</script>

