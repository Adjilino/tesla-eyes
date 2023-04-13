import { JSXElement } from "solid-js";

interface ButtonProps {
  children: JSXElement;
  onClick?: () => void;
  class?: string;
}

export function Button(props: ButtonProps) {
  const onClick = () => {
    props.onClick && props.onClick();
  };

  return (
    <button
      class={
        "p-2 rounded-md " +
        "bg-slate-200 " +
        "dark:bg-slate-700 " +
        "hover:bg-slate-300 " +
        "dark:hover:bg-slate-600 " +
        "focus:outline-none focus:bg-slate-400 active:bg-slate-400 " +
        "dark:focus:bg-slate-500 dark:active:bg-slate-500 "
      }
      onClick={onClick}
    >
      {props.children}
    </button>
  );
}

export default Button;
