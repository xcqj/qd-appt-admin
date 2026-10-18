export interface BlacklistVO {
  /**
   * 主键
   */
  id: string | number;
  /**
   * 账号id（账号级统计，M13）
   */
  userId: string | number;
  /**
   * 关联就诊人id（可空）
   */
  patientId: string | number;
  /**
   * 列入原因
   */
  reason: string;
  /**
   * 生效时间
   */
  startTime: string;
  /**
   * 失效时间（半年内退号+爽约合计6次 → 限制半年，PRD §14.2-6）
   */
  endTime: string;
  /**
   * 操作人
   */
  operator: string;
  /**
   * 状态：0生效 1已解除
   */
  status: boolean;
}

export interface BlacklistForm extends BaseEntity {
  /**
   * 主键
   */
  id?: string | number;
  /**
   * 账号id（账号级统计，M13）
   */
  userId?: string | number;
  /**
   * 关联就诊人id（可空）
   */
  patientId?: string | number;
  /**
   * 列入原因
   */
  reason?: string;
  /**
   * 生效时间
   */
  startTime?: string;
  /**
   * 失效时间（半年内退号+爽约合计6次 → 限制半年，PRD §14.2-6）
   */
  endTime?: string;
  /**
   * 操作人
   */
  operator?: string;
  /**
   * 状态：0生效 1已解除
   */
  status?: boolean;
}

export interface BlacklistQuery extends PageQuery {
  /**
   * 主键
   */
  id?: string | number;
  /**
   * 账号id（账号级统计，M13）
   */
  userId?: string | number;
  /**
   * 关联就诊人id（可空）
   */
  patientId?: string | number;
  /**
   * 列入原因
   */
  reason?: string;
  /**
   * 生效时间
   */
  startTime?: string;
  /**
   * 失效时间（半年内退号+爽约合计6次 → 限制半年，PRD §14.2-6）
   */
  endTime?: string;
  /**
   * 操作人
   */
  operator?: string;
  /**
   * 状态：0生效 1已解除
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
