import type { CampusForm, CampusQuery, CampusVO } from '@/api/appt/campus/types';
import type { PageResult } from '@/api/types';
import type { AxiosPromise } from '@/utils/api-types';
import request from '@/utils/request';

/**
 * 查询院区管理列表
 * @param query
 * @returns {*}
 */
export const listCampus = (query?: CampusQuery): AxiosPromise<PageResult<CampusVO>> => {
  return request({
    url: '/appt/admin/campus/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询院区管理详细
 * @param id
 */
export const getCampus = (id: string | number): AxiosPromise<CampusVO> => {
  return request({
    url: '/appt/admin/campus/' + id,
    method: 'get'
  });
};

/**
 * 新增院区管理
 * @param data
 */
export const addCampus = (data: CampusForm) => {
  return request({
    url: '/appt/admin/campus',
    method: 'post',
    data: data
  });
};

/**
 * 修改院区管理
 * @param data
 */
export const updateCampus = (data: CampusForm) => {
  return request({
    url: '/appt/admin/campus',
    method: 'put',
    data: data
  });
};



/**
 * 删除院区管理
 * @param id
 */
export const delCampus = (id: string | number | Array<string | number>) => {
  return request({
    url: '/appt/admin/campus/' + id,
    method: 'delete'
  });
};
