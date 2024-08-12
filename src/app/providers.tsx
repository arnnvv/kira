"use client";

import type { ReactNode } from "react";
import { RecoilRoot } from "recoil";

export const Providers = ({
  children,
}: {
  children: ReactNode;
}): JSX.Element => <RecoilRoot>{children}</RecoilRoot>;
