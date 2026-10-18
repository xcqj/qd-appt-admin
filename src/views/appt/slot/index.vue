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
            <el-form-item label="主键" prop="id">
              <el-input-number v-model="queryParams.id" controls-position="right" />
            </el-form-item>
            <el-form-item label="排班id" prop="scheduleId">
              <el-input-number v-model="queryParams.scheduleId" controls-position="right" />
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
            <el-form-item label="就诊日期" prop="visitDate">
              <el-input v-model="queryParams.visitDate" placeholder="请输入就诊日期（yyyy-MM-dd）" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="午别" prop="period">
              <el-input v-model="queryParams.period" placeholder="请输入午别" clearable @keyup.enter="handleQuery" />
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
            <el-form-item label="挂号费" prop="fee">
              <el-input-number v-model="queryParams.fee" controls-position="right" />
            </el-form-item>
            <el-form-item label="AVAILABLE可约 TAKEN已占 SUSPENDED已停诊 EXPIRED已过期" prop="status">
              <el-input v-model="queryParams.status" placeholder="请输入AVAILABLE可约 TAKEN已占 SUSPENDED已停诊 EXPIRED已过期" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="来源：NORMAL正常 EXTRA加号" prop="source">
              <el-input v-model="queryParams.source" placeholder="请输入来源：NORMAL正常 EXTRA加号" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="占用挂号单id" prop="registrationId">
              <el-input-number v-model="queryParams.registrationId" controls-position="right" />
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
        <el-table-column label="排班id" align="center" prop="scheduleId" />
        <el-table-column label="医务人员id" align="center" prop="staffId" />
        <el-table-column label="科室id" align="center" prop="deptId" />
        <el-table-column label="院区id" align="center" prop="campusId" />
        <el-table-column label="就诊日期" align="center" prop="visitDate" />
        <el-table-column label="午别" align="center" prop="period" />
        <el-table-column label="就诊时刻" align="center" prop="timePoint" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.timePoint, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="挂号费" align="center" prop="fee" />
        <el-table-column label="AVAILABLE可约 TAKEN已占 SUSPENDED已停诊 EXPIRED已过期" align="center" prop="status" />
        <el-table-column label="来源：NORMAL正常 EXTRA加号" align="center" prop="source" />
        <el-table-column label="占用挂号单id" align="center" prop="registrationId" />
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



const slotList = ref<SlotVO[]>([]);
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
});
</script>

