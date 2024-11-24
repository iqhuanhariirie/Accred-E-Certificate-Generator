"use client";

import { DataTableParticipant } from "@/components/DataTableParticipant";
import { createColumns } from "./columns";
import { useEffect, useState } from "react";
import { db } from "@/firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { Guest } from "@/utils/uploadToFirestore";
import { RingLoader } from "@/components/RingLoader";

export default function ParticipantsPage({ params }: { params: { id: string } }) {
  const [participants, setParticipants] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [eventName, setEventName] = useState("");

  // Create columns with eventId
  const columns = createColumns(params.id);

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const docRef = doc(db, "events", params.id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setParticipants(docSnap.data().guestList || []);
          setEventName(docSnap.data().eventName || "");
        }
      } catch (error) {
        console.error("Error fetching participants:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchParticipants();
  }, [params.id]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <RingLoader />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5 text-center">
        Participants for {eventName}
      </h1>
      <DataTableParticipant 
        columns={columns} 
        data={participants} 
        loading={loading}
      />
    </div>
  );
}
