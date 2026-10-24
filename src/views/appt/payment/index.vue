<template>
  <div class="p-2 page-shell appt-payment-page">
    <div class="search-wrap">
      <el-card shadow="hover" class="search-panel" :class="{ 'is-collapsed': !showSearch }">
        <template #header>
          <div class="panel-heading search-panel-toggle" @click.stop="showSearch = !showSearch">
            <div><h3>筛选条件</h3></div>
          </div>
        </template>
        <el-form ref="queryFormRef" :model="queryParams" :inline="true" class="query-form">
            
            <el-form-item label="支付单号" prop="paymentNo">
              <el-input v-model="queryParams.paymentNo" placeholder="请输入支付单号：P + yyyyMMdd + 6位当日序列" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            
            
            <el-form-item label="支付渠道" prop="channel">
              <el-select v-model="queryParams.channel" placeholder="请选择支付渠道" clearable filterable style="width: 180px">
                <el-option v-for="opt in PAY_CHANNEL_OPTIONS" :key="String(opt.value)" :label="opt.label" :value="opt.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="支付状态" prop="status">
              <el-select v-model="queryParams.status" placeholder="请选择支付状态" clearable filterable style="width: 180px">
                <el-option v-for="opt in PAY_STATUS_OPTIONS" :key="String(opt.value)" :label="opt.label" :value="opt.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="渠道流水号" prop="tradeNo">
              <el-input v-model="queryParams.tradeNo" placeholder="请输入渠道流水号" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="支付截止时间" style="width: 308px">
              <el-date-picker
                v-model="dateRangeExpireTime"
                value-format="YYYY-MM-DD HH:mm:ss"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]"
              />
            </el-form-item>
            <el-form-item label="支付完成时间" style="width: 308px">
              <el-date-picker
                v-model="dateRangePayTime"
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
            <h3>支付单列表</h3>
          </div>
          <div class="toolbar-actions">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['appt:payment:export']">导出</el-button>
            <right-toolbar v-model:show-search="showSearch" :search="false" @query-table="getList"></right-toolbar>
          </div>
        </div>
      </template>

      <el-table v-loading="loading" border class="data-table" :data="paymentList" empty-text="暂无支付单">
        <el-table-column label="主键" align="center" prop="id" />
        <el-table-column label="支付单号" align="center" prop="paymentNo" />
        <el-table-column label="挂号单号" align="center" prop="registrationNo" width="160" />
        <el-table-column label="医务人员" align="center" prop="staffName" min-width="110" />
        <el-table-column label="科室" align="center" prop="deptName" min-width="110" />
        <el-table-column label="院区" align="center" prop="campusName" min-width="100" />
        <el-table-column label="金额" align="center" prop="amount" />
        <el-table-column label="支付渠道" align="center" prop="channel" :formatter="(r) => labelOf(PAY_CHANNEL_OPTIONS, r.channel)" />
        <el-table-column label="支付状态" align="center" prop="status">
          <template #default="scope">
            <appt-status-tag :options="PAY_STATUS_OPTIONS" :value="scope.row.status" />
          </template>
        </el-table-column>
        <el-table-column label="渠道流水号" align="center" prop="tradeNo" />
        <el-table-column label="过期时间" align="center" prop="expireTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.expireTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="支付时间" align="center" prop="payTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.payTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
  </div>
</template>

<script setup name="Payment" lang="ts">
import {
  listPayment,
} from '@/api/appt/payment';
import { PaymentQuery, PaymentVO } from '@/api/appt/payment/types';
import { useLoading } from '@/hooks/async/useLoading';
import { useDateRangeQuery } from '@/hooks/form/useDateRangeQuery';
import { useSearchReset } from '@/hooks/form/useSearchReset';
import { useSearchToggle } from '@/hooks/form/useSearchToggle';
import { parseTime } from '@/utils/ruoyi';
import { download as requestDownload } from '@/utils/request';
import { PAY_CHANNEL_OPTIONS, PAY_STATUS_OPTIONS, labelOf } from '@/views/appt/options';



const paymentList = ref<PaymentVO[]>([]);
const { loading, withLoading } = useLoading(true);
const { showSearch } = useSearchToggle();
const total = ref(0);
const {
  dateRange: dateRangeExpireTime,
  applyDateRange: applyExpireTimeDateRange,
  resetDateRange: resetExpireTimeDateRange
} = useDateRangeQuery('ExpireTime');
const {
  dateRange: dateRangePayTime,
  applyDateRange: applyPayTimeDateRange,
  resetDateRange: resetPayTimeDateRange
} = useDateRangeQuery('PayTime');
const {
  dateRange: dateRangeCreateTime,
  applyDateRange: applyCreateTimeDateRange,
  resetDateRange: resetCreateTimeDateRange
} = useDateRangeQuery('CreateTime');

const queryFormRef = ref<ElFormInstance>();
const paymentFormRef = ref<ElFormInstance>();

const queryParams = ref<PaymentQuery>({
    pageNum: 1,
    pageSize: 10,
    id: undefined,
    paymentNo: undefined,
    registrationId: undefined,
    amount: undefined,
    channel: undefined,
    status: undefined,
    tradeNo: undefined,
    params: {
      expireTime: undefined,
      payTime: undefined,
      createTime: undefined,
    }
});


/** 查询支付单列表 */
const getList = async () => {
  await withLoading(async () => {
    let params = queryParams.value;
params = applyExpireTimeDateRange(params);
params = applyPayTimeDateRange(params);
params = applyCreateTimeDateRange(params);
    const res = await listPayment(params);
    paymentList.value = res.data?.rows;
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
resetExpireTimeDateRange();
resetPayTimeDateRange();
resetCreateTimeDateRange();
  },
  afterReset: () => {
    handleQuery();
  }
});





/** 导出按钮操作 */
const handleExport = () => {
  requestDownload(
    'appt/admin/payment/export',
    {
      ...queryParams.value
    },
    `payment_${new Date().getTime()}.xlsx`
  );
};



onMounted(() => {
  getList();
});
</script>

