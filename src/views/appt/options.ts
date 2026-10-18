/**
 * appt 业务线值选项（线值权威：docs/database-design.md §2 / 契约 §2.7，取自 DDL 列注释）
 * 用途：筛选区/表单下拉的固定选项、列表值的中文映射。
 */
export interface ApptOption {
  label: string;
  value: string | number | boolean;
}

/** 科室层级 */
export const DEPT_LEVEL_OPTIONS: ApptOption[] = [
  { label: '一级', value: 1 },
  { label: '二级', value: 2 },
  { label: '三级', value: 3 }
];

/** 门诊类型 */
export const CLINIC_TYPE_OPTIONS: ApptOption[] = [
  { label: '普通门诊', value: 'NORMAL' },
  { label: '专家门诊', value: 'EXPERT' },
  { label: '夜间门诊', value: 'NIGHT' }
];

/** 午别 */
export const PERIOD_OPTIONS: ApptOption[] = [
  { label: '上午', value: 'AM' },
  { label: '下午', value: 'PM' },
  { label: '夜间', value: 'NIGHT' }
];

/** 职称 */
export const TITLE_OPTIONS: ApptOption[] = [
  { label: '主任医师', value: 'CHIEF' },
  { label: '副主任医师', value: 'ASSOC_CHIEF' },
  { label: '主治医师', value: 'ATTENDING' },
  { label: '医师', value: 'PHYSICIAN' },
  { label: '副主任护师', value: 'ASSOC_CHIEF_NURSE' }
];

/** 人员类型 */
export const STAFF_TYPE_OPTIONS: ApptOption[] = [
  { label: '医生', value: 'DOCTOR' },
  { label: '护士', value: 'NURSE' }
];

/** 证件类型 */
export const ID_TYPE_OPTIONS: ApptOption[] = [
  { label: '身份证', value: 'IDCARD' },
  { label: '就诊卡', value: 'CARD' }
];

/** 站内信通知场景（PRD §6.12 的 7 个场景） */
export const NOTICE_TYPE_OPTIONS: ApptOption[] = [
  { label: '挂号成功', value: 'BOOK_SUCCESS' },
  { label: '支付成功', value: 'PAY_SUCCESS' },
  { label: '支付超时关单', value: 'PAY_TIMEOUT' },
  { label: '退号成功', value: 'CANCEL_SUCCESS' },
  { label: '停诊取消', value: 'SUSPEND_CANCEL' },
  { label: '爽约记录', value: 'NOSHOW_RECORD' },
  { label: '黑名单生效', value: 'BLACKLIST_HIT' }
];

/** 站内信已读标记 */
export const READ_FLAG_OPTIONS: ApptOption[] = [
  { label: '未读', value: false },
  { label: '已读', value: true }
];

/** 启停（char(1) 0/1 → Boolean false/true） */
export const STATUS_OPTIONS: ApptOption[] = [
  { label: '正常', value: false },
  { label: '停用', value: true }
];

/** 黑名单状态（0 生效 / 1 已解除） */
export const BLACKLIST_STATUS_OPTIONS: ApptOption[] = [
  { label: '生效', value: false },
  { label: '已解除', value: true }
];

/** 号源状态 */
export const SLOT_STATUS_OPTIONS: ApptOption[] = [
  { label: '可约', value: 'AVAILABLE' },
  { label: '已占', value: 'TAKEN' },
  { label: '已停诊', value: 'SUSPENDED' },
  { label: '已过期', value: 'EXPIRED' }
];

/** 号源来源 */
export const SLOT_SOURCE_OPTIONS: ApptOption[] = [
  { label: '正常', value: 'NORMAL' },
  { label: '加号', value: 'EXTRA' }
];

/** 排班状态 */
export const SCHEDULE_STATUS_OPTIONS: ApptOption[] = [
  { label: '正常', value: 'NORMAL' },
  { label: '已停诊', value: 'SUSPENDED' }
];

/** 挂号单状态 */
export const REG_STATUS_OPTIONS: ApptOption[] = [
  { label: '待支付', value: 'WAIT_PAY' },
  { label: '已预约', value: 'BOOKED' },
  { label: '已签到', value: 'SIGNED' },
  { label: '已完成', value: 'COMPLETED' },
  { label: '已关闭', value: 'CLOSED' },
  { label: '已退号（主动）', value: 'CANCELED_ACTIVE' },
  { label: '已退号（被动）', value: 'CANCELED_PASSIVE' },
  { label: '已爽约', value: 'NOSHOW' }
];

