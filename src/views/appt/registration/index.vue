<template>
  <div class="p-2 page-shell appt-registration-page">
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
            <el-form-item label="挂号单号：R + yyyyMMdd + 6位当日序列" prop="registrationNo">
              <el-input v-model="queryParams.registrationNo" placeholder="请输入挂号单号：R + yyyyMMdd + 6位当日序列" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="账号id" prop="userId">
              <el-input-number v-model="queryParams.userId" controls-position="right" />
            </el-form-item>
            <el-form-item label="就诊人id" prop="patientId">
              <el-input-number v-model="queryParams.patientId" controls-position="right" />
            </el-form-item>
            <el-form-item label="号源id" prop="slotId">
              <el-input-number v-model="queryParams.slotId" controls-position="right" />
            </el-form-item>
            <el-form-item label="医务人员id" prop="staffId">
              <el-input-number v-model="queryParams.staffId" controls-position="right" />
            </el-form-item>
            <el-form-item label="科室id" prop="deptId">
              <el-input-number v-model="queryParams.deptId" controls-position="right" />
            </el-form-item>
            <el-form-item label="院区id" prop="campusId">
              <el-input-number v-model="queryParams.campusId" controls-position="right" />
            </el-form-item>
            <el-form-item label="就诊日期" prop="visitDate">
              <el-input v-model="queryParams.visitDate" placeholder="请输入就诊日期" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="午别" prop="period">
              <el-input v-model="queryParams.period" placeholder="请输入午别" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="就诊时刻" style="width: 308px">
              <el-date-picker
                v-model="dateRangeTimePoint"
                value-format="YYYY-MM-DD HH:mm:ss"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]"
              />
            </el-form-item>
            <el-form-item label="挂号费金额快照" prop="fee">
              <el-input-number v-model="queryParams.fee" controls-position="right" />
            </el-form-item>
            <el-form-item label="NONE无结算 WAIT_REFUND待退费 REFUNDED已退费" prop="settleStatus">
              <el-input v-model="queryParams.settleStatus" placeholder="请输入NONE无结算 WAIT_REFUND待退费 REFUNDED已退费" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="WAIT_PAY待支付 BOOKED已预约 SIGNED已签到 COMPLETED已完成 CLOSED已关闭 CANCELED_ACTIVE已退号(主动) CANCELED_PASSIVE已退号(被动) NOSHOW已爽约" prop="status">
              <el-input v-model="queryParams.status" placeholder="请输入WAIT_PAY待支付 BOOKED已预约 SIGNED已签到 COMPLETED已完成 CLOSED已关闭 CANCELED_ACTIVE已退号(主动) CANCELED_PASSIVE已退号(被动) NOSHOW已爽约" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="签到时间" style="width: 308px">
              <el-date-picker
                v-model="dateRangeSignTime"
                value-format="YYYY-MM-DD HH:mm:ss"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]"
              />
            </el-form-item>
            <el-form-item label="签到方式：SCAN扫码 MANUAL手动补签" prop="signType">
              <el-select v-model="queryParams.signType" placeholder="请选择签到方式：SCAN扫码 MANUAL手动补签" clearable >
                <el-option label="请选择字典生成" value="" />
              </el-select>
            </el-form-item>
            <el-form-item label="ACTIVE主动 PASSIVE被动" prop="cancelType">
              <el-select v-model="queryParams.cancelType" placeholder="请选择ACTIVE主动 PASSIVE被动" clearable >
                <el-option label="请选择字典生成" value="" />
              </el-select>
            </el-form-item>
            <el-form-item label="停诊批号" prop="suspendBatchNo">
              <el-input v-model="queryParams.suspendBatchNo" placeholder="请输入停诊批号" clearable @keyup.enter="handleQuery" />
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
            <h3>挂号单列表</h3>
          </div>
          <div class="toolbar-actions">
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['appt:registration:add']">新增</el-button>
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['appt:registration:edit']">修改</el-button>
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['appt:registration:remove']">删除</el-button>
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['appt:registration:export']">导出</el-button>
            <right-toolbar v-model:show-search="showSearch" :search="false" @query-table="getList"></right-toolbar>
          </div>
        </div>
      </template>

      <el-table v-loading="loading" border class="data-table" :data="registrationList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="主键" align="center" prop="id" />
        <el-table-column label="挂号单号：R + yyyyMMdd + 6位当日序列" align="center" prop="registrationNo" />
        <el-table-column label="账号id" align="center" prop="userId" />
        <el-table-column label="就诊人id" align="center" prop="patientId" />
        <el-table-column label="号源id" align="center" prop="slotId" />
        <el-table-column label="医务人员id" align="center" prop="staffId" />
        <el-table-column label="科室id" align="center" prop="deptId" />
        <el-table-column label="院区id" align="center" prop="campusId" />
        <el-table-column label="就诊日期" align="center" prop="visitDate" />
        <el-table-column label="午别" align="center" prop="period" />
        <el-table-column label="就诊时刻" align="center" prop="timePoint" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.timePoint, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="挂号费金额快照" align="center" prop="fee" />
        <el-table-column label="1=有效 / NULL=终态；三条联合唯一索引的列" align="center" prop="activeFlag" />
        <el-table-column label="NONE无结算 WAIT_REFUND待退费 REFUNDED已退费" align="center" prop="settleStatus" />
        <el-table-column label="WAIT_PAY待支付 BOOKED已预约 SIGNED已签到 COMPLETED已完成 CLOSED已关闭 CANCELED_ACTIVE已退号(主动) CANCELED_PASSIVE已退号(被动) NOSHOW已爽约" align="center" prop="status" />
        <el-table-column label="签到时间" align="center" prop="signTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.signTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="签到方式：SCAN扫码 MANUAL手动补签" align="center" prop="signType" />
        <el-table-column label="ACTIVE主动 PASSIVE被动" align="center" prop="cancelType" />
        <el-table-column label="停诊批号" align="center" prop="suspendBatchNo" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['appt:registration:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['appt:registration:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改挂号单对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="registrationFormRef" :model="form" :rules="rules" label-width="80px">
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

<script setup name="Registration" lang="ts">
import {
  addRegistration,
  delRegistration,
  getRegistration,
  listRegistration,
  updateRegistration
} from '@/api/appt/registration';
import { RegistrationForm, RegistrationQuery, RegistrationVO } from '@/api/appt/registration/types';
import { useLoading } from '@/hooks/async/useLoading';
import { useFormDialog } from '@/hooks/dialog/useFormDialog';
import { useDateRangeQuery } from '@/hooks/form/useDateRangeQuery';
import { useSearchReset } from '@/hooks/form/useSearchReset';
import { useSearchToggle } from '@/hooks/form/useSearchToggle';
import { useTableSelection } from '@/hooks/table/useTableSelection';
import { parseTime } from '@/utils/ruoyi';
import modal from '@/plugins/modal';
import { download as requestDownload } from '@/utils/request';



const registrationList = ref<RegistrationVO[]>([]);
const buttonLoading = ref(false);
const { loading, withLoading } = useLoading(true);
const { showSearch } = useSearchToggle();
const total = ref(0);
const {
  dateRange: dateRangeTimePoint,
  applyDateRange: applyTimePointDateRange,
  resetDateRange: resetTimePointDateRange
} = useDateRangeQuery('TimePoint');
const {
  dateRange: dateRangeSignTime,
  applyDateRange: applySignTimeDateRange,
  resetDateRange: resetSignTimeDateRange
} = useDateRangeQuery('SignTime');
const {
  dateRange: dateRangeCreateTime,
  applyDateRange: applyCreateTimeDateRange,
  resetDateRange: resetCreateTimeDateRange
} = useDateRangeQuery('CreateTime');

const queryFormRef = ref<ElFormInstance>();
const registrationFormRef = ref<ElFormInstance>();

const initFormData: RegistrationForm = {
}
const data = reactive<PageData<RegistrationForm, RegistrationQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    id: undefined,
    registrationNo: undefined,
    userId: undefined,
    patientId: undefined,
    slotId: undefined,
    staffId: undefined,
    deptId: undefined,
    campusId: undefined,
    visitDate: undefined,
    period: undefined,
    fee: undefined,
    settleStatus: undefined,
    status: undefined,
    signType: undefined,
    cancelType: undefined,
    suspendBatchNo: undefined,
    params: {
      timePoint: undefined,
      signTime: undefined,
      createTime: undefined,
    }
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);
const { ids, single, multiple, handleSelectionChange } = useTableSelection<RegistrationVO>(item => item.id);
const { dialog, resetForm: reset, openDialog, showDialog, closeDialog } = useFormDialog({
  form,
  formRef: registrationFormRef,
  initialFormData: initFormData
});

