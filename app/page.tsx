'use client';

import { Container, Title, Grid, Card, Text, Group, Button } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import React from 'react';
import { BasketWithHoldings } from '@/types/basket';

export default function HomePage() {
  const { data: popularBaskets } = useQuery<BasketWithHoldings[]>({
    queryKey: ['popularBaskets'],
    queryFn: async () => {
      const response = await fetch('/api/baskets/popular');
      return response.json();
    }
  });

  return (
    <Container size="xl" py="xl">
      <Title order={1} mb="xl">Discover Stock Baskets</Title>
      
      <Grid>
        {popularBaskets?.map((basket) => (
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