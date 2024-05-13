import { InstructionIconOne } from '@/components/icons/instruction/instruction-one';
import { InstructionIconTwo } from '@/components/icons/instruction/instruction-two';
import { InstructionIconThree } from '@/components/icons/instruction/instruction-three';
import { InstructionIconFour } from '@/components/icons/instruction/instruction-four';

export const instructions = [
  {
    title: 'Find the perfect location',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc venenatis.',
    icon: (
      <InstructionIconOne />
    ),
  },
  {
    title: 'Select amenities',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc venenatis.',
    icon: (
      <InstructionIconTwo />
    ),
  },
  {
    title: 'Filter for the right size and room no.',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc venenatis.',
    icon: (
      <InstructionIconThree />
    ),
  },
  {
    title: 'Check out detailed descriptions of each apt.',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc venenatis.',
    icon: (
      <InstructionIconFour />
    ),
  },
];