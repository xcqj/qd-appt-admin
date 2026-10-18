export interface StaffFavoriteVO {
  /**
   * 主键
   */
  id: string | number;
  /**
   * 账号id（sys_user）
   */
  userId: string | number;
  /**
   * 医务人员id
   */
  staffId: string | number;
}

export interface StaffFavoriteForm extends BaseEntity {
}

export interface StaffFavoriteQuery extends PageQuery {
  /**
   * 主键
   */
  id?: string | number;
  /**
   * 账号id（sys_user）
   */
  userId?: string | number;
  /**
   * 医务人员id
   */
  staffId?: string | number;
  /**
   * 创建时间
   */
  createTime?: string;
  /**
   * 日期范围参数
   */
  params?: any;
}
