import { DataTable } from "@/components/DataTableClub";
import { clubColumns, columns } from "@/components/ui/columns";

const Page = () => {
  return (
    <>
      <div className="h-full px-28 py-2">
        <DataTable columns={clubColumns} />
      </div>
    </>
  );
};

export default Page;