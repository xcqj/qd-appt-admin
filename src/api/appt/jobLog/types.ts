export interface JobLogVO {
  /**
   * 主键
   */
  id: string | number;
  /**
   * 任务名
   */
  jobName: string;
  /**
   * 批号（I8 不重跑、漏跑可补）
   */
  batchNo: string;
  /**
   * 开始时间
   */
  startTime: string;
  /**
   * 结束时间
   */
  endTime: string;
  /**
   * RUNNING SUCCESS FAIL SKIPPED
   */
  status: string;
  /**
   * 影响行数
   */
  affectedRows: number;
}

export interface JobLogForm extends BaseEntity {
}

/** 手动执行一轮任务的结果（POST /appt/admin/job/{jobName}/run） */
export interface JobRunVO {
  jobName: string;
  batchNo: string;
  /** SUCCESS / FAIL / SKIPPED */
  status: string;
  affectedRows: number;
  message: string;
}

export interface JobLogQuery extends PageQuery {
  /**
   * 主键
   */
  id?: number;
  /**
   * 任务名
   */
  jobName?: string;
  /**
   * 批号（I8 不重跑、漏跑可补）
   */
  batchNo?: string;
  /**
   * 开始时间
   */
  startTime?: string;
  /**
   * 结束时间
   */
  endTime?: string;
  /**
   * RUNNING SUCCESS FAIL SKIPPED
   */
  status?: string;
  /**
   * 影响行数
   */
  affectedRows?: number;
  /**
   * 结果信息
   */
  message?: string;
  /**
   * 创建时间
   */
  createTime?: string;
  /**
   * 日期范围参数
   */
  params?: any;
}
