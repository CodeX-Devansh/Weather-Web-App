import React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const spinnerVariants = cva('animate-spin rounded-full border-solid border-current border-r-transparent', {
  variants: {
    size: {
      sm: 'h-4 w-4 border-2',
      md: 'h-6 w-6 border-2',
      lg: 'h-10 w-10 border-4',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

const Spinner = ({ size, className }) => {
  return <div role="status" className={cn(spinnerVariants({ size, className }))}></div>;
};

export default Spinner;