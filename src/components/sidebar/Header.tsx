import { setIsSidebarOpen } from "../../stores";
import { Button } from "../../ui";

export function SidebarHeader() {
  function toggleSidebar() {
    setIsSidebarOpen((o) => !o);
  }

  return (
    <div class="flex w-full truncate">
      <div class="flex grow items-center">
        <Button onClick={toggleSidebar} class='dark:bg-white'>
          <i class="mx-2 fa-solid fa-fw fa-bars" />
        </Button>
        <h1 class="truncate ml-2">Tesla eyes</h1>
      </div>

      <div class="flex items-center justify-items-center">
        <a
          class="px-2 font-semibold hover:cursor-pointer hover:underline"
          href="https://github.com/Adjilino/tesla-eyes-app/issues"
          target="_blank"
        >
          <i class="mr-2 fa-solid fa-fw fa-bug" />
          <span class="truncate">Report</span>
        </a>
      </div>
    </div>
  );
}

export default SidebarHeader;
