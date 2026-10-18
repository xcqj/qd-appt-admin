<template>
  <div class="p-2 page-shell appt-slotLedger-page">
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
            <el-form-item label="号源id" prop="slotId">
              <el-input-number v-model="queryParams.slotId" controls-position="right" />
            </el-form-item>
            <el-form-item label="GENERATE生成 OCCUPY占用 RELEASE释放 REFILL回补 SUSPEND停诊 EXPIRE过期" prop="action">
              <el-input v-model="queryParams.action" placeholder="请输入GENERATE生成 OCCUPY占用 RELEASE释放 REFILL回补 SUSPEND停诊 EXPIRE过期" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="变更前状态" prop="beforeStatus">
              <el-input v-model="queryParams.beforeStatus" placeholder="请输入变更前状态" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="变更后状态" prop="afterStatus">
              <el-input v-model="queryParams.afterStatus" placeholder="请输入变更后状态" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="关联挂号单id" prop="registrationId">
              <el-input-number v-model="queryParams.registrationId" controls-position="right" />
            </el-form-item>
            <el-form-item label="任务批号" prop="batchNo">
              <el-input v-model="queryParams.batchNo" placeholder="请输入任务批号" clearable @keyup.enter="handleQuery" />
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
            <h3>号源台账列表</h3>
          </div>
          <div class="toolbar-actions">
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['appt:slotLedger:add']">新增</el-button>
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['appt:slotLedger:edit']">修改</el-button>
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['appt:slotLedger:remove']">删除</el-button>
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['appt:slotLedger:export']">导出</el-button>
            <right-toolbar v-model:show-search="showSearch" :search="false" @query-table="getList"></right-toolbar>
          </div>
        </div>
      </template>

      <el-table v-loading="loading" border class="data-table" :data="slotLedgerList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="主键" align="center" prop="id" />
        <el-table-column label="号源id" align="center" prop="slotId" />
        <el-table-column label="GENERATE生成 OCCUPY占用 RELEASE释放 REFILL回补 SUSPEND停诊 EXPIRE过期" align="center" prop="action" />
        <el-table-column label="变更前状态" align="center" prop="beforeStatus" />
        <el-table-column label="变更后状态" align="center" prop="afterStatus" />
        <el-table-column label="关联挂号单id" align="center" prop="registrationId" />
        <el-table-column label="任务批号" align="center" prop="batchNo" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['appt:slotLedger:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['appt:slotLedger:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改号源台账对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="slotLedgerFormRef" :model="form" :rules="rules" label-width="80px">
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

<script setup name="SlotLedger" lang="ts">
import {
  addSlotLedger,
  delSlotLedger,
  getSlotLedger,
  listSlotLedger,
  updateSlotLedger
} from '@/api/appt/slotLedger';
import { SlotLedgerForm, SlotLedgerQuery, SlotLedgerVO } from '@/api/appt/slotLedger/types';
import { useLoading } from '@/hooks/async/useLoading';
import { useFormDialog } from '@/hooks/dialog/useFormDialog';
import { useDateRangeQuery } from '@/hooks/form/useDateRangeQuery';
import { useSearchReset } from '@/hooks/form/useSearchReset';
import { useSearchToggle } from '@/hooks/form/useSearchToggle';
import { useTableSelection } from '@/hooks/table/useTableSelection';
import modal from '@/plugins/modal';
import { download as requestDownload } from '@/utils/request';



const slotLedgerList = ref<SlotLedgerVO[]>([]);
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
const slotLedgerFormRef = ref<ElFormInstance>();

const initFormData: SlotLedgerForm = {
}
const data = reactive<PageData<SlotLedgerForm, SlotLedgerQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    id: undefined,
    slotId: undefined,
    action: undefined,
    beforeStatus: undefined,
    afterStatus: undefined,
    registrationId: undefined,
    batchNo: undefined,
    params: {
      createTime: undefined,
    }
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);
const { ids, single, multiple, handleSelectionChange } = useTableSelection<SlotLedgerVO>(item => item.id);
const { dialog, resetForm: reset, openDialog, showDialog, closeDialog } = useFormDialog({
  form,
  formRef: slotLedgerFormRef,
  initialFormData: initFormData
});

/** 查询号源台账列表 */
const getList = async () => {
  await withLoading(async () => {
    let params = queryParams.value;
params = applyCreateTimeDateRange(params);
    const res = await listSlotLedger(params);
    slotLedgerList.value = res.data?.rows;
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
  openDialog('添加号源台账');
};

/** 修改按钮操作 */
const handleUpdate = async (row?: Partial<SlotLedgerVO>) => {
  reset();
  const _id = row?.id || ids.value[0];
  const res = await getSlotLedger(_id);
  Object.assign(form.value, res.data);
  showDialog('修改号源台账');
};

/** 提交按钮 */
const submitForm = () => {
  slotLedgerFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateSlotLedger(form.value).finally(() => (buttonLoading.value = false));
      } else {
        await addSlotLedger(form.value).finally(() => (buttonLoading.value = false));
      }
      modal.msgSuccess('操作成功');
      closeDialog();
      await getList();
    }
  });
};

/** 删除按钮操作 */
const handleDelete = async (row?: Partial<SlotLedgerVO>) => {
  const _ids = row?.id || ids.value;
  await modal.confirm('是否确认删除号源台账编号为"' + _ids + '"的数据项？');
  await delSlotLedger(_ids);
  modal.msgSuccess('删除成功');
  await getList();
};

/** 导出按钮操作 */
const handleExport = () => {
  requestDownload(
    'appt/slotLedger/export',
    {
      ...queryParams.value
    },
    `slotLedger_${new Date().getTime()}.xlsx`
  );
};



onMounted(() => {
  getList();
});
</script>

