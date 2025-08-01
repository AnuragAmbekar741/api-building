export interface Mail {
  id: string
  name: string
  email: string
  subject: string
  text: string
  date: string
  read: boolean
  labels: Array<string>
}

export interface MailAccount {
  label: string
  email: string
  icon: React.ComponentType<{ className?: string }>
}
