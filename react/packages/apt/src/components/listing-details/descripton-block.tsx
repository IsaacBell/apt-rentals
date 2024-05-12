'use client';

import Text from '@/components/ui/typography/text';
import Section from '@/components/ui/section';

interface DescriptionBlockProps {
  onDescriptionChange: (val: string) => void;
  description: string;
  editMode: boolean;
}

export function _DescriptionBlock({
  onDescriptionChange,
  description,
  editMode,
}: DescriptionBlockProps) {
  return (
    <Section className="py-5 lg:py-6 xl:py-7">
      <Text className="!text-base !leading-7 !text-secondary">
        {description}
      </Text>
    </Section>
  );
}

export default function DescriptionBlock({
  onDescriptionChange,
  description,
  editMode,
}: DescriptionBlockProps) {
  return (
    <Section className="py-5 lg:py-6 xl:py-7">
      {editMode ? (
        <textarea
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          className="!text-base !leading-7 !text-secondary w-full"
        />
      ) : (
        <Text className="!text-base !leading-7 !text-secondary">
          {description}
        </Text>
      )}
    </Section>
  );
}