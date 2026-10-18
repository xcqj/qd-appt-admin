export interface RegistrationVO {
  /**
   * 主键
   */
  id: string | number;
  /**
   * 挂号单号：R + yyyyMMdd + 6位当日序列（D-S1-4）
   */
  registrationNo: string;
  /**
   * 账号id（sys_user）；限购与黑名单均按 user_id 统计（M13）
   */
  userId: string | number;
  /**
   * 就诊人id
   */
  patientId: string | number;
  /**
   * 号源id
   */
  slotId: string | number;
  /**
   * 医务人员id（冗余快照）
   */
  staffId: string | number;
  /**
   * 科室id（冗余快照）
   */
  deptId: string | number;
  /**
   * 院区id（冗余快照）
   */
  campusId: string | number;
  /**
   * 就诊日期（冗余快照）
   */
  visitDate: string;
  /**
   * 午别（冗余快照）
   */
  period: string;
  /**
   * 就诊时刻（冗余快照，完整 datetime）
   */
  timePoint: string;
  /**
   * 挂号费金额快照（I2）
   */
  fee: number;
  /**
   * 1=有效 / NULL=终态；三条联合唯一索引的列（M1）。默认 1——漏写时朝「仍然设防」而非「静默失效」的方向偏
   */
  activeFlag: number;
  /**
   * NONE无结算 WAIT_REFUND待退费 REFUNDED已退费
   */
  settleStatus: string;
  /**
   * WAIT_PAY待支付 BOOKED已预约 SIGNED已签到 COMPLETED已完成 CLOSED已关闭 CANCELED_ACTIVE已退号(主动) CANCELED_PASSIVE已退号(被动) NOSHOW已爽约
   */
  status: string;
  /**
   * 签到时间
   */
  signTime: string;
  /**
   * 签到方式：SCAN扫码 MANUAL手动补签（契约 §7.1 E1 / §7.2 E2）
   */
  signType: string;
  /**
   * ACTIVE主动 PASSIVE被动
   */
  cancelType: string;
  /**
   * 停诊批号（批量流转幂等 I7）
   */
  suspendBatchNo: string;
}

export interface RegistrationForm extends BaseEntity {
}

export interface RegistrationQuery extends PageQuery {
  /**
   * 主键
   */
  id?: string | number;
  /**
   * 挂号单号：R + yyyyMMdd + 6位当日序列（D-S1-4）
   */
  registrationNo?: string;
  /**
   * 账号id（sys_user）；限购与黑名单均按 user_id 统计（M13）
   */
  userId?: string | number;
  /**
   * 就诊人id
   */
  patientId?: string | number;
  /**
   * 号源id
   */
  slotId?: string | number;
  /**
   * 医务人员id（冗余快照）
   */
  staffId?: string | number;
  /**
   * 科室id（冗余快照）
   */
  deptId?: string | number;
  /**
   * 院区id（冗余快照）
   */
  campusId?: string | number;
  /**
   * 就诊日期（冗余快照）
   */
  visitDate?: string;
  /**
   * 午别（冗余快照）
   */
  period?: string;
  /**
   * 就诊时刻（冗余快照，完整 datetime）
   */
  timePoint?: string;
  /**
   * 挂号费金额快照（I2）
   */
  fee?: number;
  /**
   * NONE无结算 WAIT_REFUND待退费 REFUNDED已退费
   */
  settleStatus?: string;
  /**
   * WAIT_PAY待支付 BOOKED已预约 SIGNED已签到 COMPLETED已完成 CLOSED已关闭 CANCELED_ACTIVE已退号(主动) CANCELED_PASSIVE已退号(被动) NOSHOW已爽约
   */
  status?: string;
  /**
   * 签到时间
   */
  signTime?: string;
  /**
   * 签到方式：SCAN扫码 MANUAL手动补签（契约 §7.1 E1 / §7.2 E2）
   */
  signType?: string;
  /**
   * ACTIVE主动 PASSIVE被动
   */
  cancelType?: string;
  /**
   * 停诊批号（批量流转幂等 I7）
   */
  suspendBatchNo?: string;
  /**
   * 创建时间
   */
  createTime?: string;
  /**
   * 日期范围参数
   */
  params?: any;
}
