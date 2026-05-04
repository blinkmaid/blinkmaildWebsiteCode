import ServiceBookingFlow from './ServiceBookingFlow'; // Ensure this matches your filename

// Remove: export const dynamic = 'force-static';
// Remove: export async function generateStaticParams() { ... } if not needed

export default function Page({ params }) {
  return <ServiceBookingFlow id={params.id} />;
}