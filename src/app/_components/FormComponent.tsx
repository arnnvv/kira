"use client";

import { type ReactNode, useEffect } from "react";
import { toast } from "sonner";
import { useFormState } from "react-dom";

export interface ActionResult {
  error?: string | null;
  message?: string | null;
}

export const FormComponent = ({
  children,
  action,
}: {
  children: ReactNode;
  action: (_: any, formdata: FormData) => Promise<ActionResult>;
}): JSX.Element => {
  const [state, formAction] = useFormState(action, {
    error: null,
    message: null,
  });

  useEffect((): void => {
    if (state.error)
      toast.error(state.error, {
        id: "1",
        action: {
          label: "Close",
          onClick: (): string | number => toast.dismiss("1"),
        },
      });

    if (state.message)
      toast.success(state.message, {
        id: "2",
        action: {
          label: "Close",
          onClick: (): string | number => toast.dismiss("2"),
        },
      });
  }, [state.error, state.message]);

  return <form action={formAction}>{children}</form>;
};
