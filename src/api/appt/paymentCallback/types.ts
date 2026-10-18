export interface PaymentCallbackVO {
  /**
   * 主键
   */
  id: string | number;
  /**
   * 支付单号
   */
  paymentNo: string;
  /**
   * 渠道流水号
   */
  tradeNo: string;
  /**
   * 渠道通知唯一id
   */
  notifyId: string | number;
  /**
   * 渠道
   */
  channel: string;
  /**
   * 验签：0通过 1失败
   */
  signFlag: string;
  /**
   * PENDING SUCCESS IGNORED重复丢弃 FAILED
   */
  processStatus: string;
}

export interface PaymentCallbackForm extends BaseEntity {
}

export interface PaymentCallbackQuery extends PageQuery {
  /**
   * 主键
   */
  id?: string | number;
  /**
   * 支付单号
   */
  paymentNo?: string;
  /**
   * 渠道流水号
   */
  tradeNo?: string;
  /**
   * 渠道通知唯一id
   */
  notifyId?: string | number;
  /**
   * 渠道
   */
  channel?: string;
  /**
   * 验签：0通过 1失败
   */
  signFlag?: string;
  /**
   * PENDING SUCCESS IGNORED重复丢弃 FAILED
   */
  processStatus?: string;
  /**
   * 创建时间
   */
  createTime?: string;
  /**
   * 日期范围参数
   */
  params?: any;
}
