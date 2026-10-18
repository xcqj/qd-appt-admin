import type { BlacklistForm, BlacklistQuery, BlacklistVO } from '@/api/appt/blacklist/types';
import type { PageResult } from '@/api/types';
import type { AxiosPromise } from '@/utils/api-types';
import request from '@/utils/request';

/**
 * 查询黑名单列表
 * @param query
 * @returns {*}
 */
export const listBlacklist = (query?: BlacklistQuery): AxiosPromise<PageResult<BlacklistVO>> => {
  return request({
    url: '/appt/admin/blacklist/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询黑名单详细
 * @param id
 */
export const getBlacklist = (id: string | number): AxiosPromise<BlacklistVO> => {
  return request({
    url: '/appt/admin/blacklist/' + id,
    method: 'get'
  });
};

/**
 * 新增黑名单
 * @param data
 */
export const addBlacklist = (data: BlacklistForm) => {
  return request({
    url: '/appt/admin/blacklist',
    method: 'post',
    data: data
  });
};

/**
 * 修改黑名单
 * @param data
 */
export const updateBlacklist = (data: BlacklistForm) => {
  return request({
    url: '/appt/admin/blacklist',
    method: 'put',
    data: data
  });
};



/**
 * 删除黑名单
 * @param id
 */
export const delBlacklist = (id: string | number | Array<string | number>) => {
  return request({
    url: '/appt/admin/blacklist/' + id,
    method: 'delete'
  });
};
