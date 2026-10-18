import type { PaymentForm, PaymentQuery, PaymentVO } from '@/api/appt/payment/types';
import type { PageResult } from '@/api/types';
import type { AxiosPromise } from '@/utils/api-types';
import request from '@/utils/request';

/**
 * 查询支付单列表
 * @param query
 * @returns {*}
 */
export const listPayment = (query?: PaymentQuery): AxiosPromise<PageResult<PaymentVO>> => {
  return request({
    url: '/appt/admin/payment/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询支付单详细
 * @param id
 */
export const getPayment = (id: string | number): AxiosPromise<PaymentVO> => {
  return request({
    url: '/appt/admin/payment/' + id,
    method: 'get'
  });
};

/**
 * 新增支付单
 * @param data
 */
export const addPayment = (data: PaymentForm) => {
  return request({
    url: '/appt/admin/payment',
    method: 'post',
    data: data
  });
};

/**
 * 修改支付单
 * @param data
 */
export const updatePayment = (data: PaymentForm) => {
  return request({
    url: '/appt/admin/payment',
    method: 'put',
    data: data
  });
};



/**
 * 删除支付单
 * @param id
 */
export const delPayment = (id: string | number | Array<string | number>) => {
  return request({
    url: '/appt/admin/payment/' + id,
    method: 'delete'
  });
};
