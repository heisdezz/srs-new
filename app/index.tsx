import { useLoaderData } from "react-router";

export async function loader() {
  let resp = new Promise((res) => setTimeout(() => res("sos"), 1000));
  return await resp;
}

export default function index() {
  let resp = useLoaderData();
  console.log(resp);
  return <div>page</div>;
}
