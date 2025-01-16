'use client';

import React from 'react';
import { Container, Title, Grid, Card, Text, Group, Button, TextInput, Select } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { IconSearch } from '@tabler/icons-react';
import Link from 'next/link';
import { BasketWithHoldings } from '@/types/basket';

export default function DiscoverPage() {
  const [search, setSearch] = React.useState('');
  const [theme, setTheme] = React.useState<string | null>(null);

  const { data: baskets } = useQuery<BasketWithHoldings[]>({
    queryKey: ['baskets', search, theme],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.append('q', search);
      if (theme) params.append('theme', theme);
      
      const response = await fetch(`/api/baskets/search?${params.toString()}`);
      return response.json();
    },
  });

  return (
    <Container size="xl" py="xl">
      <Title order={1} mb="xl">Discover Baskets</Title>

      <Group mb="xl">
        <TextInput
          placeholder="Search baskets..."
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
          icon={<IconSearch size={16} />}
          style={{ flex: 1 }}
        />
        <Select
          placeholder="Filter by theme"
          value={theme}
          onChange={setTheme}
          clearable
          data={[
            { value: 'technology', label: 'Technology' },
            { value: 'finance', label: 'Finance' },
            { value: 'healthcare', label: 'Healthcare' },
            // Add more themes
          ]}
        />
      </Group>

      <Grid>
        {baskets?.map((basket) => (
          <Grid.Col key={basket.id} span={{ base: 12, sm: 6, md: 4 }}>
            <Card shadow="sm" padding="lg">
              <Title order={3}>{basket.name}</Title>
              <Text c="dimmed" size="sm" mt="sm">
                {basket.description}
              </Text>
              
              <Text mt="md" fw={500}>Top Holdings:</Text>
              {basket.holdings.slice(0, 3).map((holding) => (
                <Group key={holding.id} justify="space-between" mt="xs">
                  <Text size="sm">{holding.symbol}</Text>
                  <Text size="sm">{holding.allocation.toString()}%</Text>
                </Group>
              ))}
              
              <Button
                component={Link}
                href={`/baskets/${basket.id}`}
                variant="light"
                fullWidth
                mt="md"
              >
                View Details
              </Button>
            </Card>
          </Grid.Col>
        ))}
      </Grid>
    </Container>
  );
} 