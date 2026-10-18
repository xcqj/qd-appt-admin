<template>
  <div class="p-2 page-shell appt-registration-page">
    <div class="search-wrap">
      <el-card shadow="hover" class="search-panel" :class="{ 'is-collapsed': !showSearch }">
        <template #header>
          <div class="panel-heading search-panel-toggle" @click.stop="showSearch = !showSearch">
            <div><h3>筛选条件</h3></div>
          </div>
        </template>
        <el-form ref="queryFormRef" :model="queryParams" :inline="true" class="query-form">
            
            <el-form-item label="挂号单号" prop="registrationNo">
              <el-input v-model="queryParams.registrationNo" placeholder="请输入挂号单号：R + yyyyMMdd + 6位当日序列" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            
            
            
            <el-form-item label="医务人员" prop="staffId">
              <el-select v-model="queryParams.staffId" placeholder="请选择医务人员" clearable filterable style="width: 200px">
                <el-option v-for="item in staffOptions" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="科室" prop="deptId">
              <el-select v-model="queryParams.deptId" placeholder="请选择科室" clearable filterable style="width: 200px">
                <el-option v-for="item in deptOptions" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="院区" prop="campusId">
              <el-select v-model="queryParams.campusId" placeholder="请选择院区" clearable filterable style="width: 200px">
                <el-option v-for="item in campusOptions" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="就诊日期" prop="visitDate">
              <el-date-picker v-model="queryParams.visitDate" value-format="YYYY-MM-DD" type="date" placeholder="请选择就诊日期" style="width: 180px" />
            </el-form-item>
            <el-form-item label="午别" prop="period">
              <el-select v-model="queryParams.period" placeholder="请选择午别" clearable filterable style="width: 180px">
                <el-option v-for="opt in PERIOD_OPTIONS" :key="String(opt.value)" :label="opt.label" :value="opt.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="就诊时刻" style="width: 308px">
              <el-date-picker
                v-model="dateRangeTimePoint"
                value-format="YYYY-MM-DD HH:mm:ss"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]"
              />
            </el-form-item>
            
            <el-form-item label="结算状态" prop="settleStatus">
              <el-select v-model="queryParams.settleStatus" placeholder="请选择结算状态" clearable filterable style="width: 180px">
                <el-option v-for="opt in SETTLE_STATUS_OPTIONS" :key="String(opt.value)" :label="opt.label" :value="opt.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="挂号状态" prop="status">
              <el-select v-model="queryParams.status" placeholder="请选择挂号状态" clearable filterable style="width: 180px">
                <el-option v-for="opt in REG_STATUS_OPTIONS" :key="String(opt.value)" :label="opt.label" :value="opt.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="签到时间" style="width: 308px">
              <el-date-picker
                v-model="dateRangeSignTime"
                value-format="YYYY-MM-DD HH:mm:ss"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]"
              />
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
            <h3>挂号单列表</h3>
          </div>
          <div class="toolbar-actions">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['appt:registration:export']">导出</el-button>
            <right-toolbar v-model:show-search="showSearch" :search="false" @query-table="getList"></right-toolbar>
          </div>
        </div>
      </template>

      <el-table v-loading="loading" border class="data-table" :data="registrationList">
        <el-table-column label="主键" align="center" prop="id" />
        <el-table-column label="挂号单号" align="center" prop="registrationNo" />
        <el-table-column label="账号" align="center" prop="userId" />
        <el-table-column label="就诊人" align="center" prop="patientId" />
        <el-table-column label="号源" align="center" prop="slotId" />
        <el-table-column label="医务人员" align="center" prop="staffId" />
        <el-table-column label="科室" align="center" prop="deptId" />
        <el-table-column label="院区" align="center" prop="campusId" />
        <el-table-column label="就诊日期" align="center" prop="visitDate" />
        <el-table-column label="午别" align="center" prop="period" :formatter="(r) => labelOf(PERIOD_OPTIONS, r.period)" />
        <el-table-column label="就诊时刻" align="center" prop="timePoint" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.timePoint, '{h}:{i}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="挂号费" align="center" prop="fee" />
        <el-table-column label="有效标记" align="center" prop="activeFlag"  :formatter="(r) => labelOf(REG_ACTIVE_FLAG_OPTIONS, r.activeFlag)" />
        <el-table-column label="结算状态" align="center" prop="settleStatus" :formatter="(r) => labelOf(SETTLE_STATUS_OPTIONS, r.settleStatus)" />
        <el-table-column label="挂号状态" align="center" prop="status" :formatter="(r) => labelOf(REG_STATUS_OPTIONS, r.status)" />
        <el-table-column label="签到时间" align="center" prop="signTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.signTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="签到方式" align="center" prop="signType" :formatter="(r) => labelOf(SIGN_TYPE_OPTIONS, r.signType)" />
        <el-table-column label="退号类型" align="center" prop="cancelType" :formatter="(r) => labelOf(CANCEL_TYPE_OPTIONS, r.cancelType)" />
        <el-table-column label="停诊批号" align="center" prop="suspendBatchNo" />
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
  </div>
