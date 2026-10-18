export interface SuspendVO {
  /**
   * 主键
   */
  id: string | number;
  /**
   * 批号（停诊幂等锚点 I7）
   */
  batchNo: string;
  /**
   * 范围：SCHEDULE单排班 STAFF_DATE某医生某日 CAMPUS_DATE院区某日（契约 §7.5，D-S1-5）
   */
  scopeType: string;
  /**
   * 范围值：SCHEDULE 存 scheduleId；STAFF_DATE 存 visitDate；CAMPUS_DATE 存 campusId:date（D-S1-5）
   */
  scopeValue: string;
  /**
   * 医务人员id（D-S1-5；SCHEDULE/STAFF_DATE 必填，CAMPUS_DATE 为空）
   */
  staffId: string | number;
  /**
   * 停诊原因（契约 §7.5 E5；用于向受影响患者发站内信）
   */
  reason: string;
  /**
   * PENDING待处理 HANDLED已处理（契约 §8.4 停诊登记列表按此筛选）
   */
  status: string;
  /**
   * 操作人
   */
  operator: string;
}

export interface SuspendForm extends BaseEntity {
}

export interface SuspendQuery extends PageQuery {
  /**
   * 主键
   */
  id?: string | number;
  /**
   * 批号（停诊幂等锚点 I7）
   */
  batchNo?: string;
  /**
   * 范围：SCHEDULE单排班 STAFF_DATE某医生某日 CAMPUS_DATE院区某日（契约 §7.5，D-S1-5）
   */
  scopeType?: string;
  /**
   * 范围值：SCHEDULE 存 scheduleId；STAFF_DATE 存 visitDate；CAMPUS_DATE 存 campusId:date（D-S1-5）
   */
  scopeValue?: string;
  /**
   * 医务人员id（D-S1-5；SCHEDULE/STAFF_DATE 必填，CAMPUS_DATE 为空）
   */
  staffId?: string | number;
  /**
   * 停诊原因（契约 §7.5 E5；用于向受影响患者发站内信）
   */
  reason?: string;
  /**
   * PENDING待处理 HANDLED已处理（契约 §8.4 停诊登记列表按此筛选）
   */
  status?: string;
  /**
   * 操作人
   */
  operator?: string;
  /**
   * 创建时间
   */
  createTime?: string;
  /**
   * 日期范围参数
   */
  params?: any;
}
