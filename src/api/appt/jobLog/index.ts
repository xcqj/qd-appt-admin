import type { JobLogForm, JobLogQuery, JobLogVO, JobRunVO } from '@/api/appt/jobLog/types';
import type { PageResult } from '@/api/types';
import type { AxiosPromise } from '@/utils/api-types';
import request from '@/utils/request';

/**
 * 查询任务日志列表
 * @param query
 * @returns {*}
 */
export const listJobLog = (query?: JobLogQuery): AxiosPromise<PageResult<JobLogVO>> => {
  return request({
    url: '/appt/admin/jobLog/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询任务日志详细
 * @param id
 */
export const getJobLog = (id: string | number): AxiosPromise<JobLogVO> => {
  return request({
    url: '/appt/admin/jobLog/' + id,
    method: 'get'
  });
};

/**
 * 手动执行一轮定时任务（白名单任务名）
 * @param jobName apptNoShowJob / apptCompleteJob / apptPaymentCloseJob / apptReleaseJob
 */
export const runJob = (jobName: string): AxiosPromise<JobRunVO> => {
  return request({
    url: '/appt/admin/job/' + jobName + '/run',
    method: 'post'
  });
};

/**
 * 新增任务日志
 * @param data
 */
export const addJobLog = (data: JobLogForm) => {
  return request({
    url: '/appt/admin/jobLog',
    method: 'post',
    data: data
  });
};

/**
 * 修改任务日志
 * @param data
 */
export const updateJobLog = (data: JobLogForm) => {
  return request({
    url: '/appt/admin/jobLog',
    method: 'put',
    data: data
  });
};



/**
 * 删除任务日志
 * @param id
 */
export const delJobLog = (id: string | number | Array<string | number>) => {
  return request({
    url: '/appt/admin/jobLog/' + id,
    method: 'delete'
  });
};
