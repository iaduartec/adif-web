import type { ComponentPropsWithoutRef } from "react";

type ButtonProps = ComponentPropsWithoutRef<"button">;

export function Button({ className, type, ...props }: ButtonProps) {
  const buttonClassName = ["ui-button", className].filter(Boolean).join(" ");

  return <button className={buttonClassName} type={type ?? "button"} {...props} />;
}
