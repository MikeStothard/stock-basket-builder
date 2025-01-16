'use client';

import React from 'react';
import { Stack, Group, Button, Text, NumberInput, Alert } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { IconAlertCircle } from '@tabler/icons-react';
import { BasketFormValues } from './page';

interface AllocationSettingProps {
  form: UseFormReturnType<BasketFormValues>;
  onNext: () => void;
  onPrev: () => void;
}

export function AllocationSetting({ form, onNext, onPrev }: AllocationSettingProps) {
  const [totalAllocation, setTotalAllocation] = React.useState(0);

  React.useEffect(() => {
    const total = form.values.stocks.reduce((sum, stock) => 
      sum + (stock.allocation || 0), 0);
    setTotalAllocation(total);
  }, [form.values.stocks]);

  const handleAllocationChange = (symbol: string, value: number) => {
    const updatedStocks = form.values.stocks.map(stock => 
      stock.symbol === symbol ? { ...stock, allocation: value } : stock
    );
    form.setFieldValue('stocks', updatedStocks);
  };

  const isValid = Math.abs(totalAllocation - 100) < 0.01;

  return (
    <Stack>
      <Text size="sm" mb="md">
        Set allocation percentages for each stock. Total must equal 100%.
      </Text>

      {form.values.stocks.map((stock) => (
        <Group key={stock.symbol} justify="space-between" align="center">
          <Text size="sm" style={{ width: '200px' }}>
            {stock.symbol} - {stock.name}
          </Text>
          <NumberInput
            value={stock.allocation || 0}
            onChange={(value) => handleAllocationChange(stock.symbol, Number(value))}
            min={0}
            max={100}
            precision={2}
            step={0.5}
            style={{ width: '120px' }}
            suffix="%"
          />
        </Group>
      ))}

      <Alert 
        color={isValid ? 'green' : 'red'} 
        icon={<IconAlertCircle />}
        title="Total Allocation"
        mt="md"
      >
        Current total: {totalAllocation.toFixed(2)}%
        {!isValid && ' (Must equal 100%)'}
      </Alert>

      <Group justify="space-between" mt="xl">
        <Button variant="light" onClick={onPrev}>
          Back
        </Button>
        <Button onClick={onNext} disabled={!isValid}>
          Review Basket
        </Button>
      </Group>
    </Stack>
  );
} 