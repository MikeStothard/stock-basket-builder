'use client';

import React from 'react';
import { TextInput, Textarea, Button, Stack } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { BasketFormValues } from './page';

interface BasketDetailsProps {
  form: UseFormReturnType<BasketFormValues>;
  onNext: () => void;
}

export function BasketDetails({ form, onNext }: BasketDetailsProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.validate().hasErrors) return;
    onNext();
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack>
        <TextInput
          label="Basket Name"
          placeholder="e.g., Space Industry Leaders"
          {...form.getInputProps('name')}
          required
        />

        <Textarea
          label="Description"
          placeholder="Describe your investment thesis..."
          minRows={3}
          {...form.getInputProps('description')}
          required
        />

        <TextInput
          label="Theme"
          placeholder="e.g., Space, Technology, Green Energy"
          {...form.getInputProps('theme')}
          required
        />

        <Button type="submit" mt="md">
          Next Step
        </Button>
      </Stack>
    </form>
  );
} 