import { MultipleOccurenceBuilder } from "../builders";
import Button from "../ui/Button";

function createFolderInput() {
  const input = document.createElement("input");

  input.type = "file";
  input.multiple = true;
  input.webkitdirectory = true;

  input.addEventListener("change", (event) => {
    const files = (event.target as HTMLInputElement).files;

    if (!files) return;

    console.log('selected files', files);

    new MultipleOccurenceBuilder().addFileList(files).build();

    // 1. Use file.webkitRelativePath to separate files into folders

    // 2. Order files by date
    // 3. Use file.name to get date and camera name
    // 4. If file.type is video, convert into HTML video player and add to videos
    // 5. If file.type is image, convert into HTML image and add to images
    // 6. If file.type is json, convert into details
  });

  return input;
}

function SidebarFooter() {
  const addFolderInput = createFolderInput();

  function addFolder() {
    addFolderInput.click();
  }

  return (
    <>
      <Button onClick={addFolder}>Add folder</Button>
    </>
  );
}

export default SidebarFooter;
