export function Camera(props: CameraProps) {
  return (
    <a
      id={props.id}
      class={[
        "m-auto",
        props.isActive
          ? "flex max-w-full max-h-full"
          : `${props.class} absolute z-10 w-32 h-24 rounded-lg overflow-hidden shadow cursor-pointer`,
      ].join(" ")}
      onClick={() => props.onClick()}
    />
  );
}

interface CameraProps {
  id: string;
  isActive: boolean;
  onClick: () => void;
  class: string;
}
