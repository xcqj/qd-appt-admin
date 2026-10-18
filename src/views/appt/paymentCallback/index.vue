<template>
  <div class="p-2 page-shell appt-paymentCallback-page">
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
            <el-form-item label="支付单号" prop="paymentNo">
              <el-input v-model="queryParams.paymentNo" placeholder="请输入支付单号" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="渠道流水号" prop="tradeNo">
              <el-input v-model="queryParams.tradeNo" placeholder="请输入渠道流水号" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="渠道通知唯一id" prop="notifyId">
              <el-input v-model="queryParams.notifyId" placeholder="请输入渠道通知唯一id" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="渠道" prop="channel">
              <el-input v-model="queryParams.channel" placeholder="请输入渠道" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="验签：0通过 1失败" prop="signFlag">
              <el-input v-model="queryParams.signFlag" placeholder="请输入验签：0通过 1失败" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="PENDING SUCCESS IGNORED重复丢弃 FAILED" prop="processStatus">
              <el-input v-model="queryParams.processStatus" placeholder="请输入PENDING SUCCESS IGNORED重复丢弃 FAILED" clearable @keyup.enter="handleQuery" />
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
            <h3>支付回调列表</h3>
          </div>
          <div class="toolbar-actions">
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['appt:paymentCallback:add']">新增</el-button>
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['appt:paymentCallback:edit']">修改</el-button>
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['appt:paymentCallback:remove']">删除</el-button>
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['appt:paymentCallback:export']">导出</el-button>
            <right-toolbar v-model:show-search="showSearch" :search="false" @query-table="getList"></right-toolbar>
          </div>
        </div>
      </template>

      <el-table v-loading="loading" border class="data-table" :data="paymentCallbackList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="主键" align="center" prop="id" />
        <el-table-column label="支付单号" align="center" prop="paymentNo" />
        <el-table-column label="渠道流水号" align="center" prop="tradeNo" />
        <el-table-column label="渠道通知唯一id" align="center" prop="notifyId" />
        <el-table-column label="渠道" align="center" prop="channel" />
        <el-table-column label="验签：0通过 1失败" align="center" prop="signFlag" />
        <el-table-column label="PENDING SUCCESS IGNORED重复丢弃 FAILED" align="center" prop="processStatus" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['appt:paymentCallback:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['appt:paymentCallback:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改支付回调对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="paymentCallbackFormRef" :model="form" :rules="rules" label-width="80px">
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

<script setup name="PaymentCallback" lang="ts">
import {
  addPaymentCallback,
  delPaymentCallback,
  getPaymentCallback,
  listPaymentCallback,
  updatePaymentCallback
} from '@/api/appt/paymentCallback';
import { PaymentCallbackForm, PaymentCallbackQuery, PaymentCallbackVO } from '@/api/appt/paymentCallback/types';
import { useLoading } from '@/hooks/async/useLoading';
import { useFormDialog } from '@/hooks/dialog/useFormDialog';
import { useDateRangeQuery } from '@/hooks/form/useDateRangeQuery';
import { useSearchReset } from '@/hooks/form/useSearchReset';
import { useSearchToggle } from '@/hooks/form/useSearchToggle';
import { useTableSelection } from '@/hooks/table/useTableSelection';
import modal from '@/plugins/modal';
import { download as requestDownload } from '@/utils/request';



const paymentCallbackList = ref<PaymentCallbackVO[]>([]);
const buttonLoading = ref(false);
const { loading, withLoading } = useLoading(true);
const { showSearch } = useSearchToggle();
const total = ref(0);
const {
  dateRange: dateRangeCreateTime,
  applyDateRange: applyCreateTimeDateRange,
  resetDateRange: resetCreateTimeDateRange
} = useDateRangeQuery('CreateTime');

const queryFormRef = ref<ElFormInstance>();
const paymentCallbackFormRef = ref<ElFormInstance>();

const initFormData: PaymentCallbackForm = {
}
const data = reactive<PageData<PaymentCallbackForm, PaymentCallbackQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    id: undefined,
    paymentNo: undefined,
    tradeNo: undefined,
    notifyId: undefined,
    channel: undefined,
    signFlag: undefined,
    processStatus: undefined,
    params: {
      createTime: undefined,
    }
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);
const { ids, single, multiple, handleSelectionChange } = useTableSelection<PaymentCallbackVO>(item => item.id);
const { dialog, resetForm: reset, openDialog, showDialog, closeDialog } = useFormDialog({
  form,
  formRef: paymentCallbackFormRef,
  initialFormData: initFormData
});

/** 查询支付回调列表 */
const getList = async () => {
  await withLoading(async () => {
    let params = queryParams.value;
params = applyCreateTimeDateRange(params);
    const res = await listPaymentCallback(params);
    paymentCallbackList.value = res.data?.rows;
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
resetCreateTimeDateRange();
  },
  afterReset: () => {
    handleQuery();
  }
});

/** 新增按钮操作 */
const handleAdd = () => {
  openDialog('添加支付回调');
};

/** 修改按钮操作 */
const handleUpdate = async (row?: Partial<PaymentCallbackVO>) => {
  reset();
  const _id = row?.id || ids.value[0];
  const res = await getPaymentCallback(_id);
  Object.assign(form.value, res.data);
  showDialog('修改支付回调');
};

/** 提交按钮 */
const submitForm = () => {
  paymentCallbackFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updatePaymentCallback(form.value).finally(() => (buttonLoading.value = false));
      } else {
        await addPaymentCallback(form.value).finally(() => (buttonLoading.value = false));
      }
      modal.msgSuccess('操作成功');
      closeDialog();
      await getList();
    }
  });
};

/** 删除按钮操作 */
const handleDelete = async (row?: Partial<PaymentCallbackVO>) => {
  const _ids = row?.id || ids.value;
  await modal.confirm('是否确认删除支付回调编号为"' + _ids + '"的数据项？');
  await delPaymentCallback(_ids);
  modal.msgSuccess('删除成功');
  await getList();
};

/** 导出按钮操作 */
const handleExport = () => {
  requestDownload(
    'appt/paymentCallback/export',
    {
      ...queryParams.value
    },
    `paymentCallback_${new Date().getTime()}.xlsx`
  );
};



onMounted(() => {
  getList();
});
</script>

