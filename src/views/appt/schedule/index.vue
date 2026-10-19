<template>
  <div class="p-2 page-shell appt-schedule-page">
    <div class="search-wrap">
      <el-card shadow="hover" class="search-panel" :class="{ 'is-collapsed': !showSearch }">
        <template #header>
          <div class="panel-heading search-panel-toggle" @click.stop="showSearch = !showSearch">
            <div><h3>筛选条件</h3></div>
          </div>
        </template>
        <el-form ref="queryFormRef" :model="queryParams" :inline="true" class="query-form">
            
            <el-form-item label="医务人员" prop="staffId">
              <el-select v-model="queryParams.staffId" placeholder="请选择医务人员" clearable filterable style="width: 200px">
                <el-option v-for="item in staffOptions" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="科室" prop="deptId">
              <el-select v-model="queryParams.deptId" placeholder="请选择科室" clearable filterable style="width: 200px">
                <el-option v-for="item in deptOptions" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="院区" prop="campusId">
              <el-select v-model="queryParams.campusId" placeholder="请选择院区" clearable filterable style="width: 200px">
                <el-option v-for="item in campusOptions" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="门诊类型" prop="clinicType">
              <el-input v-model="queryParams.clinicType" placeholder="请输入门诊类型码" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="就诊日期" prop="visitDate">
              <el-date-picker v-model="queryParams.visitDate" value-format="YYYY-MM-DD" type="date" placeholder="请选择就诊日期" style="width: 180px" />
            </el-form-item>
            <el-form-item label="午别" prop="period">
              <el-select v-model="queryParams.period" placeholder="请选择午别" clearable filterable style="width: 180px">
                <el-option v-for="opt in PERIOD_OPTIONS" :key="String(opt.value)" :label="opt.label" :value="opt.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <el-select v-model="queryParams.status" placeholder="请选择状态" clearable filterable style="width: 180px">
                <el-option v-for="opt in SCHEDULE_STATUS_OPTIONS" :key="String(opt.value)" :label="opt.label" :value="opt.value" />
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
            <h3>排班列表</h3>
          </div>
          <div class="toolbar-actions">
            <el-button type="primary" icon="Plus" @click="handleOpenGenerate" v-hasPermi="['appt:schedule:add']">生成排班</el-button>
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['appt:schedule:export']">导出</el-button>
            <right-toolbar v-model:show-search="showSearch" :search="false" @query-table="getList"></right-toolbar>
          </div>
        </div>
      </template>

      <el-table v-loading="loading" border class="data-table" :data="scheduleList">
        <el-table-column label="主键" align="center" prop="id" />
        <el-table-column label="医务人员" align="center" prop="staffName" min-width="110" />
        <el-table-column label="科室" align="center" prop="deptName" min-width="110" />
        <el-table-column label="院区" align="center" prop="campusName" min-width="110" />
        <el-table-column label="门诊类型" align="center" prop="clinicType" :formatter="(r) => labelOf(CLINIC_TYPE_OPTIONS, r.clinicType)" />
        <el-table-column label="就诊日期" align="center" prop="visitDate" />
        <el-table-column label="午别" align="center" prop="period" :formatter="(r) => labelOf(PERIOD_OPTIONS, r.period)" />
        <el-table-column label="状态" align="center" prop="status" :formatter="(r) => labelOf(SCHEDULE_STATUS_OPTIONS, r.status)" />
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>

    <!-- 生成排班（F1）：模板 → 排班 → 号源（可约）→ 台账 -->
    <el-dialog v-model="generateDialog.visible" :title="generateDialog.title" width="900px" append-to-body :close-on-click-modal="false">
      <el-alert
        type="info"
        :closable="false"
        show-icon
        class="mb-3"
        title="按医务人员的启用时段模板批量展开排班与号源，生成后号源即为可约；同参数重跑只补缺失项，不重复生成。"
      />
      <el-form ref="generateFormRef" :model="generateForm" :rules="generateRules" label-width="90px">
        <el-form-item label="医务人员" prop="staffId">
          <el-select v-model="generateForm.staffId" placeholder="请选择医务人员" filterable clearable style="width: 100%">
            <el-option v-for="item in staffOptions" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="日期范围" prop="dateRange">
          <el-date-picker
            v-model="generateForm.dateRange"
            type="daterange"
            value-format="YYYY-MM-DD"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 100%"
          />
        </el-form-item>
      </el-form>

      <template v-if="previewData">
        <el-descriptions :column="4" border size="small" class="mb-3">
          <el-descriptions-item label="预计排班">{{ previewData.plannedSchedule }}</el-descriptions-item>
          <el-descriptions-item label="预计号源">{{ previewData.plannedSlot }}</el-descriptions-item>
          <el-descriptions-item label="已存在号源">{{ previewData.existingSlot }}</el-descriptions-item>
          <el-descriptions-item label="预计新增">{{ previewData.newSlot }}</el-descriptions-item>
          <el-descriptions-item label="仲裁落选模板" :span="4">{{ previewData.arbitratedCount }}</el-descriptions-item>
        </el-descriptions>
        <el-table border size="small" max-height="320" class="data-table" :data="previewData.items">
          <el-table-column label="就诊日期" prop="visitDate" width="110" align="center" />
          <el-table-column label="午别" prop="period" width="80" align="center" :formatter="(row) => labelOf(PERIOD_OPTIONS, row.period)" />
          <el-table-column label="门诊类型" prop="clinicType" width="100" align="center" :formatter="(row) => labelOf(CLINIC_TYPE_OPTIONS, row.clinicType)" />
          <el-table-column label="时段" width="120" align="center">
            <template #default="{ row }">{{ row.startTime }} ~ {{ row.endTime }}</template>
          </el-table-column>
          <el-table-column label="挂号费" prop="fee" width="90" align="right" />
          <el-table-column label="预计" prop="plannedSlot" width="70" align="center" />
          <el-table-column label="已存在" prop="existingSlot" width="80" align="center" />
          <el-table-column label="新增" prop="newSlot" width="70" align="center" />
        </el-table>
      </template>

      <template #footer>
        <el-button @click="generateDialog.visible = false">取消</el-button>
        <el-button :loading="previewing" @click="handlePreview">预览</el-button>
        <el-button type="primary" :loading="generating" @click="handleGenerate">生成</el-button>
        <el-button type="warning" plain :loading="generatingAll" @click="handleGenerateAll">全体有模板人员</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Schedule" lang="ts">
