"use client";

import Certificate from "@/components/Certificate";
import { GuestLoginButton } from "@/components/GuestLoginButton";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { generateLinkedInShareURL } from "@/utils/generateLinkedInShareURL";
import { Guest } from "@/utils/uploadToFirestore";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { User } from "firebase/auth";
import { Timestamp } from "firebase/firestore";
import { useRef, ReactNode } from "react";

interface EventCardContentProps {
  guestList: Guest[];
  certificateTemplate: string;
  eventName: string;
  eventDate: Timestamp;
  eventId: string;
}

interface RenderProps {
  blob: Blob | null;
  url: string | null;
  loading: boolean;
  error: Error | null;
}

export const EventCardContent = ({
  guestList,
  certificateTemplate,
  eventName,
  eventDate,
  eventId,
}: EventCardContentProps) => {
  const { logOut, user } = useAuth();
  const certId = useRef<string>("");

  const checkIfUserInGuestList = (user: User) => {
    const foundGuest = guestList.find((person) => person.email === user.email);
    if (foundGuest) {
      certId.current = foundGuest.certId;
      return true;
    }
    return false;
  };

  const handleLogOut = () => {
    try {
      logOut();
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddToLinkedIn = () => {
    if (typeof window !== "undefined") {
      const timestampMillis = eventDate.toMillis();
      const date = new Date(timestampMillis);
      const eventYear = date.getFullYear();
      const eventMonth = date.getMonth() + 1;
      const shareURL = generateLinkedInShareURL({
        orgName: "Google Developer Student Clubs - University of the East Caloocan",
        certTitle: eventName,
        certYear: eventYear,
        certMonth: eventMonth,
        certId: certId.current,
        certURL: `${window.location.href}/certificate/${certId.current}`,
      });
      window.open(shareURL, "_blank");
    }
  };

  const userInGuestList = user !== null && checkIfUserInGuestList(user);

  if (user === null) {
    return <GuestLoginButton />;
  } else if (userInGuestList) {
    const foundGuest = guestList.find((person) => person.email === user.email);

    const renderButton = ({ loading }: RenderProps): ReactNode => (
      <Button className="w-full" disabled={loading}>
        {loading ? "Loading PDF..." : "Download PDF"}
      </Button>
    );

    return (
      <div className="flex flex-col w-5/12 gap-2">
        <PDFDownloadLink
          document={
            <Certificate
              certificateTemplate={certificateTemplate}
              guestName={foundGuest?.name || ""}
              studentID={foundGuest?.studentID || ""}
              course={foundGuest?.course || ""}
              part={foundGuest?.part || 0}
              group={foundGuest?.group || ""}
              eventDate={eventDate}
              signature={foundGuest?.signature}
              eventId={eventId}
              certId={foundGuest?.certId || ""}
              guest={foundGuest!}
            />
          }
          fileName={`${foundGuest?.name || "certificate"}_certificate.pdf`}
        >
          {renderButton as unknown as ReactNode}
        </PDFDownloadLink>
        <Button onClick={handleAddToLinkedIn}>Add to LinkedIn</Button>
        <Button variant="destructive" onClick={handleLogOut}>
          Logout
        </Button>
      </div>
    );
  } else {
    return (
      <>
        <span className="font-bold text-center">
          You have not been found as a guest for this event. Please contact the
          event administrators if this is a mistake.
        </span>
        <Button variant="destructive" onClick={handleLogOut}>
          Logout
        </Button>
      </>
    );
  }
};
