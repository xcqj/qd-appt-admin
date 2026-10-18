import type { ScheduleForm, ScheduleQuery, ScheduleVO } from '@/api/appt/schedule/types';
import type { PageResult } from '@/api/types';
import type { AxiosPromise } from '@/utils/api-types';
import request from '@/utils/request';

/**
 * 查询排班列表
 * @param query
 * @returns {*}
 */
export const listSchedule = (query?: ScheduleQuery): AxiosPromise<PageResult<ScheduleVO>> => {
  return request({
    url: '/appt/admin/schedule/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询排班详细
 * @param id
 */
export const getSchedule = (id: string | number): AxiosPromise<ScheduleVO> => {
  return request({
    url: '/appt/admin/schedule/' + id,
    method: 'get'
  });
};

/**
 * 新增排班
 * @param data
 */
export const addSchedule = (data: ScheduleForm) => {
  return request({
    url: '/appt/admin/schedule',
    method: 'post',
    data: data
  });
};

/**
 * 修改排班
 * @param data
 */
export const updateSchedule = (data: ScheduleForm) => {
  return request({
    url: '/appt/admin/schedule',
    method: 'put',
    data: data
  });
};



/**
 * 删除排班
 * @param id
 */
export const delSchedule = (id: string | number | Array<string | number>) => {
  return request({
    url: '/appt/admin/schedule/' + id,
    method: 'delete'
  });
};
