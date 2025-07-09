export const AdminMenu = [
  {
    label: 'Notification',
    children: [
      { label: 'Channels', path: '/admin/notifications/channels' },
      { label: 'Send Message', path: '/admin/notifications/send' },
      { label: 'Logs', path: '/admin/notifications/logs' },
      { label: 'Trigger (Test)', path: '/admin/notifications/trigger' },
    ],
  },
];

export const SuperAdminMenu = [
  {
    label: 'Notification System',
    children: [
      { label: 'Templates', path: '/superadmin/notifications/templates' },
      { label: 'Logs', path: '/superadmin/notifications/logs' },
    ],
  },
];
