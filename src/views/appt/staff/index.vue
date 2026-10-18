<template>
  <div class="p-2 page-shell appt-staff-page">
    <div class="search-wrap">
      <el-card shadow="hover" class="search-panel" :class="{ 'is-collapsed': !showSearch }">
        <template #header>
          <div class="panel-heading search-panel-toggle" @click.stop="showSearch = !showSearch">
            <div><h3>筛选条件</h3></div>
          </div>
        </template>
        <el-form ref="queryFormRef" :model="queryParams" :inline="true" class="query-form">
            
            <el-form-item label="所属院区" prop="campusId">
              <el-select v-model="queryParams.campusId" placeholder="请选择所属院区" clearable filterable style="width: 180px">
                <el-option v-for="item in campusOptions" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="所属科室" prop="deptId">
              <el-select v-model="queryParams.deptId" placeholder="请选择所属科室" clearable filterable style="width: 180px">
                <el-option v-for="item in deptOptions" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="姓名" prop="name">
              <el-input v-model="queryParams.name" placeholder="请输入姓名" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="职称" prop="title">
              <el-select v-model="queryParams.title" placeholder="请选择职称" clearable filterable style="width: 180px">
                <el-option v-for="opt in TITLE_OPTIONS" :key="String(opt.value)" :label="opt.label" :value="opt.value" />
              </el-select>
            </el-form-item>
            
            <el-form-item label="人员类型" prop="type">
              <el-select v-model="queryParams.type" placeholder="请选择人员类型" clearable filterable style="width: 180px">
                <el-option v-for="opt in STAFF_TYPE_OPTIONS" :key="String(opt.value)" :label="opt.label" :value="opt.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="门诊类型" prop="clinicType">
              <el-select v-model="queryParams.clinicType" placeholder="请选择门诊类型" clearable filterable style="width: 180px">
                <el-option v-for="opt in CLINIC_TYPE_OPTIONS" :key="String(opt.value)" :label="opt.label" :value="opt.value" />
              </el-select>
            </el-form-item>
            
            
            <el-form-item label="状态" prop="status">
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
            <h3>医务人员列表</h3>
          </div>
          <div class="toolbar-actions">
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['appt:staff:add']">新增</el-button>
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['appt:staff:edit']">修改</el-button>
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['appt:staff:remove']">删除</el-button>
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['appt:staff:export']">导出</el-button>
            <right-toolbar v-model:show-search="showSearch" :search="false" @query-table="getList"></right-toolbar>
          </div>
        </div>
      </template>

      <el-table v-loading="loading" border class="data-table" :data="staffList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="主键" align="center" prop="id" />
        <el-table-column label="所属院区" align="center" prop="campusId" />
        <el-table-column label="所属科室" align="center" prop="deptId" />
        <el-table-column label="姓名" align="center" prop="name" />
        <el-table-column label="头像" align="center" prop="avatar" width="90">
          <template #default="scope">
            <image-preview v-if="scope.row.avatar" :src="scope.row.avatar" :width="40" :height="40" />
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="职称" align="center" prop="title" :formatter="(r) => labelOf(TITLE_OPTIONS, r.title)" />
        <el-table-column label="学位" align="center" prop="degree" />
        <el-table-column label="人员类型" align="center" prop="type" :formatter="(r) => labelOf(STAFF_TYPE_OPTIONS, r.type)" />
        <el-table-column label="门诊类型" align="center" prop="clinicType" :formatter="(r) => labelOf(CLINIC_TYPE_OPTIONS, r.clinicType)" />
        <el-table-column label="排序" align="center" prop="sort" />
        <el-table-column label="状态" align="center" prop="status" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === true ? 'danger' : 'success'">{{ scope.row.status === true ? '停用' : '正常' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['appt:staff:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['appt:staff:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改医务人员对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="staffFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="所属院区" prop="campusId">
          <el-select v-model="form.campusId" placeholder="请选择所属院区" clearable filterable style="width: 100%">
            <el-option v-for="item in campusOptions" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="所属科室" prop="deptId">
          <el-select v-model="form.deptId" placeholder="请选择所属科室" clearable filterable style="width: 100%">
            <el-option v-for="item in deptOptions" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="头像" prop="avatar">
          <image-upload v-model="form.avatar" :limit="1" />
        </el-form-item>
        <el-form-item label="职称" prop="title">
          <el-select v-model="form.title" placeholder="请选择职称" clearable filterable style="width: 100%">
            <el-option v-for="opt in TITLE_OPTIONS" :key="String(opt.value)" :label="opt.label" :value="opt.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="学位" prop="degree">
          <el-input v-model="form.degree" placeholder="请输入学位" />
        </el-form-item>
        <el-form-item label="人员类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择人员类型" clearable filterable style="width: 100%">
            <el-option v-for="opt in STAFF_TYPE_OPTIONS" :key="String(opt.value)" :label="opt.label" :value="opt.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="门诊类型" prop="clinicType">
          <el-select v-model="form.clinicType" placeholder="请选择门诊类型" clearable filterable style="width: 100%">
            <el-option v-for="opt in CLINIC_TYPE_OPTIONS" :key="String(opt.value)" :label="opt.label" :value="opt.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="简介" prop="intro">
          <el-input v-model="form.intro" type="textarea" :rows="3" placeholder="请输入简介" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="form.sort" controls-position="right" />
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

