import mascot from 'assets/brand/mascot-blue.svg';
import { useLocation } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import Announcement from 'shared/ui/Announcement';
import { ROUTES } from 'shared/configs/routes';
import { useUserStore } from 'shared/stores/StoreContext';
import { DESIGN_UPDATE_ANNOUNCEMENT } from '../config/designUpdate';
import { usePersistentAnnouncement } from '../model/usePersistentAnnouncement';

const DesignUpdateAnnouncement = observer(() => {
  const userStore = useUserStore();
  const { pathname } = useLocation();
  const isAuthPage =
    pathname === ROUTES.AUTH || pathname === ROUTES.REGISTER || pathname === ROUTES.BUTTON_LAB;
  const { visible, close } = usePersistentAnnouncement(
    DESIGN_UPDATE_ANNOUNCEMENT,
    userStore.isInitialized && !isAuthPage,
  );

  return (
    <Announcement
      open={visible}
      message={DESIGN_UPDATE_ANNOUNCEMENT.message}
      title={DESIGN_UPDATE_ANNOUNCEMENT.title}
      badge={DESIGN_UPDATE_ANNOUNCEMENT.badge}
      icon={<img src={mascot} alt="" width={26} height={26} />}
      onClose={close}
      reserveSidebarSpace={userStore.isAuth}
    />
  );
});

export default DesignUpdateAnnouncement;
