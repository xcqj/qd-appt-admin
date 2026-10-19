export interface PaymentVO {
  /**
   * 主键
   */
  id: string | number;
  /**
   * 支付单号：P + yyyyMMdd + 6位当日序列
   */
  paymentNo: string;
  /**
   * 挂号单id
   */
  registrationId: string | number;
  /**
   * 挂号单号（服务端回填）
   */
  registrationNo?: string;
  /**
   * 医务人员姓名（服务端回填）
   */
  staffName?: string;
  /**
   * 科室名（服务端回填）
   */
  deptName?: string;
  /**
   * 院区名（服务端回填）
   */
  campusName?: string;
  /**
   * 支付金额（= registration.fee，I2）
   */
  amount: string;
  /**
   * 渠道：本期仅 MOCK（PRD §12）
   */
  channel: string;
  /**
   * WAIT_PAY待支付 PAID已支付 CLOSED已关闭 REFUNDED已退款
   */
  status: string;
  /**
   * 渠道流水号
   */
  tradeNo: string;
  /**
   * 支付截止时间（创建时间 + 15 分钟，PRD §14.2-3）
   */
  expireTime: string;
  /**
   * 支付完成时间
   */
  payTime: string;
}

export interface PaymentForm extends BaseEntity {
}

export interface PaymentQuery extends PageQuery {
  /**
   * 主键
   */
  id?: number;
  /**
   * 支付单号：P + yyyyMMdd + 6位当日序列
   */
  paymentNo?: string;
  /**
   * 挂号单id
   */
  registrationId?: number;
  /**
   * 支付金额（= registration.fee，I2）
   */
  amount?: number;
  /**
   * 渠道：本期仅 MOCK（PRD §12）
   */
  channel?: string;
  /**
   * WAIT_PAY待支付 PAID已支付 CLOSED已关闭 REFUNDED已退款
   */
  status?: string;
  /**
   * 渠道流水号
   */
  tradeNo?: string;
  /**
   * 支付截止时间（创建时间 + 15 分钟，PRD §14.2-3）
   */
  expireTime?: string;
  /**
   * 支付完成时间
   */
  payTime?: string;
  /**
   * 创建时间
   */
  createTime?: string;
  /**
   * 日期范围参数
   */
  params?: any;
}
