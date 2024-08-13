import { atom } from "recoil";

export const valueAtom = atom<string>({
  key: "merchantValue",
  default: "",
});

export const canSubmitAtom = atom<boolean>({
  key: "canSubmit",
  default: false,
});
