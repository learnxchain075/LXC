const menuData = [
  {
    col: 'col-6',
    parentClass: 'one',
    items: [
      {
        title: 'Platform Modules 🔥',
        items: [
          {
            label: 'School Operations',
            subItems: [
              { label: 'Student Management', href: '#' },
              { label: 'Attendance & Timetable', href: '#' },
              { label: 'Exam & Result Automation', href: '#' },
              { label: 'Fee Collection & Reports', href: '#' },
            ]
          },
          {
            label: 'Teacher Tools',
            subItems: [
              { label: 'Lesson Planning', href: '#' },
              { label: 'Homework & Assignments', href: '#' },
              { label: 'Live Class & Whiteboard', href: '#' },
            ]
          },
          {
            label: 'Decentralized Features',
            subItems: [
              { label: 'Blockchain Certificate Vault', href: '#' },
              { label: 'Student Record Chain', href: '#' },
              { label: 'Smart Audit Logs', href: '#' },
            ]
          }
        ]
      }
    ]
  },
  {
    col: 'col-6',
    parentClass: 'two',
    items: [
      {
        title: 'Resources 📚',
        items: [
          { label: 'LXC Blog', href: '/blog' },
          {
            label: 'Support & Helpdesk',
            subItems: [
              { label: 'Knowledgebase', href: '#' },
              { label: 'FAQs', href: '#' },
              { label: 'Partner Onboarding', href: '#' },
              { label: 'Case Studies', href: '#' },
            ]
          }
        ]
      },
      {
        title: 'Developer Center 👨‍💻',
        items: [
          {
            label: null,
            subItems: [
              { label: 'API Documentation', href: '#' },
              { label: 'Integration Tutorials', href: '#' }
            ]
          },
          { label: 'Changelog', href: '#' },
          { label: 'Community Forum', href: '#' }
        ]
      }
    ]
  },
  {
    col: 'col-12',
    parentClass: 'three',
    items: [
      {
        title: 'Company 💎',
        items: [
          {
            label: null,
            subItems: [
              { label: 'About LearnXChain', href: '/about-us' },
              { label: 'Our Vision', href: '/our-vision' },
              { label: 'Contact & Support', href: '/contact-us' },
              { label: 'Privacy Policy', href: '/privacy-policy' },
              { label: 'Cancellation & Refund Policy', href: '/refund-policy' },
              { label: 'Terms and conditions', href: '/terms' },
              { label: 'Careers', href: '/careers', badge: 'Hiring' }
              
            ]
          }
        ]
      },
      {
        title: 'Why LXC? 🌟',
        items: [
          { label: 'Trusted by Educators', href: '#' },
          { label: 'Privacy-First Design', href: '#' },
          { label: '99.9% Uptime Guarantee', href: '#' }
        ]
      }
    ]
  }
];

export default menuData;
