import type { SuspendForm, SuspendHandleVO, SuspendQuery, SuspendVO } from '@/api/appt/suspend/types';
import type { PageResult } from '@/api/types';
import type { AxiosPromise } from '@/utils/api-types';
import request from '@/utils/request';

/**
 * 查询停诊登记列表
 * @param query
 * @returns {*}
 */
export const listSuspend = (query?: SuspendQuery): AxiosPromise<PageResult<SuspendVO>> => {
  return request({
    url: '/appt/admin/suspend/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询停诊登记详细
 * @param id
 */
export const getSuspend = (id: string | number): AxiosPromise<SuspendVO> => {
  return request({
    url: '/appt/admin/suspend/' + id,
    method: 'get'
  });
};

/**
 * F2 停诊处理（入参是登记行 id，不是批号）：批量停诊号源 + 被动退号 + 退款 + 通知
 * @param suspendId 登记行主键
 */
export const handleSuspend = (suspendId: string | number): AxiosPromise<SuspendHandleVO> => {
  return request({
    url: '/appt/admin/suspend/handle',
    method: 'post',
    data: { suspendId }
  });
};

/**
 * 新增停诊登记
 * @param data
 */
export const addSuspend = (data: SuspendForm) => {
  return request({
    url: '/appt/admin/suspend',
    method: 'post',
    data: data
  });
};

/**
 * 修改停诊登记
 * @param data
 */
export const updateSuspend = (data: SuspendForm) => {
  return request({
    url: '/appt/admin/suspend',
    method: 'put',
    data: data
  });
};



/**
 * 删除停诊登记
 * @param id
 */
export const delSuspend = (id: string | number | Array<string | number>) => {
  return request({
    url: '/appt/admin/suspend/' + id,
    method: 'delete'
  });
};
