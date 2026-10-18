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
            <el-form-item label="主键" prop="id">
              <el-input-number v-model="queryParams.id" controls-position="right" />
            </el-form-item>
            <el-form-item label="批号" prop="batchNo">
              <el-input v-model="queryParams.batchNo" placeholder="请输入批号" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="范围：SCHEDULE单排班 STAFF_DATE某医生某日 CAMPUS_DATE院区某日" prop="scopeType">
              <el-input v-model="queryParams.scopeType" placeholder="请输入范围：SCHEDULE单排班 STAFF_DATE某医生某日 CAMPUS_DATE院区某日" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="范围值：SCHEDULE 存 scheduleId；STAFF_DATE 存 visitDate；CAMPUS_DATE 存 campusId:date" prop="scopeValue">
              <el-input v-model="queryParams.scopeValue" placeholder="请输入范围值：SCHEDULE 存 scheduleId；STAFF_DATE 存 visitDate；CAMPUS_DATE 存 campusId:date" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="医务人员id" prop="staffId">
              <el-input-number v-model="queryParams.staffId" controls-position="right" />
            </el-form-item>
            <el-form-item label="停诊原因" prop="reason">
              <el-input v-model="queryParams.reason" placeholder="请输入停诊原因" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="PENDING待处理 HANDLED已处理" prop="status">
              <el-input v-model="queryParams.status" placeholder="请输入PENDING待处理 HANDLED已处理" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="操作人" prop="operator">
              <el-input v-model="queryParams.operator" placeholder="请输入操作人" clearable @keyup.enter="handleQuery" />
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
        <el-table-column label="批号" align="center" prop="batchNo" />
        <el-table-column label="范围：SCHEDULE单排班 STAFF_DATE某医生某日 CAMPUS_DATE院区某日" align="center" prop="scopeType" />
        <el-table-column label="范围值：SCHEDULE 存 scheduleId；STAFF_DATE 存 visitDate；CAMPUS_DATE 存 campusId:date" align="center" prop="scopeValue" />
        <el-table-column label="医务人员id" align="center" prop="staffId" />
        <el-table-column label="停诊原因" align="center" prop="reason" />
        <el-table-column label="PENDING待处理 HANDLED已处理" align="center" prop="status" />
        <el-table-column label="操作人" align="center" prop="operator" />
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
  </div>
</template>

<script setup name="Suspend" lang="ts">
import {
  listSuspend,
} from '@/api/appt/suspend';
import { SuspendQuery, SuspendVO } from '@/api/appt/suspend/types';
import { useLoading } from '@/hooks/async/useLoading';
import { useDateRangeQuery } from '@/hooks/form/useDateRangeQuery';
import { useSearchReset } from '@/hooks/form/useSearchReset';
import { useSearchToggle } from '@/hooks/form/useSearchToggle';
import { download as requestDownload } from '@/utils/request';



const suspendList = ref<SuspendVO[]>([]);
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
});
</script>

