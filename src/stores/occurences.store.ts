import { createSignal } from "solid-js";
import { Occurence } from "../models";

export const [occurences, setOccurences] = createSignal<Occurence[]>([]);

export const [occurence, setOccurence] = createSignal<Occurence | null>(null);
