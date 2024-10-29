"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  editDocumentInFirestore,
  sendDocumentToFirestore,
} from "@/utils/uploadToFirestore";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ButtonRingLoader } from "./RingLoader";
import { createClub, editClub } from "@/utils/createClub";

const addingFormSchema = z.object({
    clubName: z
      .string({
        required_error: "A club name is required.",
      })
      .min(2, { message: "Club name must must be 2 or more characters long." })
      .max(50, {
        message: "Club name must must be 50 or less characters long.",
      }),
  });

  const editingFormSchema = z.object({
    clubName: z
      .string({
        required_error: "An event name is required.",
      })
      .min(2, { message: "Event name must must be 2 or more characters long." })
      .max(50, {
        message: "Event name must must be 50 or less characters long.",
      }),
    
  });

  export type FormType = z.infer<typeof addingFormSchema>;
export type OptionalFormType = z.infer<typeof editingFormSchema>;

type ClubFormProps = {
    handleDialogClose: () => void;
    handleDropdownClose?: () => void;
    currentClubName?: string;
    createdAt?: Date;
    id?: string;
  };

export const ClubForm = ({
    handleDialogClose,
    handleDropdownClose,
    currentClubName,
    id,
  }: ClubFormProps) => {
    // Define your form.
    const currentResolver = id ? editingFormSchema : addingFormSchema;
    const form = useForm<FormType>({
      resolver: zodResolver(currentResolver),
      mode: "onChange",
      defaultValues: {
          clubName: currentClubName || "",
        },
      });

      const { formState } = form; // Destructure from form the form state which tells us if form is valid or not.

     // Define a submit handler.
const onSubmit = async (club: FormType) => {
    try {
        if (id) {
            // Edit mode: Provide both id and club data to edit the club
            await editClub(id, club);
        } else {
            // Create mode: Only provide club data
            await createClub(club);
        }
        handleDialogClose();
        if (handleDropdownClose) {
            handleDropdownClose();
        }
    } catch (error) {
        console.error("Error submitting form:", error);
    }
};

return (
  <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FormField
        control={form.control}
        name="clubName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Club Name</FormLabel>
            <FormControl>
              <Input placeholder="Enter club name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <Button type="submit" disabled={!form.formState.isValid}>
        {id ? "Update Club" : "Create Club"}
      </Button>
    </form>
  </Form>
);

  
    };