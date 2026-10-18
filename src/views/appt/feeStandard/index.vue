<template>
  <div class="p-2 page-shell appt-feeStandard-page">
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
            <el-form-item label="职称线值" prop="title">
              <el-input v-model="queryParams.title" placeholder="请输入职称线值" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="门诊类型码" prop="clinicType">
              <el-select v-model="queryParams.clinicType" placeholder="请选择门诊类型码" clearable >
                <el-option label="请选择字典生成" value="" />
              </el-select>
            </el-form-item>
            <el-form-item label="挂号费" prop="fee">
              <el-input-number v-model="queryParams.fee" controls-position="right" />
            </el-form-item>
            <el-form-item label="状态：0正常 1停用" prop="status">
              <el-select v-model="queryParams.status" placeholder="请选择状态：0正常 1停用" clearable >
                <el-option label="是" :value="true" />
                <el-option label="否" :value="false" />
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
            <h3>收费标准列表</h3>
          </div>
          <div class="toolbar-actions">
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['appt:feeStandard:add']">新增</el-button>
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['appt:feeStandard:edit']">修改</el-button>
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['appt:feeStandard:remove']">删除</el-button>
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['appt:feeStandard:export']">导出</el-button>
            <right-toolbar v-model:show-search="showSearch" :search="false" @query-table="getList"></right-toolbar>
          </div>
        </div>
      </template>

      <el-table v-loading="loading" border class="data-table" :data="feeStandardList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="主键" align="center" prop="id" />
        <el-table-column label="职称线值" align="center" prop="title" />
        <el-table-column label="门诊类型码" align="center" prop="clinicType" />
        <el-table-column label="挂号费" align="center" prop="fee" />
        <el-table-column label="状态：0正常 1停用" align="center" prop="status" width="120">
          <template #default="scope">
            <el-switch
              v-model="scope.row.status"
              :active-value="true"
              :inactive-value="false"
              disabled
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['appt:feeStandard:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['appt:feeStandard:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改收费标准对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="feeStandardFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="职称线值" prop="title">
          <el-input v-model="form.title" placeholder="请输入职称线值" />
        </el-form-item>
        <el-form-item label="门诊类型码" prop="clinicType">
          <el-select v-model="form.clinicType" placeholder="请选择门诊类型码">
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="挂号费" prop="fee">
          <el-input-number v-model="form.fee" controls-position="right" />
        </el-form-item>
        <el-form-item label="状态：0正常 1停用" prop="status">
          <el-switch
            v-model="form.status"
            :active-value="true"
            :inactive-value="false"
          />
        </el-form-item>
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

<script setup name="FeeStandard" lang="ts">
import {
  addFeeStandard,
  delFeeStandard,
  getFeeStandard,
  listFeeStandard,
  updateFeeStandard
} from '@/api/appt/feeStandard';
import { FeeStandardForm, FeeStandardQuery, FeeStandardVO } from '@/api/appt/feeStandard/types';
import { useLoading } from '@/hooks/async/useLoading';
import { useFormDialog } from '@/hooks/dialog/useFormDialog';
import { useDateRangeQuery } from '@/hooks/form/useDateRangeQuery';
import { useSearchReset } from '@/hooks/form/useSearchReset';
import { useSearchToggle } from '@/hooks/form/useSearchToggle';
import { useTableSelection } from '@/hooks/table/useTableSelection';
import modal from '@/plugins/modal';
import { download as requestDownload } from '@/utils/request';



const feeStandardList = ref<FeeStandardVO[]>([]);
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
const feeStandardFormRef = ref<ElFormInstance>();

const initFormData: FeeStandardForm = {
  id: undefined,
  title: undefined,
  clinicType: undefined,
  fee: undefined,
  status: undefined,
}
const data = reactive<PageData<FeeStandardForm, FeeStandardQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    id: undefined,
    title: undefined,
    clinicType: undefined,
    fee: undefined,
    status: undefined,
    params: {
      createTime: undefined,
    }
  },
  rules: {
id: [
      { required: true, message: "主键不能为空", trigger: "change" }
    ],
title: [
      { required: true, message: "职称线值不能为空", trigger: "blur" }
    ],
clinicType: [
      { required: true, message: "门诊类型码不能为空", trigger: "change" }
    ],
fee: [
      { required: true, message: "挂号费不能为空", trigger: "change" }
    ],
status: [
      { required: true, message: "状态：0正常 1停用不能为空", trigger: "change" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);
const { ids, single, multiple, handleSelectionChange } = useTableSelection<FeeStandardVO>(item => item.id);
const { dialog, resetForm: reset, openDialog, showDialog, closeDialog } = useFormDialog({
  form,
  formRef: feeStandardFormRef,
  initialFormData: initFormData
});

/** 查询收费标准列表 */
const getList = async () => {
  await withLoading(async () => {
    let params = queryParams.value;
params = applyCreateTimeDateRange(params);
    const res = await listFeeStandard(params);
    feeStandardList.value = res.data?.rows;
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
  openDialog('添加收费标准');
};

/** 修改按钮操作 */
const handleUpdate = async (row?: Partial<FeeStandardVO>) => {
  reset();
  const _id = row?.id || ids.value[0];
  const res = await getFeeStandard(_id);
  Object.assign(form.value, res.data);
  showDialog('修改收费标准');
};

/** 提交按钮 */
const submitForm = () => {
  feeStandardFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateFeeStandard(form.value).finally(() => (buttonLoading.value = false));
      } else {
        await addFeeStandard(form.value).finally(() => (buttonLoading.value = false));
      }
      modal.msgSuccess('操作成功');
      closeDialog();
      await getList();
    }
  });
};

/** 删除按钮操作 */
const handleDelete = async (row?: Partial<FeeStandardVO>) => {
  const _ids = row?.id || ids.value;
  await modal.confirm('是否确认删除收费标准编号为"' + _ids + '"的数据项？');
  await delFeeStandard(_ids);
  modal.msgSuccess('删除成功');
  await getList();
};

/** 导出按钮操作 */
const handleExport = () => {
  requestDownload(
    'appt/feeStandard/export',
    {
      ...queryParams.value
    },
    `feeStandard_${new Date().getTime()}.xlsx`
  );
};



onMounted(() => {
  getList();
});
</script>

