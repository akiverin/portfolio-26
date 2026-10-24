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
  const isAuthPage = pathname === ROUTES.AUTH || pathname === ROUTES.REGISTER;
  const { visible, close } = usePersistentAnnouncement(
    DESIGN_UPDATE_ANNOUNCEMENT,
    userStore.isInitialized && !isAuthPage,
  );

  return (
    <Announcement
      open={visible}
      message={DESIGN_UPDATE_ANNOUNCEMENT.message}
      onClose={close}
      reserveSidebarSpace={userStore.isAuth}
    />
  );
});

export default DesignUpdateAnnouncement;
