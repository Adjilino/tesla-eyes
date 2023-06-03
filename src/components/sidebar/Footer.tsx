import { Show } from "solid-js";
import { MultipleOccurenceBuilder } from "../../builders";
import {
  isLoadingOccurrences,
  setIsLoadingOccurrences,
  setOccurences,
} from "../../stores";
import { Button } from "../../ui";

const LoadingOccurrences: boolean[] = [];

function createFolderInput() {
  const input = document.createElement("input");

  input.type = "file";
  input.multiple = true;
  input.webkitdirectory = true;

  input.addEventListener("change", async (event) => {
    LoadingOccurrences.push(true);
    setIsLoadingOccurrences(true);

    const files = (event.target as HTMLInputElement).files;

    if (!files) return;

    const multipleOccurrences = await new MultipleOccurenceBuilder()
      .addFileList(files)
      .build();

    if (multipleOccurrences) {
      setOccurences((occurences) => [...occurences, ...multipleOccurrences]);
    }

    LoadingOccurrences.pop();

    if (LoadingOccurrences.length === 0) {
      setIsLoadingOccurrences(false);
    }
  });

  return input;
}

export function SidebarFooter() {
  const addFolderInput = createFolderInput();

  function addFolder() {
    addFolderInput.click();
  }

  return (
    <div class="flex w-full align-middle justify-between truncate">
      <div>
        <Button onClick={() => addFolder()}>
          <Show when={isLoadingOccurrences()}>
            <div class="inline mr-2">
              <i class="fa-solid fa-video fa-beat-fade" />
            </div>
          </Show>
          <span class="truncate">Add folder</span>
        </Button>
      </div>

      <div class="flex items-center justify-items-center">
        <a
          class="px-2 font-semibold hover:cursor-pointer hover:underline"
          href="https://ko-fi.com/adjilino"
          target="_blank"
        >
          <i class="mr-2 fa-solid fa-fw fa-mug-hot" />
          <span class="truncate">Donate</span>
        </a>
      </div>
    </div>
  );
}

export default SidebarFooter;
