import React from 'react';
import { Card3D, Card3DProps } from './Card3D';

export const GlassCard = (props: Card3DProps) => {
  return <Card3D variant="glass" depth="lg" {...props} />;
};