</template>

<script setup name="Registration" lang="ts">
import {
  listRegistration,
} from '@/api/appt/registration';
import { RegistrationQuery, RegistrationVO } from '@/api/appt/registration/types';
import { useLoading } from '@/hooks/async/useLoading';
import { useDateRangeQuery } from '@/hooks/form/useDateRangeQuery';
import { useSearchReset } from '@/hooks/form/useSearchReset';
import { useSearchToggle } from '@/hooks/form/useSearchToggle';
import { parseTime } from '@/utils/ruoyi';
import { download as requestDownload } from '@/utils/request';
import { useApptOptions } from '@/views/appt/useApptOptions';
import { PERIOD_OPTIONS, SETTLE_STATUS_OPTIONS, REG_STATUS_OPTIONS, SIGN_TYPE_OPTIONS, CANCEL_TYPE_OPTIONS, labelOf, REG_ACTIVE_FLAG_OPTIONS } from '@/views/appt/options';



const registrationList = ref<RegistrationVO[]>([]);
const { campusOptions, deptOptions, staffOptions, loadApptOptions } = useApptOptions();
const { loading, withLoading } = useLoading(true);
const { showSearch } = useSearchToggle();
const total = ref(0);
const {
  dateRange: dateRangeTimePoint,
  applyDateRange: applyTimePointDateRange,
  resetDateRange: resetTimePointDateRange
} = useDateRangeQuery('TimePoint');
const {
  dateRange: dateRangeSignTime,
  applyDateRange: applySignTimeDateRange,
  resetDateRange: resetSignTimeDateRange
} = useDateRangeQuery('SignTime');
const {
  dateRange: dateRangeCreateTime,
  applyDateRange: applyCreateTimeDateRange,
  resetDateRange: resetCreateTimeDateRange
} = useDateRangeQuery('CreateTime');

const queryFormRef = ref<ElFormInstance>();

const queryParams = ref<RegistrationQuery>({
    pageNum: 1,
    pageSize: 10,
    id: undefined,
    registrationNo: undefined,
    userId: undefined,
    patientId: undefined,
    slotId: undefined,
    staffId: undefined,
    deptId: undefined,
    campusId: undefined,
    visitDate: undefined,
    period: undefined,
    fee: undefined,
    settleStatus: undefined,
    status: undefined,
    signType: undefined,
    cancelType: undefined,
    suspendBatchNo: undefined,
    params: {
      timePoint: undefined,
      signTime: undefined,
      createTime: undefined,
    }
});


/** 查询挂号单列表 */
const getList = async () => {
  await withLoading(async () => {
    let params = queryParams.value;
params = applyTimePointDateRange(params);
params = applySignTimeDateRange(params);
params = applyCreateTimeDateRange(params);
    const res = await listRegistration(params);
    registrationList.value = res.data?.rows;
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
resetTimePointDateRange();
resetSignTimeDateRange();
resetCreateTimeDateRange();
  },
  afterReset: () => {
    handleQuery();
  }
});





/** 导出按钮操作 */
const handleExport = () => {
  requestDownload(
    'appt/admin/registration/export',
    {
      ...queryParams.value
    },
    `registration_${new Date().getTime()}.xlsx`
  );
};



onMounted(() => {
  getList();
  loadApptOptions();
});
</script>

