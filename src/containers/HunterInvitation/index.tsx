import GuestInvitation from './GuestInvitation';
import HunterTypeSelection from './HunterTypeSelect';
import ImagePreview from './ImagePreview';
import UserInvitation from './UserInvitation';

export enum HunterType {
  user = 'user',
  guest = 'guest',
}
const HunterInvitation = {
  User: UserInvitation,
  Guest: GuestInvitation,
  SelectionModal: HunterTypeSelection,
  ImagePreview: ImagePreview,
};

export default HunterInvitation;