import {
  generateSchedule,
  listSchedule,
  previewSchedule,
} from '@/api/appt/schedule';
import { SchedulePreviewVO, ScheduleQuery, ScheduleVO } from '@/api/appt/schedule/types';
import { listSlotTemplate } from '@/api/appt/slotTemplate';
import { useLoading } from '@/hooks/async/useLoading';
import { useFormDialog } from '@/hooks/dialog/useFormDialog';
import { useDateRangeQuery } from '@/hooks/form/useDateRangeQuery';
import { useSearchReset } from '@/hooks/form/useSearchReset';
import { useSearchToggle } from '@/hooks/form/useSearchToggle';
import modal from '@/plugins/modal';
import { download as requestDownload } from '@/utils/request';
import { useApptOptions } from '@/views/appt/useApptOptions';
import { PERIOD_OPTIONS, SCHEDULE_STATUS_OPTIONS, CLINIC_TYPE_OPTIONS, labelOf } from '@/views/appt/options';



const scheduleList = ref<ScheduleVO[]>([]);
const { campusOptions, deptOptions, staffOptions, loadApptOptions } = useApptOptions();
const { loading, withLoading } = useLoading(true);
const { showSearch } = useSearchToggle();
const total = ref(0);
const {
  dateRange: dateRangeCreateTime,
  applyDateRange: applyCreateTimeDateRange,
  resetDateRange: resetCreateTimeDateRange
} = useDateRangeQuery('CreateTime');

const queryFormRef = ref<ElFormInstance>();
const scheduleFormRef = ref<ElFormInstance>();

const queryParams = ref<ScheduleQuery>({
    pageNum: 1,
    pageSize: 10,
    id: undefined,
    staffId: undefined,
    deptId: undefined,
    campusId: undefined,
    clinicType: undefined,
    visitDate: undefined,
    period: undefined,
    status: undefined,
    params: {
      createTime: undefined,
    }
});


/* ---------------- 生成排班（F1） ---------------- */

const previewing = ref(false);
const generating = ref(false);
const generatingAll = ref(false);
const previewData = ref<SchedulePreviewVO>();
const generateFormRef = ref<ElFormInstance>();
const generateForm = ref<{ staffId?: string | number; dateRange: string[] }>({
  staffId: undefined,
  dateRange: []
});
const generateRules: ElFormRules = {
  staffId: [{ required: true, message: '请选择医务人员', trigger: 'change' }],
  dateRange: [{ required: true, type: 'array', message: '请选择日期范围', trigger: 'change' }]
};

