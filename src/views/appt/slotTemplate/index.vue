<template>
  <div class="p-2 page-shell appt-slotTemplate-page">
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
            <el-form-item label="医务人员id" prop="staffId">
              <el-input-number v-model="queryParams.staffId" controls-position="right" />
            </el-form-item>
            <el-form-item label="午别：AM上午 PM下午 NIGHT夜间" prop="period">
              <el-input v-model="queryParams.period" placeholder="请输入午别：AM上午 PM下午 NIGHT夜间" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="门诊类型码" prop="clinicType">
              <el-input v-model="queryParams.clinicType" placeholder="请输入门诊类型码" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="起始时刻" prop="startTime">
              <el-input v-model="queryParams.startTime" placeholder="请输入起始时刻" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="结束时刻" prop="endTime">
              <el-input v-model="queryParams.endTime" placeholder="请输入结束时刻" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="步长" prop="stepMinutes">
              <el-input-number v-model="queryParams.stepMinutes" controls-position="right" />
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
            <h3>时段模板列表</h3>
          </div>
          <div class="toolbar-actions">
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['appt:slotTemplate:add']">新增</el-button>
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['appt:slotTemplate:edit']">修改</el-button>
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['appt:slotTemplate:remove']">删除</el-button>
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['appt:slotTemplate:export']">导出</el-button>
            <right-toolbar v-model:show-search="showSearch" :search="false" @query-table="getList"></right-toolbar>
          </div>
        </div>
      </template>

      <el-table v-loading="loading" border class="data-table" :data="slotTemplateList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="主键" align="center" prop="id" />
        <el-table-column label="医务人员id" align="center" prop="staffId" />
        <el-table-column label="午别：AM上午 PM下午 NIGHT夜间" align="center" prop="period" />
        <el-table-column label="门诊类型码" align="center" prop="clinicType" />
        <el-table-column label="起始时刻" align="center" prop="startTime" />
        <el-table-column label="结束时刻" align="center" prop="endTime" />
        <el-table-column label="步长" align="center" prop="stepMinutes" />
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
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['appt:slotTemplate:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['appt:slotTemplate:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改时段模板对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="slotTemplateFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="医务人员id" prop="staffId">
          <el-input-number v-model="form.staffId" controls-position="right" />
        </el-form-item>
        <el-form-item label="午别：AM上午 PM下午 NIGHT夜间" prop="period">
          <el-input v-model="form.period" placeholder="请输入午别：AM上午 PM下午 NIGHT夜间" />
        </el-form-item>
        <el-form-item label="门诊类型码" prop="clinicType">
          <el-input v-model="form.clinicType" placeholder="请输入门诊类型码" />
        </el-form-item>
        <el-form-item label="起始时刻" prop="startTime">
          <el-input v-model="form.startTime" placeholder="请输入起始时刻" />
        </el-form-item>
        <el-form-item label="结束时刻" prop="endTime">
          <el-input v-model="form.endTime" placeholder="请输入结束时刻" />
        </el-form-item>
        <el-form-item label="步长" prop="stepMinutes">
          <el-input-number v-model="form.stepMinutes" controls-position="right" />
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

<script setup name="SlotTemplate" lang="ts">
import {
  addSlotTemplate,
  delSlotTemplate,
  getSlotTemplate,
  listSlotTemplate,
  updateSlotTemplate
} from '@/api/appt/slotTemplate';
import { SlotTemplateForm, SlotTemplateQuery, SlotTemplateVO } from '@/api/appt/slotTemplate/types';
import { useLoading } from '@/hooks/async/useLoading';
import { useFormDialog } from '@/hooks/dialog/useFormDialog';
import { useDateRangeQuery } from '@/hooks/form/useDateRangeQuery';
import { useSearchReset } from '@/hooks/form/useSearchReset';
import { useSearchToggle } from '@/hooks/form/useSearchToggle';
import { useTableSelection } from '@/hooks/table/useTableSelection';
import modal from '@/plugins/modal';
import { download as requestDownload } from '@/utils/request';



const slotTemplateList = ref<SlotTemplateVO[]>([]);
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
const slotTemplateFormRef = ref<ElFormInstance>();

const initFormData: SlotTemplateForm = {
  id: undefined,
  staffId: undefined,
  period: undefined,
  clinicType: undefined,
  startTime: undefined,
  endTime: undefined,
  stepMinutes: undefined,
  status: false,
}
const data = reactive<PageData<SlotTemplateForm, SlotTemplateQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    id: undefined,
    staffId: undefined,
    period: undefined,
    clinicType: undefined,
    startTime: undefined,
    endTime: undefined,
    stepMinutes: undefined,
    status: undefined,
    params: {
      createTime: undefined,
    }
  },
  rules: {
id: [
      { required: true, message: "主键不能为空", trigger: "change" }
    ],
staffId: [
      { required: true, message: "医务人员id不能为空", trigger: "change" }
    ],
period: [
      { required: true, message: "午别：AM上午 PM下午 NIGHT夜间不能为空", trigger: "blur" }
    ],
clinicType: [
      { required: true, message: "门诊类型码不能为空", trigger: "change" }
    ],
startTime: [
      { required: true, message: "起始时刻不能为空", trigger: "blur" }
    ],
endTime: [
      { required: true, message: "结束时刻不能为空", trigger: "blur" }
    ],
stepMinutes: [
      { required: true, message: "步长不能为空", trigger: "change" }
    ],
status: [
      { required: true, message: "状态：0正常 1停用不能为空", trigger: "change" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);
const { ids, single, multiple, handleSelectionChange } = useTableSelection<SlotTemplateVO>(item => item.id);
const { dialog, resetForm: reset, openDialog, showDialog, closeDialog } = useFormDialog({
  form,
  formRef: slotTemplateFormRef,
  initialFormData: initFormData
});

/** 查询时段模板列表 */
const getList = async () => {
  await withLoading(async () => {
    let params = queryParams.value;
params = applyCreateTimeDateRange(params);
    const res = await listSlotTemplate(params);
    slotTemplateList.value = res.data?.rows;
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
  openDialog('添加时段模板');
};

/** 修改按钮操作 */
const handleUpdate = async (row?: Partial<SlotTemplateVO>) => {
  reset();
  const _id = row?.id || ids.value[0];
  const res = await getSlotTemplate(_id);
  Object.assign(form.value, res.data);
  showDialog('修改时段模板');
};

/** 提交按钮 */
const submitForm = () => {
  slotTemplateFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateSlotTemplate(form.value).finally(() => (buttonLoading.value = false));
      } else {
        await addSlotTemplate(form.value).finally(() => (buttonLoading.value = false));
      }
      modal.msgSuccess('操作成功');
      closeDialog();
      await getList();
    }
  });
};

/** 删除按钮操作 */
const handleDelete = async (row?: Partial<SlotTemplateVO>) => {
  const _ids = row?.id || ids.value;
  await modal.confirm('是否确认删除时段模板编号为"' + _ids + '"的数据项？');
  await delSlotTemplate(_ids);
  modal.msgSuccess('删除成功');
  await getList();
};

/** 导出按钮操作 */
const handleExport = () => {
  requestDownload(
    'appt/admin/slotTemplate/export',
    {
      ...queryParams.value
    },
    `slotTemplate_${new Date().getTime()}.xlsx`
  );
};



onMounted(() => {
  getList();
});
</script>

