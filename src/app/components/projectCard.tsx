'use client';
// src/app/components/Card.tsx

import React from 'react';
import '../../app/components/Form/Card.css'; 

interface CardProps {
  title: string;
  description: string | React.ReactNode; // ✅ supports JSX
  footer?: React.ReactNode; // ✅ supports JSX or plain text
  onClick?: () => void;
}


const Card: React.FC<CardProps>=({
    title, description, footer, onClick

})=> {
    return (<div className="custom-card" onClick= {
            onClick
        }

        > <div className="card-content" > <h3 className="card-title" > {
            title
        }

        </h3> <p className="card-description" > {
            description
        }

        </p> {
            footer && <div className="card-footer" > {
                footer
            }

            </div>
        }

        </div> </div>);
}

;

export default Card;