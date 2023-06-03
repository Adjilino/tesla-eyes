import { Component } from "solid-js";

const NoOccurenceSelect: Component = () => {
  return (
    <div class="flex flex-col">
      <p class="text-2xl mb-2 text-gray-600 dark:text-gray-400">
        Nothing selected
      </p>
      <p class="text-xl text-gray-600 dark:text-gray-400">
        1. Open sidebar
        <i class="mx-2 fa-solid fa-fw fa-xs fa-bars" />
      </p>
      <p class="text-xl text-gray-600 dark:text-gray-400">
        2. Click 'Add folder'
      </p>
      <p class="text-xl text-gray-600 dark:text-gray-400">
        3. Select folder occurrence from your Telsa
      </p>
      <p class="text-xl text-gray-600 dark:text-gray-400">
        4. The occurence will be added to the sidebar
      </p>
      <p class="text-xl text-gray-600 dark:text-gray-400 mb-2">
        5. Select occurence from the sidebar and enjoy!
      </p>
      <hr />
      <p class="text-xl text-gray-600 dark:text-gray-400 mt-2">
        You can try it with the example folder. 
        <a class="underline underline-offset-2" href="https://mega.nz/folder/4MARkZKY#7gc5e3ZqoAKrnL4E56oS0Q">
          Click here to download it.
        </a>
      </p>
    </div>
  );
};

export default NoOccurenceSelect;
