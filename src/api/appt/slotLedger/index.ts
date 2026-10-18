import type { SlotLedgerForm, SlotLedgerQuery, SlotLedgerVO } from '@/api/appt/slotLedger/types';
import type { PageResult } from '@/api/types';
import type { AxiosPromise } from '@/utils/api-types';
import request from '@/utils/request';

/**
 * 查询号源台账列表
 * @param query
 * @returns {*}
 */
export const listSlotLedger = (query?: SlotLedgerQuery): AxiosPromise<PageResult<SlotLedgerVO>> => {
  return request({
    url: '/appt/slotLedger/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询号源台账详细
 * @param id
 */
export const getSlotLedger = (id: string | number): AxiosPromise<SlotLedgerVO> => {
  return request({
    url: '/appt/slotLedger/' + id,
    method: 'get'
  });
};

/**
 * 新增号源台账
 * @param data
 */
export const addSlotLedger = (data: SlotLedgerForm) => {
  return request({
    url: '/appt/slotLedger',
    method: 'post',
    data: data
  });
};

/**
 * 修改号源台账
 * @param data
 */
export const updateSlotLedger = (data: SlotLedgerForm) => {
  return request({
    url: '/appt/slotLedger',
    method: 'put',
    data: data
  });
};



/**
 * 删除号源台账
 * @param id
 */
export const delSlotLedger = (id: string | number | Array<string | number>) => {
  return request({
    url: '/appt/slotLedger/' + id,
    method: 'delete'
  });
};
