import Button from "../ui/Button";

function createFolderInput() {
  const input = document.createElement("input");

  input.type = "file";
  input.multiple = true;
  input.webkitdirectory = true;

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
