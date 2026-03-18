import React from 'react';
import ServicePageClient from './ServicePageClient';
import { LanguageProvider } from '@/components/LanguageSwitch';

export async function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
    { id: '5' },
  ];
}

export default function ServicePage({ params }: { params: { id: string } }) {
  return (
    <LanguageProvider>
      <ServicePageClient serviceId={params.id} />
    </LanguageProvider>
  );
}
