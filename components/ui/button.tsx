import type { ComponentPropsWithRef } from "react";

type ButtonProps = ComponentPropsWithRef<"button">;

export function Button({ className, ref, type, ...props }: ButtonProps) {
  const buttonClassName = ["ui-button", className].filter(Boolean).join(" ");

  return <button className={buttonClassName} ref={ref} type={type ?? "button"} {...props} />;
}
