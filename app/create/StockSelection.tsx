'use client';

import React from 'react';
import { TextInput, Button, Group, Stack, Table, ActionIcon } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { IconSearch, IconTrash } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { BasketFormValues } from './page';

interface StockSelectionProps {
  form: UseFormReturnType<BasketFormValues>;
  onNext: () => void;
  onPrev: () => void;
}

export function StockSelection({ form, onNext, onPrev }: StockSelectionProps) {
  const [search, setSearch] = React.useState('');

  const { data: searchResults } = useQuery({
    queryKey: ['stockSearch', search],
    queryFn: async () => {
      if (!search) return [];
      const response = await fetch(`/api/stocks/search?q=${encodeURIComponent(search)}`);
      return response.json();
    },
    enabled: search.length > 1
  });

  const addStock = (stock: { symbol: string; name: string }) => {
    if (!form.values.stocks.find(s => s.symbol === stock.symbol)) {
      form.setFieldValue('stocks', [...form.values.stocks, stock]);
    }
  };

  const removeStock = (symbol: string) => {
    form.setFieldValue(
      'stocks',
      form.values.stocks.filter(s => s.symbol !== symbol)
    );
  };

  return (
    <Stack>
      <TextInput
        label="Search Stocks"
        placeholder="Enter company name or symbol"
        value={search}
        onChange={(e) => setSearch(e.currentTarget.value)}
        rightSection={<IconSearch size={16} />}
      />

      {searchResults && searchResults.length > 0 && (
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Symbol</Table.Th>
              <Table.Th>Name</Table.Th>
              <Table.Th>Action</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {searchResults.map((stock: any) => (
              <Table.Tr key={stock.symbol}>
                <Table.Td>{stock.symbol}</Table.Td>
                <Table.Td>{stock.name}</Table.Td>
                <Table.Td>
                  <Button
                    size="xs"
                    variant="light"
                    onClick={() => addStock(stock)}
                    disabled={form.values.stocks.some(s => s.symbol === stock.symbol)}
                  >
                    Add
                  </Button>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      )}

      <Table mt="xl">
        <Table.Caption>Selected Stocks</Table.Caption>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Symbol</Table.Th>
            <Table.Th>Name</Table.Th>
            <Table.Th>Action</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {form.values.stocks.map((stock) => (
            <Table.Tr key={stock.symbol}>
              <Table.Td>{stock.symbol}</Table.Td>
              <Table.Td>{stock.name}</Table.Td>
              <Table.Td>
                <ActionIcon
                  color="red"
                  variant="subtle"
                  onClick={() => removeStock(stock.symbol)}
                >
                  <IconTrash size={16} />
                </ActionIcon>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>

      <Group justify="space-between" mt="xl">
        <Button variant="light" onClick={onPrev}>
          Back
        </Button>
        <Button
          onClick={onNext}
          disabled={form.values.stocks.length === 0}
        >
          Next
        </Button>
      </Group>
    </Stack>
  );
} 