import type { PropsWithChildren } from "react";

interface CompContainerProps {
  title?: string;
}

export default function CompContainer(
  props: PropsWithChildren<CompContainerProps>,
) {
  return (
    <div className="flex-1">
      <h2 className="p-4 border-b fade">{props["title"] ?? "Title"}</h2>
      <div className="p-4">{props.children}</div>
    </div>
  );
}
