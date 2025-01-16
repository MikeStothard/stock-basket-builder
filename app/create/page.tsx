'use client';

import React from 'react';
import { Container, Stepper, Title, Card } from '@mantine/core';
import { useForm } from '@mantine/form';
import { BasketDetails } from './BasketDetails';
import { StockSelection } from './StockSelection';
import { AllocationSetting } from './AllocationSetting';
import { ReviewBasket } from './ReviewBasket';

export type BasketFormValues = {
  name: string;
  description: string;
  theme: string;
  stocks: Array<{ symbol: string; name: string; allocation?: number }>;
};

export default function CreateBasketPage() {
  const [active, setActive] = React.useState(0);

  const form = useForm<BasketFormValues>({
    initialValues: {
      name: '',
      description: '',
      theme: '',
      stocks: [],
    },
    validate: {
      name: (value) => (value.length < 2 ? 'Name must be at least 2 characters' : null),
      description: (value) => (value.length < 10 ? 'Description must be at least 10 characters' : null),
      theme: (value) => (value.length < 2 ? 'Theme must be at least 2 characters' : null),
    },
  });

  const nextStep = () => setActive((current) => Math.min(current + 1, 3));
  const prevStep = () => setActive((current) => Math.max(current - 1, 0));

  return (
    <Container size="xl" py="xl">
      <Title order={1} mb="xl">Create New Basket</Title>

      <Card shadow="sm" p="xl">
        <Stepper active={active} onStepClick={setActive} mb="xl">
          <Stepper.Step label="Basic Details" description="Name and description">
            <BasketDetails form={form} onNext={nextStep} />
          </Stepper.Step>

          <Stepper.Step label="Select Stocks" description="Choose stocks">
            <StockSelection form={form} onNext={nextStep} onPrev={prevStep} />
          </Stepper.Step>

          <Stepper.Step label="Set Allocations" description="Define weights">
            <AllocationSetting form={form} onNext={nextStep} onPrev={prevStep} />
          </Stepper.Step>

          <Stepper.Step label="Review" description="Confirm details">
            <ReviewBasket form={form} onPrev={prevStep} />
          </Stepper.Step>
        </Stepper>
      </Card>
    </Container>
  );
} 