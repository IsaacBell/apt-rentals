import DestinationBlock from '@/components/home/destination-block/destination-block';
import SubscriptionBlock from '@/components/subscription/subscription-block';
import InstructionBlock from '@/components/home/instruction-block';
import PromotionalBlock from '@/components/home/promotional-block';
import TestimonialBlock from '@/components/home/testimonial-block';
import HeroBanner from '@/components/home/hero-banner';

export default function HomePage() {
  return (
    <>
      <HeroBanner />
      <DestinationBlock />
      <InstructionBlock />
      <PromotionalBlock />
      <TestimonialBlock />
      <SubscriptionBlock sectionClassName="4xl:!px-16" />
    </>
  );
}
