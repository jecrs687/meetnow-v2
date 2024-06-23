
import { NavBar } from "@common/NavBar";
import styles from './layout.module.scss'
import { LocationService } from "@services/LocationService";
import { AuthService } from "@services/AuthService";
export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

    <div className={styles.layout}>
      <LocationService />
      <AuthService />
      {children}

    </div>
  );
}
