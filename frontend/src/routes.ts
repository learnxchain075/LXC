import { RouteObject } from 'react-router-dom';
import NotificationTemplates from './pages/superadmin/NotificationTemplates';
import SuperLogs from './pages/superadmin/NotificationLogs';
import NotificationChannels from './pages/admin/NotificationChannels';
import SendNotification from './pages/admin/SendNotification';
import TriggerNotification from './pages/admin/TriggerNotification';
import AdminLogs from './pages/admin/NotificationLogs';

export const routes: RouteObject[] = [
  { path: '/superadmin/notifications/templates', element: <NotificationTemplates /> },
  { path: '/superadmin/notifications/logs', element: <SuperLogs /> },
  { path: '/admin/notifications/channels', element: <NotificationChannels /> },
  { path: '/admin/notifications/send', element: <SendNotification /> },
  { path: '/admin/notifications/trigger', element: <TriggerNotification /> },
  { path: '/admin/notifications/logs', element: <AdminLogs /> },
];
