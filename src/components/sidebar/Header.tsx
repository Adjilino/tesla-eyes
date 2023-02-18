import { Accessor, Setter } from "solid-js";
import { Button } from "../../ui";

export function SidebarHeader(props: {
  isSidebarOpen: Accessor<boolean>;
  setisSidebarOpen: Setter<boolean>;
}) {
  function toggleSidebar() {
    props.setisSidebarOpen((o) => !o);
  }

  return (
    <>
      <Button onClick={toggleSidebar}>close</Button>
      <h1>Sidebar</h1>
    </>
  );
}

export default SidebarHeader;
