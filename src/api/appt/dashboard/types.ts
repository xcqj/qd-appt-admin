/** 科室预约 TOP5 */
export interface DeptTopVO {
  deptId: string | number;
  deptName: string;
  count: number;
}

/** 数据看板（口径：今日 = 就诊日等于今天） */
export interface DashboardVO {
  /** 统计日期 */
  date: string;
  /** 今日放号（今日新增号源数） */
  todaySlots: number;
  /** 今日已预约（已预约 / 已签到 / 已完成） */
  todayBooked: number;
  /** 今日已签到（已签到 / 已完成） */
  todaySigned: number;
  /** 爽约率（%） */
  noShowRate: string | number;
  /** 退号率（%） */
  cancelRate: string | number;
  /** 支付成功率（%） */
  paySuccessRate: string | number;
  deptTop5: DeptTopVO[];
}
