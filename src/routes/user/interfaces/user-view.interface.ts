import { ExternalNetwork } from 'src/shared/classes/external-network';
import { NotificationSettings } from 'src/shared/classes/notification-settings';
import { PrivacySettings } from 'src/shared/classes/privacy-settings.class';
import { ProfileSettings } from 'src/shared/classes/profile-settings';

export interface UserView {
  name: string;
  email: string;
  profileSettings: ProfileSettings;
  privacySettings: PrivacySettings;
  notificationSettings: NotificationSettings;
  externalNetwork: ExternalNetwork;
}
