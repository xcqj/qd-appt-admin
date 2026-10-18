<template>
  <div class="p-2 page-shell appt-patient-page">
    <div class="search-wrap">
      <el-card shadow="hover" class="search-panel" :class="{ 'is-collapsed': !showSearch }">
        <template #header>
          <div class="panel-heading search-panel-toggle" @click.stop="showSearch = !showSearch">
            <div><h3>筛选条件</h3></div>
          </div>
        </template>
        <el-form ref="queryFormRef" :model="queryParams" :inline="true" class="query-form">
            
            
            <el-form-item label="姓名" prop="name">
              <el-input v-model="queryParams.name" placeholder="请输入就诊人姓名" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="证件类型" prop="idType">
              <el-select v-model="queryParams.idType" placeholder="请选择证件类型" clearable filterable style="width: 180px">
                <el-option v-for="opt in ID_TYPE_OPTIONS" :key="String(opt.value)" :label="opt.label" :value="opt.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <el-select v-model="queryParams.status" placeholder="请选择状态" clearable filterable style="width: 180px">
                <el-option v-for="opt in STATUS_OPTIONS" :key="String(opt.value)" :label="opt.label" :value="opt.value" />
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
            <h3>就诊人列表</h3>
          </div>
          <div class="toolbar-actions">
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['appt:patient:add']">新增</el-button>
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['appt:patient:edit']">修改</el-button>
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['appt:patient:remove']">删除</el-button>
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['appt:patient:export']">导出</el-button>
            <right-toolbar v-model:show-search="showSearch" :search="false" @query-table="getList"></right-toolbar>
          </div>
        </div>
      </template>

      <el-table v-loading="loading" border class="data-table" :data="patientList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="主键" align="center" prop="id" />
        <el-table-column label="账号" align="center" prop="userId" />
        <el-table-column label="姓名" align="center" prop="name" />
        <el-table-column label="证件类型" align="center" prop="idType" :formatter="(r) => labelOf(ID_TYPE_OPTIONS, r.idType)" />
        <el-table-column label="默认就诊人" align="center" prop="isDefault"  :formatter="(r) => labelOf(IS_DEFAULT_OPTIONS, r.isDefault)" />
        <el-table-column label="状态" align="center" prop="status" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === true ? 'danger' : 'success'">{{ scope.row.status === true ? '停用' : '正常' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['appt:patient:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['appt:patient:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改就诊人对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="patientFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="账号" prop="userId">
          <el-select v-model="form.userId" placeholder="请选择账号" clearable filterable style="width: 100%">
            <el-option v-for="item in userOptions" :key="item.userId" :label="item.nickName || item.userName" :value="item.userId" />
          </el-select>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" placeholder="请输入就诊人姓名" />
        </el-form-item>
        <el-form-item label="证件类型" prop="idType">
          <el-select v-model="form.idType" placeholder="请选择证件类型" clearable filterable style="width: 100%">
            <el-option v-for="opt in ID_TYPE_OPTIONS" :key="String(opt.value)" :label="opt.label" :value="opt.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="证件号" prop="idNo">
          <el-input v-model="form.idNo" placeholder="新增必填；修改留空表示不修改（摘要落库，原文不回显）" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
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

<script setup name="Patient" lang="ts">
import {
  addPatient,
  delPatient,
  getPatient,
  listPatient,
  updatePatient
} from '@/api/appt/patient';
import { PatientForm, PatientQuery, PatientVO } from '@/api/appt/patient/types';
import { listUser } from '@/api/system/user';
import { UserVO } from '@/api/system/user/types';
import { useLoading } from '@/hooks/async/useLoading';
import { useFormDialog } from '@/hooks/dialog/useFormDialog';
import { useDateRangeQuery } from '@/hooks/form/useDateRangeQuery';
import { useSearchReset } from '@/hooks/form/useSearchReset';
import { useSearchToggle } from '@/hooks/form/useSearchToggle';
import { useTableSelection } from '@/hooks/table/useTableSelection';
import modal from '@/plugins/modal';
import { download as requestDownload } from '@/utils/request';
import { ID_TYPE_OPTIONS, STATUS_OPTIONS, labelOf, IS_DEFAULT_OPTIONS } from '@/views/appt/options';



const patientList = ref<PatientVO[]>([]);
/** 账号下拉选项 */
const userOptions = ref<UserVO[]>([]);
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
const patientFormRef = ref<ElFormInstance>();

const initFormData: PatientForm = {
  id: undefined,
  userId: undefined,
  name: undefined,
  idType: undefined,
  idNo: undefined,
  status: false,
}
const data = reactive<PageData<PatientForm, PatientQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    id: undefined,
    userId: undefined,
    name: undefined,
    idType: undefined,
    status: undefined,
    params: {
      createTime: undefined,
    }
  },
  rules: {
id: [
      { required: true, message: "主键不能为空", trigger: "change" }
    ],
userId: [
      { required: true, message: "账号不能为空", trigger: "change" }
    ],
name: [
      { required: true, message: "就诊人姓名不能为空", trigger: "blur" }
    ],
idType: [
      { required: true, message: "证件类型不能为空", trigger: "change" }
    ],
status: [
      { required: true, message: "状态不能为空", trigger: "change" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);
const { ids, single, multiple, handleSelectionChange } = useTableSelection<PatientVO>(item => item.id);
const { dialog, resetForm: reset, openDialog, showDialog, closeDialog } = useFormDialog({
  form,
  formRef: patientFormRef,
  initialFormData: initFormData
});

/** 查询就诊人列表 */
const getList = async () => {
  await withLoading(async () => {
    let params = queryParams.value;
params = applyCreateTimeDateRange(params);
    const res = await listPatient(params);
    patientList.value = res.data?.rows;
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
  openDialog('添加就诊人');
};

/** 修改按钮操作 */
const handleUpdate = async (row?: Partial<PatientVO>) => {
  reset();
  const rowId = row?.id || ids.value[0];
  const res = await getPatient(rowId);
  Object.assign(form.value, res.data);
  showDialog('修改就诊人');
};

/** 提交按钮 */
const submitForm = () => {
  patientFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updatePatient(form.value).finally(() => (buttonLoading.value = false));
      } else {
        await addPatient(form.value).finally(() => (buttonLoading.value = false));
      }
      modal.msgSuccess('操作成功');
      closeDialog();
      await getList();
    }
  });
};

/** 删除按钮操作 */
const handleDelete = async (row?: Partial<PatientVO>) => {
  const rowIds = row?.id || ids.value;
  await modal.confirm('是否确认删除就诊人编号为"' + rowIds + '"的数据项？');
  await delPatient(rowIds);
  modal.msgSuccess('删除成功');
  await getList();
};

/** 导出按钮操作 */
const handleExport = () => {
  requestDownload(
    'appt/admin/patient/export',
    {
      ...queryParams.value
    },
    `patient_${new Date().getTime()}.xlsx`
  );
};



/** 加载账号下拉选项 */
const loadOptions = async () => {
  const res = await listUser({ pageNum: 1, pageSize: 500 });
  userOptions.value = res.data?.rows ?? [];
};

onMounted(() => {
  getList();
  loadOptions();
});
</script>

