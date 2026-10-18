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
   * 科室id
   */
  deptId: string | number;
  /**
   * 院区id（冗余自 staff，供停诊按院区筛选）
   */
  campusId: string | number;
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
}

export interface ScheduleForm extends BaseEntity {
}

export interface ScheduleQuery extends PageQuery {
  /**
   * 主键
   */
  id?: string | number;
  /**
   * 医务人员id
   */
  staffId?: string | number;
  /**
   * 科室id
   */
  deptId?: string | number;
  /**
   * 院区id（冗余自 staff，供停诊按院区筛选）
   */
  campusId?: string | number;
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
