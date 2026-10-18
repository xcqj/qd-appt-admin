import type { DeptForm, DeptQuery, DeptVO } from '@/api/appt/dept/types';
import type { PageResult } from '@/api/types';
import type { AxiosPromise } from '@/utils/api-types';
import request from '@/utils/request';

/**
 * 查询科室树列表
 * @param query
 * @returns {*}
 */
export const listDept = (query?: DeptQuery): AxiosPromise<PageResult<DeptVO>> => {
  return request({
    url: '/appt/dept/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询科室树详细
 * @param id
 */
export const getDept = (id: string | number): AxiosPromise<DeptVO> => {
  return request({
    url: '/appt/dept/' + id,
    method: 'get'
  });
};

/**
 * 新增科室树
 * @param data
 */
export const addDept = (data: DeptForm) => {
  return request({
    url: '/appt/dept',
    method: 'post',
    data: data
  });
};

/**
 * 修改科室树
 * @param data
 */
export const updateDept = (data: DeptForm) => {
  return request({
    url: '/appt/dept',
    method: 'put',
    data: data
  });
};



/**
 * 删除科室树
 * @param id
 */
export const delDept = (id: string | number | Array<string | number>) => {
  return request({
    url: '/appt/dept/' + id,
    method: 'delete'
  });
};
