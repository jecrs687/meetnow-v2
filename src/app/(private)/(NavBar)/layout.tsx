
import { NavBar } from "@common/NavBar";
import styles from './layout.module.scss'
export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

    <div className={styles.layout}>
      <main className={styles.main}>
        {children}
      </main>
      <NavBar />
    </div>
  );
}
