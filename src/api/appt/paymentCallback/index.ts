import type { PaymentCallbackForm, PaymentCallbackQuery, PaymentCallbackVO } from '@/api/appt/paymentCallback/types';
import type { PageResult } from '@/api/types';
import type { AxiosPromise } from '@/utils/api-types';
import request from '@/utils/request';

/**
 * 查询支付回调列表
 * @param query
 * @returns {*}
 */
export const listPaymentCallback = (query?: PaymentCallbackQuery): AxiosPromise<PageResult<PaymentCallbackVO>> => {
  return request({
    url: '/appt/paymentCallback/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询支付回调详细
 * @param id
 */
export const getPaymentCallback = (id: string | number): AxiosPromise<PaymentCallbackVO> => {
  return request({
    url: '/appt/paymentCallback/' + id,
    method: 'get'
  });
};

/**
 * 新增支付回调
 * @param data
 */
export const addPaymentCallback = (data: PaymentCallbackForm) => {
  return request({
    url: '/appt/paymentCallback',
    method: 'post',
    data: data
  });
};

/**
 * 修改支付回调
 * @param data
 */
export const updatePaymentCallback = (data: PaymentCallbackForm) => {
  return request({
    url: '/appt/paymentCallback',
    method: 'put',
    data: data
  });
};



/**
 * 删除支付回调
 * @param id
 */
export const delPaymentCallback = (id: string | number | Array<string | number>) => {
  return request({
    url: '/appt/paymentCallback/' + id,
    method: 'delete'
  });
};
