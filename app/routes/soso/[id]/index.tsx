import { useParams } from "react-router";

export default function index() {
  const { id, soso } = useParams();
  return <div>{(soso, id)}</div>;
}
