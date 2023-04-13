import { MultipleOccurenceBuilder } from "../../builders";
import { setOccurences } from "../../stores";
import { Button } from "../../ui";

function createFolderInput() {
  const input = document.createElement("input");

  input.type = "file";
  input.multiple = true;
  input.webkitdirectory = true;

  input.addEventListener("change", async (event) => {
    const files = (event.target as HTMLInputElement).files;

    if (!files) return;

    const multipleOccurences = await new MultipleOccurenceBuilder()
      .addFileList(files)
      .build();

    if (multipleOccurences) {
      setOccurences((occurences) => [...occurences, ...multipleOccurences]);
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
    <Button onClick={() => addFolder()}>
      <span class="truncate">Add folder</span>
    </Button>
  );
}

export default SidebarFooter;
