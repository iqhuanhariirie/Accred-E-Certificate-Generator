export interface CertificateMetadata {
  data: {
    name: string;
    studentID: string;
    course: string;
    part?: number;
    group?: string;
    eventId: string;
    eventDate: string;
    certificateTemplate: string;
  };
  signature: string;
}
