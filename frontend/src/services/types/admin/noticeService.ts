export interface NoticeRecipient {
  userType: string;
}

export interface NoticeCreator {
  id: string;
  name: string;
}

export interface Notice {
  id: string;
  title: string;
  message: string;
  noticeDate: string;
  publishDate: string;
  attachment: string | null;
  createdById: string;
  schoolId: string;
  recipients: NoticeRecipient[];
  creator: NoticeCreator;
  createdAt: string;
  updatedAt: string;
}

// API Response Types
export interface CreateNoticeResponse {
  success: boolean;
  message: string;
  data: Notice;
}

export interface GetNoticesResponse {
  success: boolean;
  message: string;
  data: Notice[];
}

export interface GetNoticeResponse {
  success: boolean;
  message: string;
  data: Notice;
}

export interface DeleteNoticeResponse {
  success: boolean;
  message: string;
}

export interface DeleteMultipleNoticesResponse {
  success: boolean;
  message: string;
}
