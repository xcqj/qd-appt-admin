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
            <el-form-item label="主键" prop="id">
              <el-input-number v-model="queryParams.id" controls-position="right" />
            </el-form-item>
            <el-form-item label="支付单号：P + yyyyMMdd + 6位当日序列" prop="paymentNo">
              <el-input v-model="queryParams.paymentNo" placeholder="请输入支付单号：P + yyyyMMdd + 6位当日序列" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="挂号单id" prop="registrationId">
              <el-input-number v-model="queryParams.registrationId" controls-position="right" />
            </el-form-item>
            <el-form-item label="支付金额" prop="amount">
              <el-input-number v-model="queryParams.amount" controls-position="right" />
            </el-form-item>
            <el-form-item label="渠道：本期仅 MOCK" prop="channel">
              <el-input v-model="queryParams.channel" placeholder="请输入渠道：本期仅 MOCK" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="WAIT_PAY待支付 PAID已支付 CLOSED已关闭 REFUNDED已退款" prop="status">
              <el-input v-model="queryParams.status" placeholder="请输入WAIT_PAY待支付 PAID已支付 CLOSED已关闭 REFUNDED已退款" clearable @keyup.enter="handleQuery" />
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['appt:payment:add']">新增</el-button>
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['appt:payment:edit']">修改</el-button>
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['appt:payment:remove']">删除</el-button>
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['appt:payment:export']">导出</el-button>
            <right-toolbar v-model:show-search="showSearch" :search="false" @query-table="getList"></right-toolbar>
          </div>
        </div>
      </template>

      <el-table v-loading="loading" border class="data-table" :data="paymentList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="主键" align="center" prop="id" />
        <el-table-column label="支付单号：P + yyyyMMdd + 6位当日序列" align="center" prop="paymentNo" />
        <el-table-column label="挂号单id" align="center" prop="registrationId" />
        <el-table-column label="支付金额" align="center" prop="amount" />
        <el-table-column label="渠道：本期仅 MOCK" align="center" prop="channel" />
        <el-table-column label="WAIT_PAY待支付 PAID已支付 CLOSED已关闭 REFUNDED已退款" align="center" prop="status" />
        <el-table-column label="渠道流水号" align="center" prop="tradeNo" />
        <el-table-column label="支付截止时间" align="center" prop="expireTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.expireTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="支付完成时间" align="center" prop="payTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.payTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['appt:payment:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['appt:payment:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改支付单对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="paymentFormRef" :model="form" :rules="rules" label-width="80px">
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Payment" lang="ts">
import {
  addPayment,
  delPayment,
  getPayment,
  listPayment,
  updatePayment
} from '@/api/appt/payment';
import { PaymentForm, PaymentQuery, PaymentVO } from '@/api/appt/payment/types';
import { useLoading } from '@/hooks/async/useLoading';
import { useFormDialog } from '@/hooks/dialog/useFormDialog';
import { useDateRangeQuery } from '@/hooks/form/useDateRangeQuery';
import { useSearchReset } from '@/hooks/form/useSearchReset';
import { useSearchToggle } from '@/hooks/form/useSearchToggle';
import { useTableSelection } from '@/hooks/table/useTableSelection';
import { parseTime } from '@/utils/ruoyi';
import modal from '@/plugins/modal';
import { download as requestDownload } from '@/utils/request';



const paymentList = ref<PaymentVO[]>([]);
const buttonLoading = ref(false);
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

const initFormData: PaymentForm = {
}
const data = reactive<PageData<PaymentForm, PaymentQuery>>({
  form: { ...initFormData },
  queryParams: {
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
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);
const { ids, single, multiple, handleSelectionChange } = useTableSelection<PaymentVO>(item => item.id);
const { dialog, resetForm: reset, openDialog, showDialog, closeDialog } = useFormDialog({
  form,
  formRef: paymentFormRef,
  initialFormData: initFormData
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

/** 取消按钮 */
const cancel = () => {
  reset();
  closeDialog();
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

/** 新增按钮操作 */
const handleAdd = () => {
  openDialog('添加支付单');
};

/** 修改按钮操作 */
const handleUpdate = async (row?: Partial<PaymentVO>) => {
  reset();
  const _id = row?.id || ids.value[0];
  const res = await getPayment(_id);
  Object.assign(form.value, res.data);
  showDialog('修改支付单');
};

/** 提交按钮 */
const submitForm = () => {
  paymentFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updatePayment(form.value).finally(() => (buttonLoading.value = false));
      } else {
        await addPayment(form.value).finally(() => (buttonLoading.value = false));
      }
      modal.msgSuccess('操作成功');
      closeDialog();
      await getList();
    }
  });
};

/** 删除按钮操作 */
const handleDelete = async (row?: Partial<PaymentVO>) => {
  const _ids = row?.id || ids.value;
  await modal.confirm('是否确认删除支付单编号为"' + _ids + '"的数据项？');
  await delPayment(_ids);
  modal.msgSuccess('删除成功');
  await getList();
};

/** 导出按钮操作 */
const handleExport = () => {
  requestDownload(
    'appt/payment/export',
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

