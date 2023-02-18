import { Setter } from "solid-js";
import Button from "../../ui/Button";

export function Navbar(props: { setIsSidebarOpen: Setter<boolean> }) {
  const toggleSidebar = () => {
    props.setIsSidebarOpen((o) => !o);
  };

  return (
    <div class="h-16 p-2 flex w-full items-center gap-2">
      <Button onClick={toggleSidebar}>Open</Button>
      <div class="flex-grow flex">
        <div>
            Text
        </div>
      </div>
    </div>
  );
}

export default Navbar;
