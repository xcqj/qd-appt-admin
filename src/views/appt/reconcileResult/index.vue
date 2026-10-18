<template>
  <div class="p-2 page-shell appt-reconcileResult-page">
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
            <el-form-item label="对账批次号" prop="batchNo">
              <el-input v-model="queryParams.batchNo" placeholder="请输入对账批次号" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="检查项 R1~R7" prop="checkType">
              <el-select v-model="queryParams.checkType" placeholder="请选择检查项 R1~R7" clearable >
                <el-option label="请选择字典生成" value="" />
              </el-select>
            </el-form-item>
            <el-form-item label="目标id" prop="targetId">
              <el-input-number v-model="queryParams.targetId" controls-position="right" />
            </el-form-item>
            <el-form-item label="AUTO_FIX自动修复 ALERT告警" prop="action">
              <el-input v-model="queryParams.action" placeholder="请输入AUTO_FIX自动修复 ALERT告警" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="OK正常 FIXED已修复 ALERT待人工" prop="status">
              <el-input v-model="queryParams.status" placeholder="请输入OK正常 FIXED已修复 ALERT待人工" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="详情" prop="detail">
              <el-input v-model="queryParams.detail" placeholder="请输入详情" clearable @keyup.enter="handleQuery" />
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
            <h3>对账结果列表</h3>
          </div>
          <div class="toolbar-actions">
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['appt:reconcileResult:add']">新增</el-button>
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['appt:reconcileResult:edit']">修改</el-button>
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['appt:reconcileResult:remove']">删除</el-button>
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['appt:reconcileResult:export']">导出</el-button>
            <right-toolbar v-model:show-search="showSearch" :search="false" @query-table="getList"></right-toolbar>
          </div>
        </div>
      </template>

      <el-table v-loading="loading" border class="data-table" :data="reconcileResultList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="主键" align="center" prop="id" />
        <el-table-column label="对账批次号" align="center" prop="batchNo" />
        <el-table-column label="检查项 R1~R7" align="center" prop="checkType" />
        <el-table-column label="目标id" align="center" prop="targetId" />
        <el-table-column label="AUTO_FIX自动修复 ALERT告警" align="center" prop="action" />
        <el-table-column label="OK正常 FIXED已修复 ALERT待人工" align="center" prop="status" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['appt:reconcileResult:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['appt:reconcileResult:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改对账结果对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="reconcileResultFormRef" :model="form" :rules="rules" label-width="80px">
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

<script setup name="ReconcileResult" lang="ts">
import {
  addReconcileResult,
  delReconcileResult,
  getReconcileResult,
  listReconcileResult,
  updateReconcileResult
} from '@/api/appt/reconcileResult';
import { ReconcileResultForm, ReconcileResultQuery, ReconcileResultVO } from '@/api/appt/reconcileResult/types';
import { useLoading } from '@/hooks/async/useLoading';
import { useFormDialog } from '@/hooks/dialog/useFormDialog';
import { useDateRangeQuery } from '@/hooks/form/useDateRangeQuery';
import { useSearchReset } from '@/hooks/form/useSearchReset';
import { useSearchToggle } from '@/hooks/form/useSearchToggle';
import { useTableSelection } from '@/hooks/table/useTableSelection';
import modal from '@/plugins/modal';
import { download as requestDownload } from '@/utils/request';



const reconcileResultList = ref<ReconcileResultVO[]>([]);
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
const reconcileResultFormRef = ref<ElFormInstance>();

const initFormData: ReconcileResultForm = {
}
const data = reactive<PageData<ReconcileResultForm, ReconcileResultQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    id: undefined,
    batchNo: undefined,
    checkType: undefined,
    targetId: undefined,
    action: undefined,
    status: undefined,
    detail: undefined,
    params: {
      createTime: undefined,
    }
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);
const { ids, single, multiple, handleSelectionChange } = useTableSelection<ReconcileResultVO>(item => item.id);
const { dialog, resetForm: reset, openDialog, showDialog, closeDialog } = useFormDialog({
  form,
  formRef: reconcileResultFormRef,
  initialFormData: initFormData
});

/** 查询对账结果列表 */
const getList = async () => {
  await withLoading(async () => {
    let params = queryParams.value;
params = applyCreateTimeDateRange(params);
    const res = await listReconcileResult(params);
    reconcileResultList.value = res.data?.rows;
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
  openDialog('添加对账结果');
};

/** 修改按钮操作 */
const handleUpdate = async (row?: Partial<ReconcileResultVO>) => {
  reset();
  const _id = row?.id || ids.value[0];
  const res = await getReconcileResult(_id);
  Object.assign(form.value, res.data);
  showDialog('修改对账结果');
};

/** 提交按钮 */
const submitForm = () => {
  reconcileResultFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateReconcileResult(form.value).finally(() => (buttonLoading.value = false));
      } else {
        await addReconcileResult(form.value).finally(() => (buttonLoading.value = false));
      }
      modal.msgSuccess('操作成功');
      closeDialog();
      await getList();
    }
  });
};

/** 删除按钮操作 */
const handleDelete = async (row?: Partial<ReconcileResultVO>) => {
  const _ids = row?.id || ids.value;
  await modal.confirm('是否确认删除对账结果编号为"' + _ids + '"的数据项？');
  await delReconcileResult(_ids);
  modal.msgSuccess('删除成功');
  await getList();
};

/** 导出按钮操作 */
const handleExport = () => {
  requestDownload(
    'appt/reconcileResult/export',
    {
      ...queryParams.value
    },
    `reconcileResult_${new Date().getTime()}.xlsx`
  );
};



onMounted(() => {
  getList();
});
</script>

