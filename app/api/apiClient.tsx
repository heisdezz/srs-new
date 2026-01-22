import type { TypedPocketBase } from "pocketbase-types";
import { PocketBaseTS } from "pocketbase-ts";
const url = import.meta.env.VITE_API_URL;
export let pb = new PocketBaseTS(url) as Partial<TypedPocketBase>;
