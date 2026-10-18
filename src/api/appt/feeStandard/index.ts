import type { FeeStandardForm, FeeStandardQuery, FeeStandardVO } from '@/api/appt/feeStandard/types';
import type { PageResult } from '@/api/types';
import type { AxiosPromise } from '@/utils/api-types';
import request from '@/utils/request';

/**
 * 查询收费标准列表
 * @param query
 * @returns {*}
 */
export const listFeeStandard = (query?: FeeStandardQuery): AxiosPromise<PageResult<FeeStandardVO>> => {
  return request({
    url: '/appt/feeStandard/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询收费标准详细
 * @param id
 */
export const getFeeStandard = (id: string | number): AxiosPromise<FeeStandardVO> => {
  return request({
    url: '/appt/feeStandard/' + id,
    method: 'get'
  });
};

/**
 * 新增收费标准
 * @param data
 */
export const addFeeStandard = (data: FeeStandardForm) => {
  return request({
    url: '/appt/feeStandard',
    method: 'post',
    data: data
  });
};

/**
 * 修改收费标准
 * @param data
 */
export const updateFeeStandard = (data: FeeStandardForm) => {
  return request({
    url: '/appt/feeStandard',
    method: 'put',
    data: data
  });
};



/**
 * 删除收费标准
 * @param id
 */
export const delFeeStandard = (id: string | number | Array<string | number>) => {
  return request({
    url: '/appt/feeStandard/' + id,
    method: 'delete'
  });
};
