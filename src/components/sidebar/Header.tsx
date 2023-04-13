import { setIsSidebarOpen } from "../../stores";
import { Button } from "../../ui";

export function SidebarHeader() {
  function toggleSidebar() {
    setIsSidebarOpen((o) => !o);
  }

  return (
    <>
      <Button onClick={toggleSidebar}>
        <i class="mx-2 fa-solid fa-fw fa-bars"/>
      </Button>
      <h1 class="truncate">Tesla eyes</h1>
    </>
  );
}

export default SidebarHeader;
