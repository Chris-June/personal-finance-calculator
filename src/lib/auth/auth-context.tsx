import { atom } from "jotai";
import { AuthState, getInitialState } from "./types";

export const authAtom = atom<AuthState>(getInitialState());
