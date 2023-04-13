import { setIsSidebarOpen } from "../../stores";
import Button from "../../ui/Button";

export function Navbar() {
  const toggleSidebar = () => {
    setIsSidebarOpen((o) => !o);
  };

  return (
    <div class="h-16 p-2 flex w-full items-center gap-2">
      <Button onClick={toggleSidebar}>
        <i class="mx-2 fa-solid fa-fw fa-bars"/>
      </Button>
      <div class="flex-grow flex">
        <div>Tesla eyes</div>
      </div>
    </div>
  );
}

export default Navbar;
