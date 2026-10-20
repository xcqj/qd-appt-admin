import type { ReconcileResultForm, ReconcileResultQuery, ReconcileResultVO, ReconcileRunVO } from '@/api/appt/reconcileResult/types';
import type { PageResult } from '@/api/types';
import type { AxiosPromise } from '@/utils/api-types';
import request from '@/utils/request';

/**
 * 查询对账结果列表
 * @param query
 * @returns {*}
 */
export const listReconcileResult = (query?: ReconcileResultQuery): AxiosPromise<PageResult<ReconcileResultVO>> => {
  return request({
    url: '/appt/admin/reconcileResult/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询对账结果详细
 * @param id
 */
export const getReconcileResult = (id: string | number): AxiosPromise<ReconcileResultVO> => {
  return request({
    url: '/appt/admin/reconcileResult/' + id,
    method: 'get'
  });
};

/**
 * 新增对账结果
 * @param data
 */
export const addReconcileResult = (data: ReconcileResultForm) => {
  return request({
    url: '/appt/admin/reconcileResult',
    method: 'post',
    data: data
  });
};

/**
 * 修改对账结果
 * @param data
 */
export const updateReconcileResult = (data: ReconcileResultForm) => {
  return request({
    url: '/appt/admin/reconcileResult',
    method: 'put',
    data: data
  });
};



/**
 * 删除对账结果
 * @param id
 */
export const delReconcileResult = (id: string | number | Array<string | number>) => {
  return request({
    url: '/appt/admin/reconcileResult/' + id,
    method: 'delete'
  });
};

/**
 * 立即对账（七查，同步返回各查摘要）
 */
export const runReconcile = (): AxiosPromise<ReconcileRunVO> => {
  return request({
    url: '/appt/admin/reconcile/run',
    method: 'post'
  });
};