/** 结算状态 */
export const SETTLE_STATUS_OPTIONS: ApptOption[] = [
  { label: '无结算', value: 'NONE' },
  { label: '待退费', value: 'WAIT_REFUND' },
  { label: '已退费', value: 'REFUNDED' }
];

/** 签到方式 */
export const SIGN_TYPE_OPTIONS: ApptOption[] = [
  { label: '扫码', value: 'SCAN' },
  { label: '手动补签', value: 'MANUAL' }
];

/** 退号类型 */
export const CANCEL_TYPE_OPTIONS: ApptOption[] = [
  { label: '主动', value: 'ACTIVE' },
  { label: '被动', value: 'PASSIVE' }
];

/** 支付状态 */
export const PAY_STATUS_OPTIONS: ApptOption[] = [
  { label: '待支付', value: 'WAIT_PAY' },
  { label: '已支付', value: 'PAID' },
  { label: '已关闭', value: 'CLOSED' },
  { label: '已退款', value: 'REFUNDED' }
];

/** 支付渠道 */
export const PAY_CHANNEL_OPTIONS: ApptOption[] = [
  { label: 'Mock', value: 'MOCK' }
];

/** 退款状态 */
export const REFUND_STATUS_OPTIONS: ApptOption[] = [
  { label: '待退款', value: 'WAIT_REFUND' },
  { label: '已退款', value: 'REFUNDED' },
  { label: '退款失败', value: 'FAILED' }
];

/** 回调处理状态 */
export const CALLBACK_STATUS_OPTIONS: ApptOption[] = [
  { label: '待处理', value: 'PENDING' },
  { label: '成功', value: 'SUCCESS' },
  { label: '重复忽略', value: 'IGNORED' },
  { label: '失败', value: 'FAILED' }
];

/** 对账检查项 */
export const CHECK_TYPE_OPTIONS: ApptOption[] = [
  { label: 'R1 幽灵占号', value: 'R1' },
  { label: 'R2 占号无单', value: 'R2' },
  { label: 'R3 回调缺口', value: 'R3' },
  { label: 'R4 给号未收钱', value: 'R4' },
  { label: 'R5 退款未回写', value: 'R5' },
  { label: 'R6 余量偏差', value: 'R6' },
  { label: 'R7 缓存无源', value: 'R7' }
];

/** 对账动作 */
export const CHECK_ACTION_OPTIONS: ApptOption[] = [
  { label: '自动修复', value: 'AUTO_FIX' },
  { label: '告警', value: 'ALERT' }
];

/** 对账结果状态 */
export const CHECK_STATUS_OPTIONS: ApptOption[] = [
  { label: '正常', value: 'OK' },
  { label: '已修复', value: 'FIXED' },
  { label: '待人工', value: 'ALERT' }
];

/** 任务执行状态 */
export const JOB_STATUS_OPTIONS: ApptOption[] = [
  { label: '运行中', value: 'RUNNING' },
  { label: '成功', value: 'SUCCESS' },
  { label: '失败', value: 'FAIL' },
  { label: '跳过', value: 'SKIPPED' }
];

/** 停诊范围 */
export const SCOPE_TYPE_OPTIONS: ApptOption[] = [
  { label: '单个午别', value: 'SCHEDULE' },
  { label: '某医生某日', value: 'STAFF_DATE' },
  { label: '院区某日', value: 'CAMPUS_DATE' }
];

/** 停诊处理状态 */
export const SUSPEND_STATUS_OPTIONS: ApptOption[] = [
  { label: '待处理', value: 'PENDING' },
  { label: '已处理', value: 'HANDLED' }
];

/** 台账动作 */
export const LEDGER_ACTION_OPTIONS: ApptOption[] = [
  { label: '生成', value: 'GENERATE' },
  { label: '占用', value: 'OCCUPY' },
  { label: '释放', value: 'RELEASE' },
  { label: '回补', value: 'REFILL' },
  { label: '停诊', value: 'SUSPEND' },
  { label: '过期', value: 'EXPIRE' }
];

/** 通用：取选项中文名，找不到时回退原值 */
export const labelOf = (options: ApptOption[], value: unknown): string => {
  const hit = options.find((opt) => opt.value === value);
  if (hit) return hit.label;
  return value === null || value === undefined || value === '' ? '-' : String(value);
};

/** 启停布尔 → 中文（列表/详情用） */
export const statusText = (value: unknown): string => (value === true ? '停用' : '正常');
