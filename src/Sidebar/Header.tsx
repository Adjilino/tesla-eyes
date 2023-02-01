import { Accessor, Setter } from "solid-js";
import Button from "../ui/Button";

function SidebarHeader(props: {
  isSidebarOpen: Accessor<boolean>;
  setisSidebarOpen: Setter<boolean>;
}) {
  return (
    <>
      <Button onClick={() => props.setisSidebarOpen((o) => !o)}>close</Button>
      <h1>Sidebar</h1>
    </>
  );
}

export default SidebarHeader;
