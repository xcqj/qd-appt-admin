import type { SlotForm, SlotQuery, SlotVO } from '@/api/appt/slot/types';
import type { PageResult } from '@/api/types';
import type { AxiosPromise } from '@/utils/api-types';
import request from '@/utils/request';

/**
 * 查询号源列表
 * @param query
 * @returns {*}
 */
export const listSlot = (query?: SlotQuery): AxiosPromise<PageResult<SlotVO>> => {
  return request({
    url: '/appt/slot/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询号源详细
 * @param id
 */
export const getSlot = (id: string | number): AxiosPromise<SlotVO> => {
  return request({
    url: '/appt/slot/' + id,
    method: 'get'
  });
};

/**
 * 新增号源
 * @param data
 */
export const addSlot = (data: SlotForm) => {
  return request({
    url: '/appt/slot',
    method: 'post',
    data: data
  });
};

/**
 * 修改号源
 * @param data
 */
export const updateSlot = (data: SlotForm) => {
  return request({
    url: '/appt/slot',
    method: 'put',
    data: data
  });
};



/**
 * 删除号源
 * @param id
 */
export const delSlot = (id: string | number | Array<string | number>) => {
  return request({
    url: '/appt/slot/' + id,
    method: 'delete'
  });
};
