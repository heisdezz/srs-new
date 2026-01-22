import { useSearchParams } from "react-router";
import { Search } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function GeneralSearchBar() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentSearch = searchParams.get("search") ?? "";
  const { register, handleSubmit } = useForm({
    defaultValues: {
      search: currentSearch,
    },
  });

  const onSubmit = (data: { search: string }) => {
    if (data.search === "") {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("search");
      setSearchParams(newParams);
      return;
    }
    if (data.search.length < 3) {
      return toast.error("Search query must be at least 3 characters long");
    }

    const newParams = new URLSearchParams(searchParams);
    newParams.set("search", data.search);
    setSearchParams(newParams);
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
