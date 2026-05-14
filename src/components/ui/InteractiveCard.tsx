import React from 'react';
import { Card3D, Card3DProps } from './Card3D';

export const InteractiveCard = (props: Card3DProps) => {
  return <Card3D interactive={true} glow={true} {...props} />;
};
