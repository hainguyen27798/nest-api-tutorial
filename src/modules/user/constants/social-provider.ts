import { values } from 'lodash';

export enum SocialProvider {
  GOOGLE = 'google',
  LINKEDIN = 'linkedin',
}

export const SocialProviderList = values(SocialProvider);
