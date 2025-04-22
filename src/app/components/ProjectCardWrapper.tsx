// src/app/components/ProjectCardWrapper.tsx
'use client';

import { useRouter } from 'next/navigation';
import Card from './projectCard'; // still using the same Card component

type Props = {
  id: string; // 👈 Add this line
  title: string;
  description: string | React.ReactNode;
  footer?: React.ReactNode;
};


const ProjectCardWrapper: React.FC<Props> = ({ id, title, description, footer }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/projects/${id}`);
  };

  return (
    <Card
      title={title}
      description={description}
      footer={footer}
      onClick={handleClick}
    />
  );
};

export default ProjectCardWrapper;
