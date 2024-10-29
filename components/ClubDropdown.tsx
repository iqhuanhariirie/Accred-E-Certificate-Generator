"use client";

import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { deleteFromFirebase } from "@/utils/deleteFromFirebase";
import Link from "next/link";
import { Club } from "@/components/ui/columns";
import { ClubForm } from "@/components/ClubForm";
import { useState } from "react";

export const ClubDropdown = ({ clubData }: { clubData: Club }) => {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const handleEditDialogClose = () => {
    setEditOpen(false);
  };
  const handleDeleteDialogClose = () => {
    setDeleteOpen(false);
  };
  const handleDropdownClose = () => {
    setDropdownOpen(false);
  };
  return (
    <>
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <Dialog open={editOpen} onOpenChange={setEditOpen}>
            <DialogTrigger asChild>
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                  setEditOpen(true);
                }}
              >
                Edit
              </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit {clubData.clubName}</DialogTitle>
                <DialogDescription>
                  Edit the club details you want changed.
                </DialogDescription>
              </DialogHeader>
              <ClubForm
                handleDialogClose={handleEditDialogClose}
                handleDropdownClose={handleDropdownClose}
                currentClubName={clubData.clubName}
                id={clubData.id}
              />
            </DialogContent>
          </Dialog>
          <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
            <DialogTrigger asChild>
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                  setDeleteOpen(true);
                }}
              >
                Delete
              </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>
                  Are you sure you want to delete {clubData.clubName}?
                </DialogTitle>
                <DialogDescription>
                  Once deleted, it could no longer be reverted.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="destructive"
                  onClick={() => {
                    deleteFromFirebase(clubData.id);
                    handleDeleteDialogClose();
                    handleDropdownClose();
                  }}
                >
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
