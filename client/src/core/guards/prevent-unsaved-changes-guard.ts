import { CanDeactivateFn } from '@angular/router';
import { MemberProfile } from '../../features/member-profile/member-profile';

export const preventUnsavedChangesGuard: CanDeactivateFn<MemberProfile> = (component) => {
  return component.editForm?.dirty ? confirm("Are you sure you want to continue? Any unsaved changes will be lost") : true;
};
