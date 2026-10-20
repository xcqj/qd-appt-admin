export interface ScheduleVO {
  /**
   * 主键
   */
  id: string | number;
  /**
   * 医务人员id
   */
  staffId: string | number;
  /**
   * 医务人员姓名（服务端回填，列表展示用）
   */
  staffName?: string;
  /**
   * 科室id
   */
  deptId: string | number;
  /**
   * 科室名（服务端回填）
   */
  deptName?: string;
  /**
   * 院区id（冗余自 staff，供停诊按院区筛选）
   */
  campusId: string | number;
  /**
   * 院区名（服务端回填）
   */
  campusName?: string;
  /**
   * 门诊类型码
   */
  clinicType: string;
  /**
   * 就诊日期
   */
  visitDate: string;
  /**
   * 午别：AM/PM/NIGHT
   */
  period: string;
  /**
   * NORMAL正常 SUSPENDED已停诊
   */
  status: string;
  /**
   * 该午别可约余量（S5 实时值，与患者端同一套 RemainService/缓存口径；不参与导出）
   */
  remain?: number;
}

export interface ScheduleForm extends BaseEntity {
}

/** 排班生成请求（F1；雪花 id 按字符串传，避免 JS 精度丢失） */
export interface ScheduleGenerateForm {
  /** 医务人员 id */
  staffId: string | number;
  /** 起始就诊日期 yyyy-MM-dd */
  startDate: string;
  /** 结束就诊日期 yyyy-MM-dd */
  endDate: string;
}

/** 排班生成预览查询 */
export interface SchedulePreviewQuery {
  staffId: string | number;
  startDate: string;
  endDate: string;
}

/** 排班生成预览明细：单 (日期 × 午别) */
export interface SchedulePreviewItemVO {
  visitDate: string;
  /** 午别：AM / PM / NIGHT */
  period: string;
  clinicType: string;
  /** 挂号费（金额按契约 §2.4 为字符串） */
  fee: string;
  startTime: string;
  endTime: string;
  plannedSlot: number;
  existingSlot: number;
  newSlot: number;
}

/** 排班生成预览响应 */
export interface SchedulePreviewVO {
  staffId: string | number;
  staffName: string;
  startDate: string;
  endDate: string;
  plannedSchedule: number;
  plannedSlot: number;
  existingSchedule: number;
  existingSlot: number;
  newSchedule: number;
  newSlot: number;
  arbitratedCount: number;
  items: SchedulePreviewItemVO[];
}

/** 排班生成结果 */
export interface ScheduleGenerateResultVO {
  /** 批号：G + yyyyMMdd + 6 位序列 */
  batchNo: string;
  scheduleCount: number;
  slotCount: number;
  skippedCount: number;
  arbitratedCount: number;
  elapsedMs: number;
}

export interface ScheduleQuery extends PageQuery {
  /**
   * 主键
   */
  id?: number;
  /**
   * 医务人员id
   */
  staffId?: number;
  /**
   * 科室id
   */
  deptId?: number;
  /**
   * 院区id（冗余自 staff，供停诊按院区筛选）
   */
  campusId?: number;
  /**
   * 门诊类型码
   */
  clinicType?: string;
  /**
   * 就诊日期
   */
  visitDate?: string;
  /**
   * 午别：AM/PM/NIGHT
   */
  period?: string;
  /**
   * NORMAL正常 SUSPENDED已停诊
   */
  status?: string;
  /**
   * 创建时间
   */
  createTime?: string;
  /**
   * 日期范围参数
   */
  params?: any;
}
