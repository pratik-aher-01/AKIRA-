import { redirect } from 'next/navigation'

export default function RootPage() {
  // This safely pushes the user to the dashboard folder
  redirect('/dashboard')
}