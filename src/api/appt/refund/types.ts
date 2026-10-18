export interface RefundVO {
  /**
   * 主键
   */
  id: string | number;
  /**
   * 退款单号：F + yyyyMMdd + 6位当日序列
   */
  refundNo: string;
  /**
   * 支付单id
   */
  paymentId: string | number;
  /**
   * 挂号单id
   */
  registrationId: string | number;
  /**
   * 退款金额
   */
  amount: string;
  /**
   * WAIT_REFUND待退款 REFUNDED已退款 FAILED退款失败（退避重试耗尽，终态；再退由人工另建单）
   */
  status: string;
  /**
   * 退款原因
   */
  reason: string;
  /**
   * 退款完成时间
   */
  refundTime: string;
}

export interface RefundForm extends BaseEntity {
}

export interface RefundQuery extends PageQuery {
  /**
   * 主键
   */
  id?: number;
  /**
   * 退款单号：F + yyyyMMdd + 6位当日序列
   */
  refundNo?: string;
  /**
   * 支付单id
   */
  paymentId?: number;
  /**
   * 挂号单id
   */
  registrationId?: number;
  /**
   * 退款金额
   */
  amount?: number;
  /**
   * WAIT_REFUND待退款 REFUNDED已退款 FAILED退款失败（退避重试耗尽，终态；再退由人工另建单）
   */
  status?: string;
  /**
   * 退款原因
   */
  reason?: string;
  /**
   * 退款完成时间
   */
  refundTime?: string;
  /**
   * 创建时间
   */
  createTime?: string;
  /**
   * 日期范围参数
   */
  params?: any;
}
