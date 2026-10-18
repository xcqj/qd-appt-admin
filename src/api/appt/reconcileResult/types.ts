export interface ReconcileResultVO {
  /**
   * 主键
   */
  id: string | number;
  /**
   * 对账批次号
   */
  batchNo: string;
  /**
   * 检查项 R1~R7（技术方案 §3.6）
   */
  checkType: string;
  /**
   * 目标id（slot / registration / payment）
   */
  targetId: string | number;
  /**
   * AUTO_FIX自动修复 ALERT告警
   */
  action: string;
  /**
   * OK正常 FIXED已修复 ALERT待人工
   */
  status: string;
}

export interface ReconcileResultForm extends BaseEntity {
}

export interface ReconcileResultQuery extends PageQuery {
  /**
   * 主键
   */
  id?: number;
  /**
   * 对账批次号
   */
  batchNo?: string;
  /**
   * 检查项 R1~R7（技术方案 §3.6）
   */
  checkType?: string;
  /**
   * 目标id（slot / registration / payment）
   */
  targetId?: number;
  /**
   * AUTO_FIX自动修复 ALERT告警
   */
  action?: string;
  /**
   * OK正常 FIXED已修复 ALERT待人工
   */
  status?: string;
  /**
   * 详情
   */
  detail?: string;
  /**
   * 创建时间
   */
  createTime?: string;
  /**
   * 日期范围参数
   */
  params?: any;
}
