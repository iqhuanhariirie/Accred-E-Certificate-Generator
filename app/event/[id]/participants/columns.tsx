"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Guest } from "@/utils/uploadToFirestore";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Eye } from "lucide-react";

interface ColumnProps {
  eventId: string;
}

export const createColumns = (eventId: string): ColumnDef<Guest>[] => [
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
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const participant = row.original;
      return (
        <Link 
          href={`/event/${eventId}/certificate/${participant.certId}`} 
          target="_blank"
        >
          <Button variant="ghost" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            Verify Certificate
          </Button>
        </Link>
      );
    },
  },
];
