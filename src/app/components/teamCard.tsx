'use client';

// src/app/components/teamCard.tsx

import React from 'react';
import '../../app/components/Form/Card.css';

interface CardProps {
  title: string;
  description: string | React.ReactNode;
  footer?: React.ReactNode;
  onClick?: () => void;
}

const TeamCard: React.FC<CardProps> = ({ title, description, footer, onClick }) => {
  return (
    <div className="custom-card" onClick={onClick}>
      <div className="card-content">
        <h3 className="card-title">{title}</h3>
        <div className="card-description">{description}</div>
        {footer && <div className="card-footer">{footer}</div>}
      </div>
    </div>
  );
};

export default TeamCard;
