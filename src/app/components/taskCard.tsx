'use client';
// src/app/components/Card.tsx

import React from 'react';
import '../../app/components/Form/Card.css'; 

// interface CardProps {
//     title: string;
//     description: string;
//     footer?: React.ReactNode;
//     onClick?: ()=> void;
// }
type CardProps = {
  title: string;
  description: string | React.ReactNode; // ← update this
  footer?: string;
  onClick?: () => void;
};

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