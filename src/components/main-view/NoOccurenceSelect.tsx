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
      <p class="text-xl text-gray-600 dark:text-gray-400">
        5. Select occurence from the sidebar and enjoy!
      </p>
    </div>
  );
};

export default NoOccurenceSelect;
