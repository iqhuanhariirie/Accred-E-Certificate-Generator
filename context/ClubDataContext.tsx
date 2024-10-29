"use client";

import { Club } from "@/components/ui/columns";
import { db } from "@/firebase/config";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { ReactNode, createContext, useContext, useEffect, useState } from "react";

type ClubDataContextType = {
  clubData: Club[];
  loading: boolean;
};

const ClubDataContext = createContext<ClubDataContextType>({
  clubData: [],
  loading: true,
});

export const ClubDataContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [clubData, setClubData] = useState<Club[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    const q = query(collection(db, "clubs"), orderBy("createdAt"));
    const unsubscribe = onSnapshot(q, (snap) => {
      setLoading(true);
      const data: Club[] = snap.docs.map((doc) => ({
        id: doc.id,
        clubName: doc.data().clubName,
        createdAt: doc.data().createdAt,
      }));
      setClubData(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <ClubDataContext.Provider value={{ clubData, loading }}>
      {children}
    </ClubDataContext.Provider>
  );
};

export const ClubData = () => {
  return useContext(ClubDataContext);
};
