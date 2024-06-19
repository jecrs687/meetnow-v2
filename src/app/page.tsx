import Image from "next/image";
import styles from "./page.module.scss";
import { redirect } from "next/navigation";

export default function Home() {
  redirect("/maps");
}
