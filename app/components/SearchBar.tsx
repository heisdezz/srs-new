import { useNavigate, useSearchParams } from "react-router";
import { Search } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function SearchBar() {
  const [searchParams] = useSearchParams();
  const currentSearch = searchParams.get("search") ?? "";
  const { register, handleSubmit } = useForm({
    defaultValues: {
      search: currentSearch,
    },
  });
  const navigate = useNavigate();
  const onSubmit = (data) => {
    if (data.search === "") {
      navigate("/app/products");
      return;
    }
    if ((data["search"] as string).length < 3) {
      return toast.error("Search query must be at least 3 characters long");
    }
    const searchTerm = data["search"] as string;
    navigate(`/app/products?search=${encodeURIComponent(searchTerm)}`);
  };
  return (
    <form className="flex-1 join" onSubmit={handleSubmit(onSubmit)}>
      <input
        type="text"
        {...register("search")}
        placeholder="Search..."
        title="Search"
        className="input w-full join-item"
      />
      <button className="btn btn-primary btn-square join-item">
        <Search className="size-4" />
      </button>
    </form>
  );
}
