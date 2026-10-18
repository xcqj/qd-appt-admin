export interface FeeStandardVO {
  /**
   * 主键
   */
  id: string | number;
  /**
   * 职称线值
   */
  title: string;
  /**
   * 门诊类型码
   */
  clinicType: string;
  /**
   * 挂号费
   */
  fee: string;
  /**
   * 状态：0正常 1停用（2026-10-18 补）
   */
  status: boolean;
}

export interface FeeStandardForm extends BaseEntity {
  /**
   * 主键
   */
  id?: number;
  /**
   * 职称线值
   */
  title?: string;
  /**
   * 门诊类型码
   */
  clinicType?: string;
  /**
   * 挂号费
   */
  fee?: number;
  /**
   * 状态：0正常 1停用（2026-10-18 补）
   */
  status?: boolean;
}

export interface FeeStandardQuery extends PageQuery {
  /**
   * 主键
   */
  id?: number;
  /**
   * 职称线值
   */
  title?: string;
  /**
   * 门诊类型码
   */
  clinicType?: string;
  /**
   * 挂号费
   */
  fee?: number;
  /**
   * 状态：0正常 1停用（2026-10-18 补）
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
