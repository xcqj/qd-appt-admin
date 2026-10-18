export interface DeptVO {
  /**
   * 主键
   */
  id: string | number;
  /**
   * 父级id（根节点为0）
   */
  parentId: string | number;
  /**
   * 科室名（虚构，PRD §11 红线）
   */
  name: string;
  /**
   * 层级：1/2/3
   */
  level: number;
  /**
   * 排序
   */
  sort: number;
  /**
   * 状态：0正常 1停用
   */
  status: boolean;
}

export interface DeptForm extends BaseEntity {
  /**
   * 主键
   */
  id?: number;
  /**
   * 父级id（根节点为0）
   */
  parentId?: number;
  /**
   * 科室名（虚构，PRD §11 红线）
   */
  name?: string;
  /**
   * 层级：1/2/3
   */
  level?: number;
  /**
   * 排序
   */
  sort?: number;
  /**
   * 状态：0正常 1停用
   */
  status?: boolean;
}

export interface DeptQuery extends PageQuery {
  /**
   * 主键
   */
  id?: number;
  /**
   * 父级id（根节点为0）
   */
  parentId?: number;
  /**
   * 科室名（虚构，PRD §11 红线）
   */
  name?: string;
  /**
   * 层级：1/2/3
   */
  level?: number;
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
