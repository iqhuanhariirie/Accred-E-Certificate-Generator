import { FormType, OptionalFormType } from "@/components/EventForm";
import { db } from "@/firebase/config";
import { compressBanner } from "@/utils/compressBanner";
import { parseCSV } from "@/utils/parseCSV";
import { uploadPhoto } from "@/utils/uploadToStorage";
import { generateBulkSignatures } from "@/utils/signatureUtils"; 
import {
  Timestamp,
  addDoc,
  collection,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";

export type Guest = {
  email: string;
  name: string;
  studentID: string;
  course: string;
  part: number;
  group: string;
  certId: string;
  signature?: string; 
  signatureTimestamp?: Timestamp; 
};

export type InitialPayload = {
  eventName: string;
  description: string;
  eventDate: Timestamp;
  guestList?: Guest[];
};

export type FilePayload = {
  eventBanner?: string;
  certificateTemplate?: string;
};

export const sendDocumentToFirestore = async (payload: FormType) => {
  try {
    console.log("Payload received in sendDocumentToFirestore:", payload);

    const parsedGuestList: Guest[] = await parseCSV(payload.guestList); 
    const initialPayload: InitialPayload = {
      eventName: payload.eventName || "", 
      description: payload.description || "", 
      eventDate: payload.eventDate ? Timestamp.fromDate(payload.eventDate) : Timestamp.now(), 
      guestList: parsedGuestList || [], 
    };

    console.log("Initial payload before adding to Firestore:", initialPayload);

    const eventDocRef = await addDoc(collection(db, "events"), initialPayload); 
    
    const compressedBanner = await compressBanner(payload.eventBanner);
    const eventBannerURL: string = await uploadPhoto(
      eventDocRef.id,
      compressedBanner,
      "banner"
    );
    const certificateTemplateURL: string = await uploadPhoto(
      eventDocRef.id,
      payload.certificateTemplate,
      "cert"
    );

    const signedGuestList = await generateBulkSignatures(
      eventDocRef.id,
      parsedGuestList,
      payload.eventDate,
      certificateTemplateURL
    );

    const filePayload: FilePayload & { guestList: Guest[] } = {
      eventBanner: eventBannerURL,
      certificateTemplate: certificateTemplateURL,
      guestList: signedGuestList, 
    };

    console.log("File payload before updating Firestore:", filePayload);

    await updateDoc(eventDocRef, filePayload);
    console.log("Event successfully uploaded to Firebase with signatures!");
  } catch (error: any) {
    console.error("Uploading event error occurred", error.message);
    throw error; 
  }
};

export const editDocumentInFirestore = async ({
  payload,
  id,
}: {
  payload: OptionalFormType;
  id: string;
}) => {
  try {
    let parsedGuestList: Guest[] | undefined;
    if (payload.guestList !== undefined) {
      parsedGuestList = await parseCSV(payload.guestList); 
    }

    const initialPayload: InitialPayload = {
      eventName: payload.eventName,
      description: payload.description,
      eventDate: Timestamp.fromDate(payload.eventDate),
    };

    const eventDocRef = doc(db, "events", id); 

    let certificateTemplateURL = undefined;
    let eventBannerURL = undefined;

    if (payload.eventBanner !== undefined) {
      const compressedBanner = await compressBanner(payload.eventBanner);
      eventBannerURL = await uploadPhoto(id, compressedBanner, "banner");
    }

    if (payload.certificateTemplate !== undefined) {
      certificateTemplateURL = await uploadPhoto(id, payload.certificateTemplate, "cert");
    }

    if (parsedGuestList) {
      const signedGuestList = await generateBulkSignatures(
        id,
        parsedGuestList,
        payload.eventDate,
        certificateTemplateURL || (await getCurrentCertificateTemplate(id))
      );
      initialPayload.guestList = signedGuestList;
    }

    await updateDoc(eventDocRef, {
      ...initialPayload,
      ...(eventBannerURL && { eventBanner: eventBannerURL }),
      ...(certificateTemplateURL && { certificateTemplate: certificateTemplateURL }),
    });

    console.log("Event successfully edited in Firebase with updated signatures!");
  } catch (error: any) {
    console.error("Editing event error occurred", error.message);
    throw error;
  }
};

async function getCurrentCertificateTemplate(eventId: string): Promise<string> {
  const docRef = doc(db, "events", eventId);
  const eventDoc = await getDoc(docRef);
  if (eventDoc.exists()) {
    return eventDoc.data()?.certificateTemplate || '';
  }
  return '';
}
