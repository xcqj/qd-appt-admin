export interface SlotLedgerVO {
  /**
   * 主键
   */
  id: string | number;
  /**
   * 号源id
   */
  slotId: string | number;
  /**
   * GENERATE生成 OCCUPY占用 RELEASE释放 REFILL回补 SUSPEND停诊 EXPIRE过期
   */
  action: string;
  /**
   * 变更前状态（生成时为空）
   */
  beforeStatus: string;
  /**
   * 变更后状态
   */
  afterStatus: string;
  /**
   * 关联挂号单id
   */
  registrationId: string | number;
  /**
   * 任务批号（批量操作倒查）
   */
  batchNo: string;
}

export interface SlotLedgerForm extends BaseEntity {
}

export interface SlotLedgerQuery extends PageQuery {
  /**
   * 主键
   */
  id?: number;
  /**
   * 号源id
   */
  slotId?: number;
  /**
   * GENERATE生成 OCCUPY占用 RELEASE释放 REFILL回补 SUSPEND停诊 EXPIRE过期
   */
  action?: string;
  /**
   * 变更前状态（生成时为空）
   */
  beforeStatus?: string;
  /**
   * 变更后状态
   */
  afterStatus?: string;
  /**
   * 关联挂号单id
   */
  registrationId?: number;
  /**
   * 任务批号（批量操作倒查）
   */
  batchNo?: string;
  /**
   * 创建时间
   */
  createTime?: string;
  /**
   * 日期范围参数
   */
  params?: any;
}
