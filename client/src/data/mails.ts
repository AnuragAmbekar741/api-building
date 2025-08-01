import type { Mail } from '@/types/mail'

export const mails: Array<Mail> = [
  {
    id: '6c84fb90-12c4-11e1-840d-7b25c5ee775a',
    name: 'William Smith',
    email: 'williamsmith@example.com',
    subject: 'Meeting Tomorrow',
    text: "Hi, let's have a meeting tomorrow to discuss the project. I've been reviewing the project details and have some ideas I'd like to share. It's going to be an exciting year for our company.",
    date: '2023-10-22T09:00:00',
    read: true,
    labels: ['meeting', 'work', 'important'],
  },
  {
    id: '110e8400-e29b-11d4-a716-446655440000',
    name: 'Alice Smith',
    email: 'alicesmith@example.com',
    subject: 'Re: Project Update',
    text: "Thank you for the project update. It looks great! I've gone through the report, and the progress is impressive. The team has done a fantastic job, and I look forward to the next phase.",
    date: '2023-10-22T10:30:00',
    read: false,
    labels: ['work', 'important'],
  },
  {
    id: '3e7c3f6d-bdf5-46ae-8d90-171300f27ae2',
    name: 'Bob Johnson',
    email: 'bobjohnson@example.com',
    subject: 'Weekend Plans',
    text: "Any plans for the weekend? I was thinking of going hiking in the nearby mountains. It's been a while since we had some outdoor fun.",
    date: '2023-10-21T16:45:00',
    read: true,
    labels: ['personal'],
  },
  // Add more mails...
]
