import { setIsSidebarOpen } from "../../stores";
import { Button } from "../../ui";

export function SidebarHeader() {
  function toggleSidebar() {
    setIsSidebarOpen((o) => !o);
  }

  return (
    <>
      <Button onClick={toggleSidebar}>close</Button>
      <h1>Sidebar</h1>
    </>
  );
}

export default SidebarHeader;
