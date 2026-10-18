import { listCampus } from '@/api/appt/campus';
import { listDept } from '@/api/appt/dept';
import { listStaff } from '@/api/appt/staff';

/**
 * 加载院区 / 科室 / 医务人员下拉选项。
 * 注意：雪花 id 由后端序列化为字符串，选项 value 直接使用 item.id，勿转 number。
 */
export const useApptOptions = () => {
  const campusOptions = ref<any[]>([]);
  const deptOptions = ref<any[]>([]);
  const staffOptions = ref<any[]>([]);

  const loadApptOptions = async () => {
    const [campusRes, deptRes, staffRes] = await Promise.all([
      listCampus({ pageNum: 1, pageSize: 200 }),
      listDept({ pageNum: 1, pageSize: 500 }),
      listStaff({ pageNum: 1, pageSize: 500 })
    ]);
    campusOptions.value = campusRes.data?.rows ?? [];
    deptOptions.value = deptRes.data?.rows ?? [];
    staffOptions.value = staffRes.data?.rows ?? [];
  };

  return { campusOptions, deptOptions, staffOptions, loadApptOptions };
};
