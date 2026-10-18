<template>
  <div class="p-2 page-shell appt-blacklist-page">
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
            <el-form-item label="账号id" prop="userId">
              <el-input-number v-model="queryParams.userId" controls-position="right" />
            </el-form-item>
            <el-form-item label="关联就诊人id" prop="patientId">
              <el-input-number v-model="queryParams.patientId" controls-position="right" />
            </el-form-item>
            <el-form-item label="列入原因" prop="reason">
              <el-input v-model="queryParams.reason" placeholder="请输入列入原因" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="生效时间" style="width: 308px">
              <el-date-picker
                v-model="dateRangeStartTime"
                value-format="YYYY-MM-DD HH:mm:ss"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]"
              />
            </el-form-item>
            <el-form-item label="失效时间" style="width: 308px">
              <el-date-picker
                v-model="dateRangeEndTime"
                value-format="YYYY-MM-DD HH:mm:ss"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]"
              />
            </el-form-item>
            <el-form-item label="操作人" prop="operator">
              <el-input v-model="queryParams.operator" placeholder="请输入操作人" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="状态：0生效 1已解除" prop="status">
              <el-select v-model="queryParams.status" placeholder="请选择状态：0生效 1已解除" clearable >
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
            <h3>黑名单列表</h3>
          </div>
          <div class="toolbar-actions">
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['appt:blacklist:add']">新增</el-button>
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['appt:blacklist:edit']">修改</el-button>
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['appt:blacklist:remove']">删除</el-button>
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['appt:blacklist:export']">导出</el-button>
            <right-toolbar v-model:show-search="showSearch" :search="false" @query-table="getList"></right-toolbar>
          </div>
        </div>
      </template>

      <el-table v-loading="loading" border class="data-table" :data="blacklistList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="主键" align="center" prop="id" />
        <el-table-column label="账号id" align="center" prop="userId" />
        <el-table-column label="关联就诊人id" align="center" prop="patientId" />
        <el-table-column label="列入原因" align="center" prop="reason" />
        <el-table-column label="生效时间" align="center" prop="startTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.startTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="失效时间" align="center" prop="endTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.endTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作人" align="center" prop="operator" />
        <el-table-column label="状态：0生效 1已解除" align="center" prop="status" width="120">
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
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['appt:blacklist:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['appt:blacklist:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改黑名单对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="blacklistFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="账号id" prop="userId">
          <el-input-number v-model="form.userId" controls-position="right" />
        </el-form-item>
        <el-form-item label="关联就诊人id" prop="patientId">
          <el-input-number v-model="form.patientId" controls-position="right" />
        </el-form-item>
        <el-form-item label="列入原因" prop="reason">
          <el-input v-model="form.reason" placeholder="请输入列入原因" />
        </el-form-item>
        <el-form-item label="生效时间" prop="startTime">
          <el-date-picker clearable
            v-model="form.startTime"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择生效时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="失效时间" prop="endTime">
          <el-date-picker clearable
            v-model="form.endTime"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择失效时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="操作人" prop="operator">
          <el-input v-model="form.operator" placeholder="请输入操作人" />
        </el-form-item>
        <el-form-item label="状态：0生效 1已解除" prop="status">
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

<script setup name="Blacklist" lang="ts">
import {
  addBlacklist,
  delBlacklist,
  getBlacklist,
  listBlacklist,
  updateBlacklist
} from '@/api/appt/blacklist';
import { BlacklistForm, BlacklistQuery, BlacklistVO } from '@/api/appt/blacklist/types';
import { useLoading } from '@/hooks/async/useLoading';
import { useFormDialog } from '@/hooks/dialog/useFormDialog';
import { useDateRangeQuery } from '@/hooks/form/useDateRangeQuery';
import { useSearchReset } from '@/hooks/form/useSearchReset';
import { useSearchToggle } from '@/hooks/form/useSearchToggle';
import { useTableSelection } from '@/hooks/table/useTableSelection';
import { parseTime } from '@/utils/ruoyi';
import modal from '@/plugins/modal';
import { download as requestDownload } from '@/utils/request';



const blacklistList = ref<BlacklistVO[]>([]);
const buttonLoading = ref(false);
const { loading, withLoading } = useLoading(true);
const { showSearch } = useSearchToggle();
const total = ref(0);
const {
  dateRange: dateRangeStartTime,
  applyDateRange: applyStartTimeDateRange,
  resetDateRange: resetStartTimeDateRange
} = useDateRangeQuery('StartTime');
const {
  dateRange: dateRangeEndTime,
  applyDateRange: applyEndTimeDateRange,
  resetDateRange: resetEndTimeDateRange
} = useDateRangeQuery('EndTime');
const {
  dateRange: dateRangeCreateTime,
  applyDateRange: applyCreateTimeDateRange,
  resetDateRange: resetCreateTimeDateRange
} = useDateRangeQuery('CreateTime');

const queryFormRef = ref<ElFormInstance>();
const blacklistFormRef = ref<ElFormInstance>();

const initFormData: BlacklistForm = {
  id: undefined,
  userId: undefined,
  patientId: undefined,
  reason: undefined,
  startTime: undefined,
  endTime: undefined,
  operator: undefined,
  status: false,
}
const data = reactive<PageData<BlacklistForm, BlacklistQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    id: undefined,
    userId: undefined,
    patientId: undefined,
    reason: undefined,
    operator: undefined,
    status: undefined,
    params: {
      startTime: undefined,
      endTime: undefined,
      createTime: undefined,
    }
  },
  rules: {
id: [
      { required: true, message: "主键不能为空", trigger: "change" }
    ],
userId: [
      { required: true, message: "账号id不能为空", trigger: "change" }
    ],
startTime: [
      { required: true, message: "生效时间不能为空", trigger: "blur" }
    ],
endTime: [
      { required: true, message: "失效时间不能为空", trigger: "blur" }
    ],
status: [
      { required: true, message: "状态：0生效 1已解除不能为空", trigger: "change" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);
const { ids, single, multiple, handleSelectionChange } = useTableSelection<BlacklistVO>(item => item.id);
const { dialog, resetForm: reset, openDialog, showDialog, closeDialog } = useFormDialog({
  form,
  formRef: blacklistFormRef,
  initialFormData: initFormData
});

/** 查询黑名单列表 */
const getList = async () => {
  await withLoading(async () => {
    let params = queryParams.value;
params = applyStartTimeDateRange(params);
params = applyEndTimeDateRange(params);
params = applyCreateTimeDateRange(params);
    const res = await listBlacklist(params);
    blacklistList.value = res.data?.rows;
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
resetStartTimeDateRange();
resetEndTimeDateRange();
resetCreateTimeDateRange();
  },
  afterReset: () => {
    handleQuery();
  }
});

/** 新增按钮操作 */
const handleAdd = () => {
  openDialog('添加黑名单');
};

/** 修改按钮操作 */
const handleUpdate = async (row?: Partial<BlacklistVO>) => {
  reset();
  const _id = row?.id || ids.value[0];
  const res = await getBlacklist(_id);
  Object.assign(form.value, res.data);
  showDialog('修改黑名单');
};

/** 提交按钮 */
const submitForm = () => {
  blacklistFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateBlacklist(form.value).finally(() => (buttonLoading.value = false));
      } else {
        await addBlacklist(form.value).finally(() => (buttonLoading.value = false));
      }
      modal.msgSuccess('操作成功');
      closeDialog();
      await getList();
    }
  });
};

/** 删除按钮操作 */
const handleDelete = async (row?: Partial<BlacklistVO>) => {
  const _ids = row?.id || ids.value;
  await modal.confirm('是否确认删除黑名单编号为"' + _ids + '"的数据项？');
  await delBlacklist(_ids);
  modal.msgSuccess('删除成功');
  await getList();
};

/** 导出按钮操作 */
const handleExport = () => {
  requestDownload(
    'appt/admin/blacklist/export',
    {
      ...queryParams.value
    },
    `blacklist_${new Date().getTime()}.xlsx`
  );
};



onMounted(() => {
  getList();
});
</script>

