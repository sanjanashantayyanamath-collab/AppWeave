import { redirect } from 'next/navigation';

export default function PlatformSettingsRedirect() {
  redirect('/settings/entitlements');
}
