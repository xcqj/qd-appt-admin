export interface NoticeVO {
  /**
   * 主键
   */
  id: string | number;
  /**
   * 接收账号id
   */
  userId: string | number;
  /**
   * 通知场景（PRD §6.12）
   */
  type: string;
  /**
   * 标题
   */
  title: string;
  /**
   * 已读：1是 0否
   */
  readFlag: boolean;
}

export interface NoticeForm extends BaseEntity {
}

export interface NoticeQuery extends PageQuery {
  /**
   * 主键
   */
  id?: number;
  /**
   * 接收账号id
   */
  userId?: number;
  /**
   * 通知场景（PRD §6.12）
   */
  type?: string;
  /**
   * 标题
   */
  title?: string;
  /**
   * 已读：1是 0否
   */
  readFlag?: boolean;
  /**
   * 创建时间
   */
  createTime?: string;
  /**
   * 日期范围参数
   */
  params?: any;
}
