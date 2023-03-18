import { setIsSidebarOpen } from "../../stores";
import Button from "../../ui/Button";

export function Navbar() {
  const toggleSidebar = () => {
    setIsSidebarOpen((o) => !o);
  };

  return (
    <div class="h-16 p-2 flex w-full items-center gap-2">
      <Button onClick={toggleSidebar}>Open</Button>
      <div class="flex-grow flex">
        <div>Text</div>
      </div>
    </div>
  );
}

export default Navbar;
