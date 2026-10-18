export interface SlotTemplateVO {
  /**
   * 主键
   */
  id: string | number;
  /**
   * 医务人员id
   */
  staffId: string | number;
  /**
   * 午别：AM上午 PM下午 NIGHT夜间
   */
  period: string;
  /**
   * 门诊类型码
   */
  clinicType: string;
  /**
   * 起始时刻
   */
  startTime: string;
  /**
   * 结束时刻
   */
  endTime: string;
  /**
   * 步长（分钟）：4 / 5~6 / 6~7 / 10 均会出现（PRD §4.2-1）
   */
  stepMinutes: number;
  /**
   * 状态：0正常 1停用
   */
  status: boolean;
}

export interface SlotTemplateForm extends BaseEntity {
  /**
   * 主键
   */
  id?: number;
  /**
   * 医务人员id
   */
  staffId?: number;
  /**
   * 午别：AM上午 PM下午 NIGHT夜间
   */
  period?: string;
  /**
   * 门诊类型码
   */
  clinicType?: string;
  /**
   * 起始时刻
   */
  startTime?: string;
  /**
   * 结束时刻
   */
  endTime?: string;
  /**
   * 步长（分钟）：4 / 5~6 / 6~7 / 10 均会出现（PRD §4.2-1）
   */
  stepMinutes?: number;
  /**
   * 状态：0正常 1停用
   */
  status?: boolean;
}

export interface SlotTemplateQuery extends PageQuery {
  /**
   * 主键
   */
  id?: number;
  /**
   * 医务人员id
   */
  staffId?: number;
  /**
   * 午别：AM上午 PM下午 NIGHT夜间
   */
  period?: string;
  /**
   * 门诊类型码
   */
  clinicType?: string;
  /**
   * 起始时刻
   */
  startTime?: string;
  /**
   * 结束时刻
   */
  endTime?: string;
  /**
   * 步长（分钟）：4 / 5~6 / 6~7 / 10 均会出现（PRD §4.2-1）
   */
  stepMinutes?: number;
  /**
   * 状态：0正常 1停用
   */
  status?: boolean;
  /**
   * 创建时间
   */
  createTime?: string;
  /**
   * 日期范围参数
   */
  params?: any;
}
