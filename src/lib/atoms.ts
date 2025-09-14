import { atom } from "recoil";

export const valueAtom = atom<string>({
  key: "merchantValue",
  default: "",
});
