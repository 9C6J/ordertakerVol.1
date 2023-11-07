import NavBar from "./Navbar";
import {Props} from "~/types/common";

export default function Layout(props: Props) {
  return (
    <div className="w-full p-0">
      <NavBar />
      {props.children}
    </div>
  );
}