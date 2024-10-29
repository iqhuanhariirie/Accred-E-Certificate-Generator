import { FormType, OptionalFormType } from "@/components/ClubForm";
import { db } from "@/firebase/config";
import {
  Timestamp,
  addDoc,
  collection,
  doc,
  updateDoc,
} from "firebase/firestore";

export type Club = {
    clubName: string;
    createdAt: Timestamp;
  };

  export const createClub = async (club: FormType) => {
    try {
      // Reference to the "clubs" collection in Firestore
      const clubsCollectionRef = collection(db, "clubs");
  
      // Add a new document to the collection
      const docRef = await addDoc(clubsCollectionRef, {
        ...club,
        createdAt: Timestamp.now(), // Automatically set creation time
      });
  
      console.log("Club created with ID:", docRef.id);
      return docRef.id;
    } catch (error) {
      console.error("Error creating club:", error);
      throw error;
    }
  };

  // Function to edit an existing club
export const editClub = async (clubId: string, updatedClubData: Partial<Club>) => {
    try {
      // Reference to the specific club document in Firestore
      const clubDocRef = doc(db, "clubs", clubId);
  
      // Update the document with the new data
      await updateDoc(clubDocRef, {
        ...updatedClubData,
        updatedAt: Timestamp.now(), // Optionally track the update timestamp
      });
  
      console.log("Club updated with ID:", clubId);
    } catch (error) {
      console.error("Error updating club:", error);
      throw error;
    }
  };