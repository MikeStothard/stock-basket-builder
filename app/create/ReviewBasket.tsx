'use client';

import React from 'react';
import { Stack, Group, Button, Text, Table, Card, Title } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { BasketFormValues } from './page';

interface ReviewBasketProps {
  form: UseFormReturnType<BasketFormValues>;
  onPrev: () => void;
}

export function ReviewBasket({ form, onPrev }: ReviewBasketProps) {
  const router = useRouter();
  
  const createBasket = useMutation({
    mutationFn: async (data: BasketFormValues) => {
      const response = await fetch('/api/baskets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create basket');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      router.push(`/baskets/${data.id}`);
    },
  });

  const handleSubmit = () => {
    createBasket.mutate(form.values);
  };

  return (
    <Stack>
      <Card shadow="sm" p="md">
        <Title order={3} mb="md">Basket Details</Title>
        <Stack gap="xs">
          <Text><strong>Name:</strong> {form.values.name}</Text>
          <Text><strong>Theme:</strong> {form.values.theme}</Text>
          <Text><strong>Description:</strong> {form.values.description}</Text>
        </Stack>
      </Card>

      <Card shadow="sm" p="md" mt="md">
        <Title order={3} mb="md">Holdings</Title>
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Symbol</Table.Th>
              <Table.Th>Name</Table.Th>
              <Table.Th>Allocation</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {form.values.stocks.map((stock) => (
              <Table.Tr key={stock.symbol}>
                <Table.Td>{stock.symbol}</Table.Td>
                <Table.Td>{stock.name}</Table.Td>
                <Table.Td>{stock.allocation}%</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Card>

      <Group justify="space-between" mt="xl">
        <Button variant="light" onClick={onPrev}>
          Back
        </Button>
        <Button 
          onClick={handleSubmit}
          loading={createBasket.isPending}
          color="green"
        >
          Create Basket
        </Button>
      </Group>
    </Stack>
  );
} 