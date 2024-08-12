"use client";

import {
  AvatarFallbackProps,
  AvatarImageProps,
  AvatarProps,
  Fallback,
  Image as ImageOP,
  Root,
} from "@radix-ui/react-avatar";
import {
  ComponentPropsWithoutRef,
  ElementRef,
  ForwardedRef,
  forwardRef,
  RefAttributes,
} from "react";
import { cn } from "@/lib/utils";

const Avatar = forwardRef<
  ElementRef<typeof Root>,
  ComponentPropsWithoutRef<typeof Root>
>(
  (
    {
      className,
      ...props
    }: Omit<AvatarProps & RefAttributes<HTMLSpanElement>, "ref">,
    ref: ForwardedRef<HTMLSpanElement>,
  ): JSX.Element => (
    <Root
      ref={ref}
      className={cn(
        "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
        className,
      )}
      {...props}
    />
  ),
);
Avatar.displayName = Root.displayName;

const AvatarImage = forwardRef<
  ElementRef<typeof ImageOP>,
  ComponentPropsWithoutRef<typeof ImageOP>
>(
  (
    {
      className,
      ...props
    }: Omit<AvatarImageProps & RefAttributes<HTMLImageElement>, "ref">,
    ref: ForwardedRef<HTMLImageElement>,
  ): JSX.Element => (
    <ImageOP
      ref={ref}
      className={cn("aspect-square h-full w-full", className)}
      {...props}
    />
  ),
);
AvatarImage.displayName = ImageOP.displayName;

const AvatarFallback = forwardRef<
  ElementRef<typeof Fallback>,
  ComponentPropsWithoutRef<typeof Fallback>
>(
  (
    {
      className,
      ...props
    }: Omit<AvatarFallbackProps & RefAttributes<HTMLSpanElement>, "ref">,
    ref: ForwardedRef<HTMLSpanElement>,
  ): JSX.Element => (
    <Fallback
      ref={ref}
      className={cn(
        "flex h-full w-full items-center justify-center rounded-full bg-muted",
        className,
      )}
      {...props}
    />
  ),
);
AvatarFallback.displayName = Fallback.displayName;

export { Avatar, AvatarImage, AvatarFallback };
