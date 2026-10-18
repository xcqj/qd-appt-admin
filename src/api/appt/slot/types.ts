export interface SlotVO {
  /**
   * 主键
   */
  id: string | number;
  /**
   * 排班id
   */
  scheduleId: string | number;
  /**
   * 医务人员id（冗余 D-S1-2，服务余量聚合 §3.2）
   */
  staffId: string | number;
  /**
   * 科室id（冗余）
   */
  deptId: string | number;
  /**
   * 院区id（冗余）
   */
  campusId: string | number;
  /**
   * 就诊日期（冗余，与 time_point 日期部分一致）
   */
  visitDate: string;
  /**
   * 午别（冗余）
   */
  period: string;
  /**
   * 就诊时刻（完整 datetime；对外按契约 §2.4 输出 HH:mm）
   */
  timePoint: string;
  /**
   * 挂号费（生成时快照 I2，fee_standard 变更不追溯）
   */
  fee: string;
  /**
   * AVAILABLE可约 TAKEN已占 SUSPENDED已停诊 EXPIRED已过期
   */
  status: string;
  /**
   * 来源：NORMAL正常 EXTRA加号
   */
  source: string;
  /**
   * 占用挂号单id（占用回写、回池置 NULL；I1 CAS 目标列）
   */
  registrationId: string | number;
}

export interface SlotForm extends BaseEntity {
}

export interface SlotQuery extends PageQuery {
  /**
   * 主键
   */
  id?: number;
  /**
   * 排班id
   */
  scheduleId?: number;
  /**
   * 医务人员id（冗余 D-S1-2，服务余量聚合 §3.2）
   */
  staffId?: number;
  /**
   * 科室id（冗余）
   */
  deptId?: number;
  /**
   * 院区id（冗余）
   */
  campusId?: number;
  /**
   * 就诊日期（冗余，与 time_point 日期部分一致）
   */
  visitDate?: string;
  /**
   * 午别（冗余）
   */
  period?: string;
  /**
   * 就诊时刻（完整 datetime；对外按契约 §2.4 输出 HH:mm）
   */
  timePoint?: string;
  /**
   * 挂号费（生成时快照 I2，fee_standard 变更不追溯）
   */
  fee?: number;
  /**
   * AVAILABLE可约 TAKEN已占 SUSPENDED已停诊 EXPIRED已过期
   */
  status?: string;
  /**
   * 来源：NORMAL正常 EXTRA加号
   */
  source?: string;
  /**
   * 占用挂号单id（占用回写、回池置 NULL；I1 CAS 目标列）
   */
  registrationId?: number;
  /**
   * 创建时间
   */
  createTime?: string;
  /**
   * 日期范围参数
   */
  params?: any;
}
