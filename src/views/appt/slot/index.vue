<template>
  <div class="p-2 page-shell appt-slot-page">
    <div class="search-wrap">
      <el-card shadow="hover" class="search-panel" :class="{ 'is-collapsed': !showSearch }">
        <template #header>
          <div class="panel-heading search-panel-toggle" @click.stop="showSearch = !showSearch">
            <div><h3>筛选条件</h3></div>
          </div>
        </template>
        <el-form ref="queryFormRef" :model="queryParams" :inline="true" class="query-form">
            
            
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
            
            <el-form-item label="号源状态" prop="status">
              <el-select v-model="queryParams.status" placeholder="请选择号源状态" clearable filterable style="width: 180px">
                <el-option v-for="opt in SLOT_STATUS_OPTIONS" :key="String(opt.value)" :label="opt.label" :value="opt.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="来源" prop="source">
              <el-select v-model="queryParams.source" placeholder="请选择来源" clearable filterable style="width: 180px">
                <el-option v-for="opt in SLOT_SOURCE_OPTIONS" :key="String(opt.value)" :label="opt.label" :value="opt.value" />
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
            <h3>号源列表</h3>
          </div>
          <div class="toolbar-actions">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['appt:slot:remove']">删除</el-button>
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['appt:slot:export']">导出</el-button>
            <right-toolbar v-model:show-search="showSearch" :search="false" @query-table="getList"></right-toolbar>
          </div>
        </div>
      </template>

      <el-table v-loading="loading" border class="data-table" :data="slotList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="主键" align="center" prop="id" />
        <el-table-column label="医务人员" align="center" prop="staffName" min-width="110" />
        <el-table-column label="科室" align="center" prop="deptName" min-width="110" />
        <el-table-column label="院区" align="center" prop="campusName" min-width="110" />
        <el-table-column label="就诊日期" align="center" prop="visitDate" />
        <el-table-column label="午别" align="center" prop="period" :formatter="(r) => labelOf(PERIOD_OPTIONS, r.period)" />
        <el-table-column label="就诊时刻" align="center" prop="timePoint" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.timePoint, '{h}:{i}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="挂号费" align="center" prop="fee" />
        <el-table-column label="号源状态" align="center" prop="status" :formatter="(r) => labelOf(SLOT_STATUS_OPTIONS, r.status)" />
        <el-table-column label="来源" align="center" prop="source" :formatter="(r) => labelOf(SLOT_SOURCE_OPTIONS, r.source)" />
        <el-table-column label="挂号单" align="center" prop="registrationId" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['appt:slot:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
  </div>
</template>

<script setup name="Slot" lang="ts">
import {
  delSlot,
  listSlot,
} from '@/api/appt/slot';
import { SlotQuery, SlotVO } from '@/api/appt/slot/types';
import { useLoading } from '@/hooks/async/useLoading';
import { useDateRangeQuery } from '@/hooks/form/useDateRangeQuery';
import { useSearchReset } from '@/hooks/form/useSearchReset';
import { useSearchToggle } from '@/hooks/form/useSearchToggle';
import { useTableSelection } from '@/hooks/table/useTableSelection';
import { parseTime } from '@/utils/ruoyi';
import modal from '@/plugins/modal';
import { download as requestDownload } from '@/utils/request';
import { useApptOptions } from '@/views/appt/useApptOptions';
import { PERIOD_OPTIONS, SLOT_STATUS_OPTIONS, SLOT_SOURCE_OPTIONS, labelOf } from '@/views/appt/options';



const slotList = ref<SlotVO[]>([]);
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
  dateRange: dateRangeCreateTime,
  applyDateRange: applyCreateTimeDateRange,
  resetDateRange: resetCreateTimeDateRange
} = useDateRangeQuery('CreateTime');

const queryFormRef = ref<ElFormInstance>();
const slotFormRef = ref<ElFormInstance>();

const queryParams = ref<SlotQuery>({
    pageNum: 1,
    pageSize: 10,
    id: undefined,
    scheduleId: undefined,
    staffId: undefined,
    deptId: undefined,
    campusId: undefined,
    visitDate: undefined,
    period: undefined,
    fee: undefined,
    status: undefined,
    source: undefined,
    registrationId: undefined,
    params: {
      timePoint: undefined,
      createTime: undefined,
    }
});

const { ids, single, multiple, handleSelectionChange } = useTableSelection<SlotVO>(item => item.id);

/** 查询号源列表 */
const getList = async () => {
  await withLoading(async () => {
    let params = queryParams.value;
params = applyTimePointDateRange(params);
params = applyCreateTimeDateRange(params);
    const res = await listSlot(params);
    slotList.value = res.data?.rows;
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
resetCreateTimeDateRange();
  },
  afterReset: () => {
    handleQuery();
  }
});




/** 删除按钮操作 */
const handleDelete = async (row?: Partial<SlotVO>) => {
  const rowIds = row?.id || ids.value;
  await modal.confirm('是否确认删除号源编号为"' + rowIds + '"的数据项？');
  await delSlot(rowIds);
  modal.msgSuccess('删除成功');
  await getList();
};

/** 导出按钮操作 */
const handleExport = () => {
  requestDownload(
    'appt/admin/slot/export',
    {
      ...queryParams.value
    },
    `slot_${new Date().getTime()}.xlsx`
  );
};



onMounted(() => {
  getList();
  loadApptOptions();
});
</script>

