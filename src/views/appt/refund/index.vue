<template>
  <div class="p-2 page-shell appt-refund-page">
    <div class="search-wrap">
      <el-card shadow="hover" class="search-panel" :class="{ 'is-collapsed': !showSearch }">
        <template #header>
          <div class="panel-heading search-panel-toggle" @click.stop="showSearch = !showSearch">
            <div><h3>筛选条件</h3></div>
          </div>
        </template>
        <el-form ref="queryFormRef" :model="queryParams" :inline="true" class="query-form">
            
            <el-form-item label="退款单号" prop="refundNo">
              <el-input v-model="queryParams.refundNo" placeholder="请输入退款单号：F + yyyyMMdd + 6位当日序列" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            
            
            
            <el-form-item label="退款状态" prop="status">
              <el-select v-model="queryParams.status" placeholder="请选择退款状态" clearable filterable style="width: 180px">
                <el-option v-for="opt in REFUND_STATUS_OPTIONS" :key="String(opt.value)" :label="opt.label" :value="opt.value" />
              </el-select>
            </el-form-item>
            
            <el-form-item label="退款完成时间" style="width: 308px">
              <el-date-picker
                v-model="dateRangeRefundTime"
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
            <h3>退款单列表</h3>
          </div>
          <div class="toolbar-actions">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['appt:refund:export']">导出</el-button>
            <right-toolbar v-model:show-search="showSearch" :search="false" @query-table="getList"></right-toolbar>
          </div>
        </div>
      </template>

      <el-table v-loading="loading" border class="data-table" :data="refundList">
        <el-table-column label="主键" align="center" prop="id" />
        <el-table-column label="退款单号" align="center" prop="refundNo" />
        <el-table-column label="支付单" align="center" prop="paymentId" />
        <el-table-column label="挂号单" align="center" prop="registrationId" />
        <el-table-column label="退款金额" align="center" prop="amount" />
        <el-table-column label="退款状态" align="center" prop="status" :formatter="(r) => labelOf(REFUND_STATUS_OPTIONS, r.status)" />
        <el-table-column label="退款原因" align="center" prop="reason" />
        <el-table-column label="退款时间" align="center" prop="refundTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.refundTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
  </div>
</template>

<script setup name="Refund" lang="ts">
import {
  listRefund,
} from '@/api/appt/refund';
import { RefundQuery, RefundVO } from '@/api/appt/refund/types';
import { useLoading } from '@/hooks/async/useLoading';
import { useDateRangeQuery } from '@/hooks/form/useDateRangeQuery';
import { useSearchReset } from '@/hooks/form/useSearchReset';
import { useSearchToggle } from '@/hooks/form/useSearchToggle';
import { parseTime } from '@/utils/ruoyi';
import { download as requestDownload } from '@/utils/request';
import { REFUND_STATUS_OPTIONS, labelOf } from '@/views/appt/options';



const refundList = ref<RefundVO[]>([]);
const { loading, withLoading } = useLoading(true);
const { showSearch } = useSearchToggle();
const total = ref(0);
const {
  dateRange: dateRangeRefundTime,
  applyDateRange: applyRefundTimeDateRange,
  resetDateRange: resetRefundTimeDateRange
} = useDateRangeQuery('RefundTime');
const {
  dateRange: dateRangeCreateTime,
  applyDateRange: applyCreateTimeDateRange,
  resetDateRange: resetCreateTimeDateRange
} = useDateRangeQuery('CreateTime');

const queryFormRef = ref<ElFormInstance>();
const refundFormRef = ref<ElFormInstance>();

const queryParams = ref<RefundQuery>({
    pageNum: 1,
    pageSize: 10,
    id: undefined,
    refundNo: undefined,
    paymentId: undefined,
    registrationId: undefined,
    amount: undefined,
    status: undefined,
    reason: undefined,
    params: {
      refundTime: undefined,
      createTime: undefined,
    }
});


/** 查询退款单列表 */
const getList = async () => {
  await withLoading(async () => {
    let params = queryParams.value;
params = applyRefundTimeDateRange(params);
params = applyCreateTimeDateRange(params);
    const res = await listRefund(params);
    refundList.value = res.data?.rows;
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
resetRefundTimeDateRange();
resetCreateTimeDateRange();
  },
  afterReset: () => {
    handleQuery();
  }
});





/** 导出按钮操作 */
const handleExport = () => {
  requestDownload(
    'appt/admin/refund/export',
    {
      ...queryParams.value
    },
    `refund_${new Date().getTime()}.xlsx`
  );
};



onMounted(() => {
  getList();
});
</script>