const { dialog: generateDialog, openDialog } = useFormDialog({
  form: generateForm,
  formRef: generateFormRef,
  initialFormData: { staffId: undefined, dateRange: [] },
  initialTitle: '生成排班'
});

const handleOpenGenerate = () => {
  previewData.value = undefined;
  openDialog();
};

/** 校验并返回 [startDate, endDate]；不合法返回 null */
const resolveGenerateRange = async (): Promise<[string, string] | null> => {
  const valid = await generateFormRef.value?.validate().catch(() => false);
  if (!valid) {
    return null;
  }
  const [startDate, endDate] = generateForm.value.dateRange;
  return [startDate, endDate];
};

/** 预览：不落库、不占批号 */
const handlePreview = async () => {
  const range = await resolveGenerateRange();
  if (!range || !generateForm.value.staffId) {
    return;
  }
  previewing.value = true;
  try {
    const res = await previewSchedule({ staffId: generateForm.value.staffId, startDate: range[0], endDate: range[1] });
    previewData.value = res.data;
  } finally {
    previewing.value = false;
  }
};

/** 生成：同参数重跑只补缺失项 */
const handleGenerate = async () => {
  const range = await resolveGenerateRange();
  if (!range || !generateForm.value.staffId) {
    return;
  }
  generating.value = true;
  try {
    const res = await generateSchedule({ staffId: generateForm.value.staffId, startDate: range[0], endDate: range[1] });
    modal.msgSuccess(
      `生成完成：新增排班 ${res.data.scheduleCount}，新增号源 ${res.data.slotCount}，跳过 ${res.data.skippedCount}（批号 ${res.data.batchNo}）`
    );
    generateDialog.visible = false;
    getList();
  } finally {
    generating.value = false;
  }
};

/** 全体有模板人员：前端逐个调用单人端点（后端保持单人入参，契约不扩字段） */
const handleGenerateAll = async () => {
  const range = await resolveGenerateRange();
  if (!range) {
    return;
  }
  try {
    await modal.confirm(`将为「有启用时段模板」的全部医务人员生成 ${range[0]} ~ ${range[1]} 的排班，确认继续？`);
  } catch {
    return;
  }
  generatingAll.value = true;
  try {
    const templateRes = await listSlotTemplate({ pageNum: 1, pageSize: 500 });
    const rows = templateRes.data?.rows ?? [];
    const staffIds = Array.from(new Set(rows.filter((row: any) => row.status !== true).map((row: any) => row.staffId)));
    if (!staffIds.length) {
      modal.msgWarning('没有启用了时段模板的医务人员');
      return;
    }
    let scheduleCount = 0;
    let slotCount = 0;
    let skippedCount = 0;
    let success = 0;
    const failures: string[] = [];
    for (const staffId of staffIds) {
      try {
        const res = await generateSchedule({ staffId, startDate: range[0], endDate: range[1] });
        scheduleCount += res.data.scheduleCount ?? 0;
        slotCount += res.data.slotCount ?? 0;
        skippedCount += res.data.skippedCount ?? 0;
        success++;
      } catch {
        failures.push(String(staffId));
      }
    }
    modal.notifySuccess(
      `全体生成完成：医生 ${success}/${staffIds.length}，新增排班 ${scheduleCount}，新增号源 ${slotCount}，跳过 ${skippedCount}`
    );
    if (failures.length) {
      modal.notifyWarning(`生成失败 ${failures.length} 人（id：${failures.slice(0, 5).join('、')}），请单独重试或检查时段模板 / 收费标准`);
    }
    generateDialog.visible = false;
    getList();
  } finally {
    generatingAll.value = false;
  }
};

/** 查询排班列表 */
const getList = async () => {
  await withLoading(async () => {
    let params = queryParams.value;
params = applyCreateTimeDateRange(params);
    const res = await listSchedule(params);
    scheduleList.value = res.data?.rows;
    total.value = res.data?.total;
  });
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





/** 导出按钮操作 */
const handleExport = () => {
  requestDownload(
    'appt/admin/schedule/export',
    {
      ...queryParams.value
    },
    `schedule_${new Date().getTime()}.xlsx`
  );
};



onMounted(() => {
  getList();
  loadApptOptions();
});
</script>

