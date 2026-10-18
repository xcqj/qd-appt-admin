export interface PatientVO {
  /**
   * 主键
   */
  id: string | number;
  /**
   * 归属账号id（sys_user）
   */
  userId: string | number;
  /**
   * 就诊人姓名
   */
  name: string;
  /**
   * 证件类型：IDCARD身份证 CARD就诊卡
   */
  idType: string | number;
  /**
   * 是否默认就诊人：1=默认 / NULL=非默认（D-S1-8）。NULL 互不冲突，故 UNIQUE(user_id, is_default) 可保证一账号至多一个默认；非默认一律存 NULL 不可存 0
   */
  isDefault: number;
  /**
   * 状态：0正常 1停用
   */
  status: boolean;
}

export interface PatientForm extends BaseEntity {
  /**
   * 主键
   */
  id?: number;
  /**
   * 归属账号id（sys_user）
   */
  userId?: number;
  /**
   * 就诊人姓名
   */
  name?: string;
  /**
   * 证件类型：IDCARD身份证 CARD就诊卡
   */
  idType?: number;
  /**
   * 证件号：生产 AES 密文，演示期明文（M11）；日志禁止打印
   */
  idNo?: number;
  /**
   * 状态：0正常 1停用
   */
  status?: boolean;
}

export interface PatientQuery extends PageQuery {
  /**
   * 主键
   */
  id?: number;
  /**
   * 归属账号id（sys_user）
   */
  userId?: number;
  /**
   * 就诊人姓名
   */
  name?: string;
  /**
   * 证件类型：IDCARD身份证 CARD就诊卡
   */
  idType?: number;
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
