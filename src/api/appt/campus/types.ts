export interface CampusVO {
  /**
   * 主键（雪花）
   */
  id: string | number;
  /**
   * 院区名（虚构，PRD §11 红线）
   */
  name: string;
  /**
   * 地址
   */
  address: string;
  /**
   * 封面图（占位图）
   */
  coverUrl: string;
  /**
   * 排序
   */
  sort: number;
  /**
   * 状态：0正常 1停用
   */
  status: boolean;
}

export interface CampusForm extends BaseEntity {
  /**
   * 主键（雪花）
   */
  id?: number;
  /**
   * 院区名（虚构，PRD §11 红线）
   */
  name?: string;
  /**
   * 地址
   */
  address?: string;
  /**
   * 封面图（占位图）
   */
  coverUrl?: string;
  /**
   * 排序
   */
  sort?: number;
  /**
   * 状态：0正常 1停用
   */
  status?: boolean;
}

export interface CampusQuery extends PageQuery {
  /**
   * 主键（雪花）
   */
  id?: number;
  /**
   * 院区名（虚构，PRD §11 红线）
   */
  name?: string;
  /**
   * 地址
   */
  address?: string;
  /**
   * 封面图（占位图）
   */
  coverUrl?: string;
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
