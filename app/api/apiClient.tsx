import type { TypedPocketBase } from "pocketbase-types";
import { PocketBaseTS } from "pocketbase-ts";
import { AsyncAuthStore } from "pocketbase";
import Cookies from "js-cookie";

const url = import.meta.env.VITE_API_URL;
let pb = new PocketBaseTS(url) as Partial<TypedPocketBase>;

export { pb };
