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
            <el-form-item label="主键" prop="id">
              <el-input-number v-model="queryParams.id" controls-position="right" />
            </el-form-item>
            <el-form-item label="退款单号：F + yyyyMMdd + 6位当日序列" prop="refundNo">
              <el-input v-model="queryParams.refundNo" placeholder="请输入退款单号：F + yyyyMMdd + 6位当日序列" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="支付单id" prop="paymentId">
              <el-input-number v-model="queryParams.paymentId" controls-position="right" />
            </el-form-item>
            <el-form-item label="挂号单id" prop="registrationId">
              <el-input-number v-model="queryParams.registrationId" controls-position="right" />
            </el-form-item>
            <el-form-item label="退款金额" prop="amount">
              <el-input-number v-model="queryParams.amount" controls-position="right" />
            </el-form-item>
            <el-form-item label="WAIT_REFUND待退款 REFUNDED已退款 FAILED退款失败" prop="status">
              <el-input v-model="queryParams.status" placeholder="请输入WAIT_REFUND待退款 REFUNDED已退款 FAILED退款失败" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="退款原因" prop="reason">
              <el-input v-model="queryParams.reason" placeholder="请输入退款原因" clearable @keyup.enter="handleQuery" />
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['appt:refund:add']">新增</el-button>
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['appt:refund:edit']">修改</el-button>
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['appt:refund:remove']">删除</el-button>
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['appt:refund:export']">导出</el-button>
            <right-toolbar v-model:show-search="showSearch" :search="false" @query-table="getList"></right-toolbar>
          </div>
        </div>
      </template>

      <el-table v-loading="loading" border class="data-table" :data="refundList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="主键" align="center" prop="id" />
        <el-table-column label="退款单号：F + yyyyMMdd + 6位当日序列" align="center" prop="refundNo" />
        <el-table-column label="支付单id" align="center" prop="paymentId" />
        <el-table-column label="挂号单id" align="center" prop="registrationId" />
        <el-table-column label="退款金额" align="center" prop="amount" />
        <el-table-column label="WAIT_REFUND待退款 REFUNDED已退款 FAILED退款失败" align="center" prop="status" />
        <el-table-column label="退款原因" align="center" prop="reason" />
        <el-table-column label="退款完成时间" align="center" prop="refundTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.refundTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['appt:refund:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['appt:refund:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改退款单对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="refundFormRef" :model="form" :rules="rules" label-width="80px">
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

<script setup name="Refund" lang="ts">
import {
  addRefund,
  delRefund,
  getRefund,
  listRefund,
  updateRefund
} from '@/api/appt/refund';
import { RefundForm, RefundQuery, RefundVO } from '@/api/appt/refund/types';
import { useLoading } from '@/hooks/async/useLoading';
import { useFormDialog } from '@/hooks/dialog/useFormDialog';
import { useDateRangeQuery } from '@/hooks/form/useDateRangeQuery';
import { useSearchReset } from '@/hooks/form/useSearchReset';
import { useSearchToggle } from '@/hooks/form/useSearchToggle';
import { useTableSelection } from '@/hooks/table/useTableSelection';
import { parseTime } from '@/utils/ruoyi';
import modal from '@/plugins/modal';
import { download as requestDownload } from '@/utils/request';



const refundList = ref<RefundVO[]>([]);
const buttonLoading = ref(false);
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

const initFormData: RefundForm = {
}
const data = reactive<PageData<RefundForm, RefundQuery>>({
  form: { ...initFormData },
  queryParams: {
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
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);
const { ids, single, multiple, handleSelectionChange } = useTableSelection<RefundVO>(item => item.id);
const { dialog, resetForm: reset, openDialog, showDialog, closeDialog } = useFormDialog({
  form,
  formRef: refundFormRef,
  initialFormData: initFormData
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
resetRefundTimeDateRange();
resetCreateTimeDateRange();
  },
  afterReset: () => {
    handleQuery();
  }
});

/** 新增按钮操作 */
const handleAdd = () => {
  openDialog('添加退款单');
};

/** 修改按钮操作 */
const handleUpdate = async (row?: Partial<RefundVO>) => {
  reset();
  const _id = row?.id || ids.value[0];
  const res = await getRefund(_id);
  Object.assign(form.value, res.data);
  showDialog('修改退款单');
};

/** 提交按钮 */
const submitForm = () => {
  refundFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateRefund(form.value).finally(() => (buttonLoading.value = false));
      } else {
        await addRefund(form.value).finally(() => (buttonLoading.value = false));
      }
      modal.msgSuccess('操作成功');
      closeDialog();
      await getList();
    }
  });
};

/** 删除按钮操作 */
const handleDelete = async (row?: Partial<RefundVO>) => {
  const _ids = row?.id || ids.value;
  await modal.confirm('是否确认删除退款单编号为"' + _ids + '"的数据项？');
  await delRefund(_ids);
  modal.msgSuccess('删除成功');
  await getList();
};

/** 导出按钮操作 */
const handleExport = () => {
  requestDownload(
    'appt/refund/export',
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

