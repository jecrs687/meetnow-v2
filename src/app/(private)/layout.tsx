
import { NavBar } from "@common/NavBar";
import styles from './layout.module.scss'
import { LocationService } from "@services/LocationService";
export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

    <div className={styles.layout}>
      <LocationService />
      {children}

    </div>
  );
}
