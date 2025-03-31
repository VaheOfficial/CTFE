import { redirect } from 'next/navigation';

export default function Home() {
  // For internal tools, we'll redirect directly to the dashboard
  redirect('/login');
}
