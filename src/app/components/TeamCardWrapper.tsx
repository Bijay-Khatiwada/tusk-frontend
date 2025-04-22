// src/app/components/TeamCardWrapper.tsx
'use client';

import { useRouter } from 'next/navigation';
import Card from './teamCard';
import React from 'react';

type Props = {
  id: string;
  title: string;
  description: string | React.ReactNode;
};

const TeamCardWrapper: React.FC<Props> = ({ id, title, description }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/teams/${id}`);
  };

  return (
    <Card
      title={title}
      description={description}
      onClick={handleClick}
    />
  );
};

export default TeamCardWrapper;