<script setup name="Staff" lang="ts">
import {
  addStaff,
  delStaff,
  getStaff,
  listStaff,
  updateStaff
} from '@/api/appt/staff';
import { StaffForm, StaffQuery, StaffVO } from '@/api/appt/staff/types';
import { useApptOptions } from '@/views/appt/useApptOptions';
import { useLoading } from '@/hooks/async/useLoading';
import { useFormDialog } from '@/hooks/dialog/useFormDialog';
import { useDateRangeQuery } from '@/hooks/form/useDateRangeQuery';
import { useSearchReset } from '@/hooks/form/useSearchReset';
import { useSearchToggle } from '@/hooks/form/useSearchToggle';
import { useTableSelection } from '@/hooks/table/useTableSelection';
import modal from '@/plugins/modal';
import { download as requestDownload } from '@/utils/request';
import { CLINIC_TYPE_OPTIONS, TITLE_OPTIONS, STAFF_TYPE_OPTIONS, labelOf } from '@/views/appt/options';



const staffList = ref<StaffVO[]>([]);
const { campusOptions, deptOptions, loadApptOptions } = useApptOptions();
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
const staffFormRef = ref<ElFormInstance>();

const initFormData: StaffForm = {
  id: undefined,
  campusId: undefined,
  deptId: undefined,
  name: undefined,
  avatar: undefined,
  title: undefined,
  degree: undefined,
  type: undefined,
  clinicType: undefined,
  intro: undefined,
  sort: undefined,
  status: false,
}
const data = reactive<PageData<StaffForm, StaffQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    id: undefined,
    campusId: undefined,
    deptId: undefined,
    name: undefined,
    title: undefined,
    degree: undefined,
    type: undefined,
    clinicType: undefined,
    intro: undefined,
    sort: undefined,
    status: undefined,
    params: {
      createTime: undefined,
    }
  },
  rules: {
id: [
      { required: true, message: "主键不能为空", trigger: "change" }
    ],
campusId: [
      { required: true, message: "所属院区不能为空", trigger: "change" }
    ],
deptId: [
      { required: true, message: "所属科室不能为空", trigger: "change" }
    ],
name: [
      { required: true, message: "姓名不能为空", trigger: "blur" }
    ],
title: [
      { required: true, message: "职称：CHIEF主任医师 ASSOC_CHIEF副主任医师 ATTENDING主治医师 PHYSICIAN医师 ASSOC_CHIEF_NURSE副主任护师不能为空", trigger: "blur" }
    ],
type: [
      { required: true, message: "类型：DOCTOR医生 NURSE护士不能为空", trigger: "change" }
    ],
clinicType: [
      { required: true, message: "门诊类型码不能为空", trigger: "change" }
    ],
status: [
      { required: true, message: "状态：0正常 1停用不能为空", trigger: "change" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);
const { ids, single, multiple, handleSelectionChange } = useTableSelection<StaffVO>(item => item.id);
const { dialog, resetForm: reset, openDialog, showDialog, closeDialog } = useFormDialog({
  form,
  formRef: staffFormRef,
  initialFormData: initFormData
});

/** 查询医务人员列表 */
const getList = async () => {
  await withLoading(async () => {
    let params = queryParams.value;
params = applyCreateTimeDateRange(params);
    const res = await listStaff(params);
    staffList.value = res.data?.rows;
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
  openDialog('添加医务人员');
};

/** 修改按钮操作 */
const handleUpdate = async (row?: Partial<StaffVO>) => {
  reset();
  const rowId = row?.id || ids.value[0];
  const res = await getStaff(rowId);
  Object.assign(form.value, res.data);
  showDialog('修改医务人员');
};

/** 提交按钮 */
const submitForm = () => {
  staffFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateStaff(form.value).finally(() => (buttonLoading.value = false));
      } else {
        await addStaff(form.value).finally(() => (buttonLoading.value = false));
      }
      modal.msgSuccess('操作成功');
      closeDialog();
      await getList();
    }
  });
};

/** 删除按钮操作 */
const handleDelete = async (row?: Partial<StaffVO>) => {
  const rowIds = row?.id || ids.value;
  await modal.confirm('是否确认删除医务人员编号为"' + rowIds + '"的数据项？');
  await delStaff(rowIds);
  modal.msgSuccess('删除成功');
  await getList();
};

/** 导出按钮操作 */
const handleExport = () => {
  requestDownload(
    'appt/admin/staff/export',
    {
      ...queryParams.value
    },
    `staff_${new Date().getTime()}.xlsx`
  );
};



onMounted(() => {
  getList();
  loadApptOptions();
});
</script>

