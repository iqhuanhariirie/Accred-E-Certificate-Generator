import EventCard from "@/components/EventCard";

interface PageProps {
  params: {
    id: string;
  };
}

export default function Page({ params }: PageProps) {
  return <EventCard id={params.id} />;
}
