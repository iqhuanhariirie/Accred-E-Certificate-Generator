"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Guest } from "@/utils/uploadToFirestore";
import { Badge } from "@/components/ui/badge";

export const columns: ColumnDef<Guest>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "studentID",
    header: "Student ID",
  },
  {
    accessorKey: "course",
    header: "Course",
  },
  {
    accessorKey: "part",
    header: "Part",
  },
  {
    accessorKey: "group",
    header: "Group",
  },
  {
    accessorKey: "signature",
    header: "Certificate Status",
    cell: ({ row }) => {
      const hasSignature = row.original.signature;
      return (
        <Badge variant={hasSignature ? "success" : "destructive"}>
          {hasSignature ? "Signed" : "Not Signed"}
        </Badge>
      );
    },
  },
];
