'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Container, Title, Card, Text, Group, Table, Stack, Button, Grid } from '@mantine/core';
import { IconShare, IconTrendingUp, IconTrendingDown } from '@tabler/icons-react';
import { BasketWithHoldings } from '@/types/basket';
import { PerformanceChart } from '@/components/PerformanceChart';

export default function BasketDetailPage({ params }: { params: { id: string } }) {
  const { data: basket, isLoading } = useQuery<BasketWithHoldings>({
    queryKey: ['basket', params.id],
    queryFn: async () => {
      const response = await fetch(`/api/baskets/${params.id}`);
      if (!response.ok) throw new Error('Failed to fetch basket');
      return response.json();
    },
  });

  const { data: performance } = useQuery({
    queryKey: ['basketPerformance', params.id],
    queryFn: async () => {
      const response = await fetch(`/api/baskets/${params.id}/performance`);
      if (!response.ok) throw new Error('Failed to fetch performance data');
      return response.json();
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (!basket) return <div>Basket not found</div>;

  const formatPercentage = (value: number) => {
    const formatted = (value * 100).toFixed(2);
    return `${formatted}%`;
  };

  const MetricCard = ({ title, value }: { title: string; value: number }) => (
    <Card shadow="sm" p="md">
      <Text size="sm" c="dimmed">{title}</Text>
      <Group align="center" mt={4}>
        {value >= 0 ? (
          <IconTrendingUp size={20} color="green" />
        ) : (
          <IconTrendingDown size={20} color="red" />
        )}
        <Text size="xl" fw={700} c={value >= 0 ? 'green' : 'red'}>
          {formatPercentage(value)}
        </Text>
      </Group>
    </Card>
  );

  return (
    <Container size="xl" py="xl">
      <Stack>
        <Group position="apart">
          <Title order={1}>{basket.name}</Title>
          <Button leftIcon={<IconShare size={16} />} variant="light">
            Share
          </Button>
        </Group>

        <Grid>
          <Grid.Col span={3}>
            <MetricCard 
              title="Daily Change" 
              value={basket.metrics?.dailyChange || 0} 
            />
          </Grid.Col>
          <Grid.Col span={3}>
            <MetricCard 
              title="Weekly Change" 
              value={basket.metrics?.weeklyChange || 0} 
            />
          </Grid.Col>
          <Grid.Col span={3}>
            <MetricCard 
              title="Monthly Change" 
              value={basket.metrics?.monthlyChange || 0} 
            />
          </Grid.Col>
          <Grid.Col span={3}>
            <MetricCard 
              title="Yearly Change" 
              value={basket.metrics?.yearlyChange || 0} 
            />
          </Grid.Col>
        </Grid>

        <Card shadow="sm" p="lg">
          <Text size="lg" fw={500} mb="md">Theme: {basket.theme}</Text>
          <Text>{basket.description}</Text>
        </Card>

        {performance && <PerformanceChart data={performance} />}

        <Card shadow="sm" p="lg">
          <Title order={3} mb="md">Holdings</Title>
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Symbol</Table.Th>
                <Table.Th>Name</Table.Th>
                <Table.Th>Allocation</Table.Th>
                <Table.Th>Current Price</Table.Th>
                <Table.Th>Daily Change</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {basket.holdings.map((holding) => (
                <Table.Tr key={holding.id}>
                  <Table.Td>{holding.symbol}</Table.Td>
                  <Table.Td>{holding.name}</Table.Td>
                  <Table.Td>{holding.allocation.toString()}%</Table.Td>
                  <Table.Td>${basket.metrics?.prices?.[holding.symbol]?.toFixed(2) || '-'}</Table.Td>
                  <Table.Td>
                    {basket.metrics?.changes?.[holding.symbol]?.daily 
                      ? formatPercentage(basket.metrics.changes[holding.symbol].daily)
                      : '-'
                    }
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Card>
      </Stack>
    </Container>
  );
} 