/** 查询挂号单列表 */
const getList = async () => {
  await withLoading(async () => {
    let params = queryParams.value;
params = applyTimePointDateRange(params);
params = applySignTimeDateRange(params);
params = applyCreateTimeDateRange(params);
    const res = await listRegistration(params);
    registrationList.value = res.data?.rows;
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
resetTimePointDateRange();
resetSignTimeDateRange();
resetCreateTimeDateRange();
  },
  afterReset: () => {
    handleQuery();
  }
});

/** 新增按钮操作 */
const handleAdd = () => {
  openDialog('添加挂号单');
};

/** 修改按钮操作 */
const handleUpdate = async (row?: Partial<RegistrationVO>) => {
  reset();
  const _id = row?.id || ids.value[0];
  const res = await getRegistration(_id);
  Object.assign(form.value, res.data);
  showDialog('修改挂号单');
};

/** 提交按钮 */
const submitForm = () => {
  registrationFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateRegistration(form.value).finally(() => (buttonLoading.value = false));
      } else {
        await addRegistration(form.value).finally(() => (buttonLoading.value = false));
      }
      modal.msgSuccess('操作成功');
      closeDialog();
      await getList();
    }
  });
};

/** 删除按钮操作 */
const handleDelete = async (row?: Partial<RegistrationVO>) => {
  const _ids = row?.id || ids.value;
  await modal.confirm('是否确认删除挂号单编号为"' + _ids + '"的数据项？');
  await delRegistration(_ids);
  modal.msgSuccess('删除成功');
  await getList();
};

/** 导出按钮操作 */
const handleExport = () => {
  requestDownload(
    'appt/registration/export',
    {
      ...queryParams.value
    },
    `registration_${new Date().getTime()}.xlsx`
  );
};



onMounted(() => {
  getList();
});
</script>

