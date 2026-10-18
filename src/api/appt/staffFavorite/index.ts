import type { StaffFavoriteForm, StaffFavoriteQuery, StaffFavoriteVO } from '@/api/appt/staffFavorite/types';
import type { PageResult } from '@/api/types';
import type { AxiosPromise } from '@/utils/api-types';
import request from '@/utils/request';

/**
 * 查询医生收藏列表
 * @param query
 * @returns {*}
 */
export const listStaffFavorite = (query?: StaffFavoriteQuery): AxiosPromise<PageResult<StaffFavoriteVO>> => {
  return request({
    url: '/appt/staffFavorite/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询医生收藏详细
 * @param id
 */
export const getStaffFavorite = (id: string | number): AxiosPromise<StaffFavoriteVO> => {
  return request({
    url: '/appt/staffFavorite/' + id,
    method: 'get'
  });
};

/**
 * 新增医生收藏
 * @param data
 */
export const addStaffFavorite = (data: StaffFavoriteForm) => {
  return request({
    url: '/appt/staffFavorite',
    method: 'post',
    data: data
  });
};

/**
 * 修改医生收藏
 * @param data
 */
export const updateStaffFavorite = (data: StaffFavoriteForm) => {
  return request({
    url: '/appt/staffFavorite',
    method: 'put',
    data: data
  });
};



/**
 * 删除医生收藏
 * @param id
 */
export const delStaffFavorite = (id: string | number | Array<string | number>) => {
  return request({
    url: '/appt/staffFavorite/' + id,
    method: 'delete'
  });
};
