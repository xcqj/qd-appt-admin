import type { RefundForm, RefundQuery, RefundVO } from '@/api/appt/refund/types';
import type { PageResult } from '@/api/types';
import type { AxiosPromise } from '@/utils/api-types';
import request from '@/utils/request';

/**
 * 查询退款单列表
 * @param query
 * @returns {*}
 */
export const listRefund = (query?: RefundQuery): AxiosPromise<PageResult<RefundVO>> => {
  return request({
    url: '/appt/admin/refund/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询退款单详细
 * @param id
 */
export const getRefund = (id: string | number): AxiosPromise<RefundVO> => {
  return request({
    url: '/appt/admin/refund/' + id,
    method: 'get'
  });
};

/**
 * 新增退款单
 * @param data
 */
export const addRefund = (data: RefundForm) => {
  return request({
    url: '/appt/admin/refund',
    method: 'post',
    data: data
  });
};

/**
 * 修改退款单
 * @param data
 */
export const updateRefund = (data: RefundForm) => {
  return request({
    url: '/appt/admin/refund',
    method: 'put',
    data: data
  });
};



/**
 * 删除退款单
 * @param id
 */
export const delRefund = (id: string | number | Array<string | number>) => {
  return request({
    url: '/appt/admin/refund/' + id,
    method: 'delete'
  });
};
