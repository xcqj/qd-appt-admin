export interface ClinicTypeVO {
  /**
   * 主键
   */
  id: string | number;
  /**
   * 类型码：NORMAL普通 NIGHT夜间延时 EXPERT知名专家
   */
  code: string;
  /**
   * 类型名
   */
  name: string;
  /**
   * 排序
   */
  sort: number;
  /**
   * 状态：0正常 1停用
   */
  status: boolean;
}

export interface ClinicTypeForm extends BaseEntity {
  /**
   * 主键
   */
  id?: string | number;
  /**
   * 类型码：NORMAL普通 NIGHT夜间延时 EXPERT知名专家
   */
  code?: string;
  /**
   * 类型名
   */
  name?: string;
  /**
   * 排序
   */
  sort?: number;
  /**
   * 状态：0正常 1停用
   */
  status?: boolean;
}

export interface ClinicTypeQuery extends PageQuery {
  /**
   * 主键
   */
  id?: string | number;
  /**
   * 类型码：NORMAL普通 NIGHT夜间延时 EXPERT知名专家
   */
  code?: string;
  /**
   * 类型名
   */
  name?: string;
  /**
   * 排序
   */
  sort?: number;
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
