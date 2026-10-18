<template>
  <div class="p-2 page-shell appt-schedule-page">
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
            <el-form-item label="医务人员id" prop="staffId">
              <el-input-number v-model="queryParams.staffId" controls-position="right" />
            </el-form-item>
            <el-form-item label="科室id" prop="deptId">
              <el-input-number v-model="queryParams.deptId" controls-position="right" />
            </el-form-item>
            <el-form-item label="院区id" prop="campusId">
              <el-input-number v-model="queryParams.campusId" controls-position="right" />
            </el-form-item>
            <el-form-item label="门诊类型码" prop="clinicType">
              <el-input v-model="queryParams.clinicType" placeholder="请输入门诊类型码" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="就诊日期" prop="visitDate">
              <el-input v-model="queryParams.visitDate" placeholder="请输入就诊日期" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="午别：AM/PM/NIGHT" prop="period">
              <el-input v-model="queryParams.period" placeholder="请输入午别：AM/PM/NIGHT" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="NORMAL正常 SUSPENDED已停诊" prop="status">
              <el-input v-model="queryParams.status" placeholder="请输入NORMAL正常 SUSPENDED已停诊" clearable @keyup.enter="handleQuery" />
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
            <h3>排班列表</h3>
          </div>
          <div class="toolbar-actions">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['appt:schedule:export']">导出</el-button>
            <right-toolbar v-model:show-search="showSearch" :search="false" @query-table="getList"></right-toolbar>
          </div>
        </div>
      </template>

      <el-table v-loading="loading" border class="data-table" :data="scheduleList">
        <el-table-column label="主键" align="center" prop="id" />
        <el-table-column label="医务人员id" align="center" prop="staffId" />
        <el-table-column label="科室id" align="center" prop="deptId" />
        <el-table-column label="院区id" align="center" prop="campusId" />
        <el-table-column label="门诊类型码" align="center" prop="clinicType" />
        <el-table-column label="就诊日期" align="center" prop="visitDate" />
        <el-table-column label="午别：AM/PM/NIGHT" align="center" prop="period" />
        <el-table-column label="NORMAL正常 SUSPENDED已停诊" align="center" prop="status" />
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
  </div>
</template>

<script setup name="Schedule" lang="ts">
import {
  listSchedule,
} from '@/api/appt/schedule';
import { ScheduleQuery, ScheduleVO } from '@/api/appt/schedule/types';
import { useLoading } from '@/hooks/async/useLoading';
import { useDateRangeQuery } from '@/hooks/form/useDateRangeQuery';
import { useSearchReset } from '@/hooks/form/useSearchReset';
import { useSearchToggle } from '@/hooks/form/useSearchToggle';
import { download as requestDownload } from '@/utils/request';



const scheduleList = ref<ScheduleVO[]>([]);
const { loading, withLoading } = useLoading(true);
const { showSearch } = useSearchToggle();
const total = ref(0);
const {
  dateRange: dateRangeCreateTime,
  applyDateRange: applyCreateTimeDateRange,
  resetDateRange: resetCreateTimeDateRange
} = useDateRangeQuery('CreateTime');

const queryFormRef = ref<ElFormInstance>();
const scheduleFormRef = ref<ElFormInstance>();

const queryParams = ref<ScheduleQuery>({
    pageNum: 1,
    pageSize: 10,
    id: undefined,
    staffId: undefined,
    deptId: undefined,
    campusId: undefined,
    clinicType: undefined,
    visitDate: undefined,
    period: undefined,
    status: undefined,
    params: {
      createTime: undefined,
    }
});


/** 查询排班列表 */
const getList = async () => {
  await withLoading(async () => {
    let params = queryParams.value;
params = applyCreateTimeDateRange(params);
    const res = await listSchedule(params);
    scheduleList.value = res.data?.rows;
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
    'appt/admin/schedule/export',
    {
      ...queryParams.value
    },
    `schedule_${new Date().getTime()}.xlsx`
  );
};



onMounted(() => {
  getList();
});
</script>

