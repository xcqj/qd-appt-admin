import type { StaffForm, StaffQuery, StaffVO } from '@/api/appt/staff/types';
import type { PageResult } from '@/api/types';
import type { AxiosPromise } from '@/utils/api-types';
import request from '@/utils/request';

/**
 * 查询医务人员列表
 * @param query
 * @returns {*}
 */
export const listStaff = (query?: StaffQuery): AxiosPromise<PageResult<StaffVO>> => {
  return request({
    url: '/appt/admin/staff/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询医务人员详细
 * @param id
 */
export const getStaff = (id: string | number): AxiosPromise<StaffVO> => {
  return request({
    url: '/appt/admin/staff/' + id,
    method: 'get'
  });
};

/**
 * 新增医务人员
 * @param data
 */
export const addStaff = (data: StaffForm) => {
  return request({
    url: '/appt/admin/staff',
    method: 'post',
    data: data
  });
};

/**
 * 修改医务人员
 * @param data
 */
export const updateStaff = (data: StaffForm) => {
  return request({
    url: '/appt/admin/staff',
    method: 'put',
    data: data
  });
};



/**
 * 删除医务人员
 * @param id
 */
export const delStaff = (id: string | number | Array<string | number>) => {
  return request({
    url: '/appt/admin/staff/' + id,
    method: 'delete'
  });
};
