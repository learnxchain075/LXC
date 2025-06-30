import { useState, useEffect, useCallback } from "react";
import {
  getTeachersBySchool,
  getTeacherFaceRecords,
  registerTeacherFace,
  deleteTeacherFace,
  TeacherOption,
  FaceRecord,
} from "../services/admin/teacherFaceApi";

export const useTeacherFaceData = (schoolId: string | null) => {
  const [teachers, setTeachers] = useState<TeacherOption[]>([]);
  const [records, setRecords] = useState<FaceRecord[]>([]);

  const loadTeachers = useCallback(async () => {
    if (!schoolId) return;
    const res = await getTeachersBySchool(schoolId);
    const list = res.data.map((t: any) => ({
      id: t.id,
      name: t.user?.name || "Unnamed",
    }));
    setTeachers(list);
  }, [schoolId]);

  const loadRecords = useCallback(async () => {
    if (!schoolId) return;
    const res = await getTeacherFaceRecords(schoolId);
    setRecords(res.data.data || []);
  }, [schoolId]);

  useEffect(() => {
    loadTeachers();
    loadRecords();
  }, [loadTeachers, loadRecords]);

  const registerFace = async (teacherId: string, image: Blob) => {
    await registerTeacherFace(teacherId, image);
    await loadRecords();
  };

  const removeFaceData = async (tid: string) => {
    await deleteTeacherFace(tid);
    setRecords((prev) => prev.filter((r) => r.teacherId !== tid));
  };

  return { teachers, records, registerFace, removeFaceData, loadRecords };
};
