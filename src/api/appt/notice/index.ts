import type { NoticeForm, NoticeQuery, NoticeVO } from '@/api/appt/notice/types';
import type { PageResult } from '@/api/types';
import type { AxiosPromise } from '@/utils/api-types';
import request from '@/utils/request';

/**
 * 查询站内信列表
 * @param query
 * @returns {*}
 */
export const listNotice = (query?: NoticeQuery): AxiosPromise<PageResult<NoticeVO>> => {
  return request({
    url: '/appt/admin/notice/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询站内信详细
 * @param id
 */
export const getNotice = (id: string | number): AxiosPromise<NoticeVO> => {
  return request({
    url: '/appt/admin/notice/' + id,
    method: 'get'
  });
};

/**
 * 新增站内信
 * @param data
 */
export const addNotice = (data: NoticeForm) => {
  return request({
    url: '/appt/admin/notice',
    method: 'post',
    data: data
  });
};

/**
 * 修改站内信
 * @param data
 */
export const updateNotice = (data: NoticeForm) => {
  return request({
    url: '/appt/admin/notice',
    method: 'put',
    data: data
  });
};



/**
 * 删除站内信
 * @param id
 */
export const delNotice = (id: string | number | Array<string | number>) => {
  return request({
    url: '/appt/admin/notice/' + id,
    method: 'delete'
  });
};
