import type { SlotTemplateForm, SlotTemplateQuery, SlotTemplateVO } from '@/api/appt/slotTemplate/types';
import type { PageResult } from '@/api/types';
import type { AxiosPromise } from '@/utils/api-types';
import request from '@/utils/request';

/**
 * 查询时段模板列表
 * @param query
 * @returns {*}
 */
export const listSlotTemplate = (query?: SlotTemplateQuery): AxiosPromise<PageResult<SlotTemplateVO>> => {
  return request({
    url: '/appt/admin/slotTemplate/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询时段模板详细
 * @param id
 */
export const getSlotTemplate = (id: string | number): AxiosPromise<SlotTemplateVO> => {
  return request({
    url: '/appt/admin/slotTemplate/' + id,
    method: 'get'
  });
};

/**
 * 新增时段模板
 * @param data
 */
export const addSlotTemplate = (data: SlotTemplateForm) => {
  return request({
    url: '/appt/admin/slotTemplate',
    method: 'post',
    data: data
  });
};

/**
 * 修改时段模板
 * @param data
 */
export const updateSlotTemplate = (data: SlotTemplateForm) => {
  return request({
    url: '/appt/admin/slotTemplate',
    method: 'put',
    data: data
  });
};



/**
 * 删除时段模板
 * @param id
 */
export const delSlotTemplate = (id: string | number | Array<string | number>) => {
  return request({
    url: '/appt/admin/slotTemplate/' + id,
    method: 'delete'
  });
};
