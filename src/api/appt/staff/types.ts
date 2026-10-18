export interface StaffVO {
  /**
   * 主键
   */
  id: string | number;
  /**
   * 所属院区（单值；跨院区出诊为已知边界 PRD §14.3 / M7）
   */
  campusId: string | number;
  /**
   * 所属科室（叶子节点）
   */
  deptId: string | number;
  /**
   * 姓名（虚构）
   */
  name: string;
  /**
   * 头像（占位图）
   */
  avatar: string;
  avatarUrl?: string;
  /**
   * 职称：CHIEF主任医师 ASSOC_CHIEF副主任医师 ATTENDING主治医师 PHYSICIAN医师 ASSOC_CHIEF_NURSE副主任护师
   */
  title: string;
  /**
   * 学位
   */
  degree: string;
  /**
   * 类型：DOCTOR医生 NURSE护士
   */
  type: string;
  /**
   * 门诊类型码（D-S1-7；契约 §3.4 医生主页需返回 clinicType）
   */
  clinicType: string;
  /**
   * 排序
   */
  sort: number;
  /**
   * 状态：0正常 1停用
   */
  status: boolean;
}

export interface StaffForm extends BaseEntity {
  /**
   * 主键
   */
  id?: number;
  /**
   * 所属院区（单值；跨院区出诊为已知边界 PRD §14.3 / M7）
   */
  campusId?: string | number;
  /**
   * 所属科室（叶子节点）
   */
  deptId?: string | number;
  /**
   * 姓名（虚构）
   */
  name?: string;
  /**
   * 头像（占位图）
   */
  avatar?: string;
  /**
   * 职称：CHIEF主任医师 ASSOC_CHIEF副主任医师 ATTENDING主治医师 PHYSICIAN医师 ASSOC_CHIEF_NURSE副主任护师
   */
  title?: string;
  /**
   * 学位
   */
  degree?: string;
  /**
   * 类型：DOCTOR医生 NURSE护士
   */
  type?: string;
  /**
   * 门诊类型码（D-S1-7；契约 §3.4 医生主页需返回 clinicType）
   */
  clinicType?: string;
  /**
   * 简介
   */
  intro?: string;
  /**
   * 排序
   */
  sort?: number;
  /**
   * 状态：0正常 1停用
   */
  status?: boolean;
}

export interface StaffQuery extends PageQuery {
  /**
   * 主键
   */
  id?: number;
  /**
   * 所属院区（单值；跨院区出诊为已知边界 PRD §14.3 / M7）
   */
  campusId?: string | number;
  /**
   * 所属科室（叶子节点）
   */
  deptId?: string | number;
  /**
   * 姓名（虚构）
   */
  name?: string;
  /**
   * 职称：CHIEF主任医师 ASSOC_CHIEF副主任医师 ATTENDING主治医师 PHYSICIAN医师 ASSOC_CHIEF_NURSE副主任护师
   */
  title?: string;
  /**
   * 学位
   */
  degree?: string;
  /**
   * 类型：DOCTOR医生 NURSE护士
   */
  type?: string;
  /**
   * 门诊类型码（D-S1-7；契约 §3.4 医生主页需返回 clinicType）
   */
  clinicType?: string;
  /**
   * 简介
   */
  intro?: string;
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
