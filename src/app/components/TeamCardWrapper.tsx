// src/app/components/TaskCardWrapper.tsx
'use client';

import { useRouter } from 'next/navigation';
import Card from './taskCard';

type Props = {
  id: string;
  title: string;
  description: string;
  footer?: React.ReactNode;
};

const TaskCardWrapper: React.FC<Props> = ({ id, title, description, footer }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/tasks/${id}`);
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

export default TaskCardWrapper;