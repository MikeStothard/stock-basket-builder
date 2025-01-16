'use client';

import { Header, Container, Group, Button, Title } from '@mantine/core';
import Link from 'next/link';
import React from 'react';

export function Navigation() {
  return (
    <Header height={60} mb={120}>
      <Container size="xl">
        <Group justify="space-between" h="100%">
          <Title order={3} component={Link} href="/" style={{ textDecoration: 'none' }}>
            Stock Baskets
          </Title>
          
          <Group>
            <Button component={Link} href="/discover" variant="light">
              Discover
            </Button>
            <Button component={Link} href="/create">
              Create Basket
            </Button>
          </Group>
        </Group>
      </Container>
    </Header>
  );
} 