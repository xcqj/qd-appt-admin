<template>
  <div class="p-2 page-shell appt-jobLog-page">
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
            <el-form-item label="任务名" prop="jobName">
              <el-input v-model="queryParams.jobName" placeholder="请输入任务名" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="批号" prop="batchNo">
              <el-input v-model="queryParams.batchNo" placeholder="请输入批号" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="开始时间" style="width: 308px">
              <el-date-picker
                v-model="dateRangeStartTime"
                value-format="YYYY-MM-DD HH:mm:ss"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]"
              />
            </el-form-item>
            <el-form-item label="结束时间" style="width: 308px">
              <el-date-picker
                v-model="dateRangeEndTime"
                value-format="YYYY-MM-DD HH:mm:ss"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]"
              />
            </el-form-item>
            <el-form-item label="RUNNING SUCCESS FAIL SKIPPED" prop="status">
              <el-input v-model="queryParams.status" placeholder="请输入RUNNING SUCCESS FAIL SKIPPED" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="影响行数" prop="affectedRows">
              <el-input-number v-model="queryParams.affectedRows" controls-position="right" />
            </el-form-item>
            <el-form-item label="结果信息" prop="message">
              <el-input v-model="queryParams.message" placeholder="请输入结果信息" clearable @keyup.enter="handleQuery" />
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
            <h3>任务日志列表</h3>
          </div>
          <div class="toolbar-actions">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['appt:jobLog:export']">导出</el-button>
            <right-toolbar v-model:show-search="showSearch" :search="false" @query-table="getList"></right-toolbar>
          </div>
        </div>
      </template>

      <el-table v-loading="loading" border class="data-table" :data="jobLogList">
        <el-table-column label="主键" align="center" prop="id" />
        <el-table-column label="任务名" align="center" prop="jobName" />
        <el-table-column label="批号" align="center" prop="batchNo" />
        <el-table-column label="开始时间" align="center" prop="startTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.startTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="结束时间" align="center" prop="endTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.endTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="RUNNING SUCCESS FAIL SKIPPED" align="center" prop="status" />
        <el-table-column label="影响行数" align="center" prop="affectedRows" />
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
  </div>
</template>

<script setup name="JobLog" lang="ts">
import {
  listJobLog,
} from '@/api/appt/jobLog';
import { JobLogQuery, JobLogVO } from '@/api/appt/jobLog/types';
import { useLoading } from '@/hooks/async/useLoading';
import { useDateRangeQuery } from '@/hooks/form/useDateRangeQuery';
import { useSearchReset } from '@/hooks/form/useSearchReset';
import { useSearchToggle } from '@/hooks/form/useSearchToggle';
import { parseTime } from '@/utils/ruoyi';
import { download as requestDownload } from '@/utils/request';



const jobLogList = ref<JobLogVO[]>([]);
const { loading, withLoading } = useLoading(true);
const { showSearch } = useSearchToggle();
const total = ref(0);
const {
  dateRange: dateRangeStartTime,
  applyDateRange: applyStartTimeDateRange,
  resetDateRange: resetStartTimeDateRange
} = useDateRangeQuery('StartTime');
const {
  dateRange: dateRangeEndTime,
  applyDateRange: applyEndTimeDateRange,
  resetDateRange: resetEndTimeDateRange
} = useDateRangeQuery('EndTime');
const {
  dateRange: dateRangeCreateTime,
  applyDateRange: applyCreateTimeDateRange,
  resetDateRange: resetCreateTimeDateRange
} = useDateRangeQuery('CreateTime');

const queryFormRef = ref<ElFormInstance>();
const jobLogFormRef = ref<ElFormInstance>();

const queryParams = ref<JobLogQuery>({
    pageNum: 1,
    pageSize: 10,
    id: undefined,
    jobName: undefined,
    batchNo: undefined,
    status: undefined,
    affectedRows: undefined,
    message: undefined,
    params: {
      startTime: undefined,
      endTime: undefined,
      createTime: undefined,
    }
});


/** 查询任务日志列表 */
const getList = async () => {
  await withLoading(async () => {
    let params = queryParams.value;
params = applyStartTimeDateRange(params);
params = applyEndTimeDateRange(params);
params = applyCreateTimeDateRange(params);
    const res = await listJobLog(params);
    jobLogList.value = res.data?.rows;
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
resetStartTimeDateRange();
resetEndTimeDateRange();
resetCreateTimeDateRange();
  },
  afterReset: () => {
    handleQuery();
  }
});





/** 导出按钮操作 */
const handleExport = () => {
  requestDownload(
    'appt/admin/jobLog/export',
    {
      ...queryParams.value
    },
    `jobLog_${new Date().getTime()}.xlsx`
  );
};



onMounted(() => {
  getList();
});
</script>

