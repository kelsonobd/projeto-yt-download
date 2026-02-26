import { type ReactNode } from 'react';

interface TitleProps {
  children: ReactNode;
  className?: string;
}

export const Title = ({ children, className ='' }: TitleProps) => (
  <h1 className={`scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl ${className}`}>
    {children}
  </h1>
);

export const Subtitle = ({ children, className ='' }: TitleProps) => (
  <h2 className={`scroll-m-20  pb-2 text-3xl font-semibold tracking-tight first:mt-0 ${className}`}>
    {children}
  </h2>
);

export const Text = ({ children, className ='' }: TitleProps) => (
  <p className={`leading-7 [&:not(:first-child)]:mt-6 ${className}`}>
    {children}
  </p>
);