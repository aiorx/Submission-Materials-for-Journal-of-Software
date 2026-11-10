```typescript
it('should support basic pagination with page and pageSize', async function () {
  // Aided with basic GitHub coding tools
  const TOTAL_CLIENTS = 5;
  const PAGE_SIZE = 2;
  const TARGET_PAGE = 1;

  const clients = Array.from({ length: TOTAL_CLIENTS }, (_, index) => ({
    ...getFakeClient(false),
    name: `pagination-client-${String(index).padStart(2, '0')}`,
  }));

  const connection = depContainer.resolve(DataSource);
  await connection.getRepository(Client).insert(clients.map((c) => ({ ...c })));

  const res = await requestSender.getClients({
    queryParams: {
      page: TARGET_PAGE,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      page_size: PAGE_SIZE,
    },
  });

  expect(res).toHaveProperty('status', httpStatusCodes.OK);
  expect(res).toSatisfyApiSpec();
  // @ts-expect-error need to solve as openapi-helpers is not typed correctly
  expect(res.body.items).toBeArrayOfSize(PAGE_SIZE);
  // @ts-expect-error need to solve as openapi-helpers is not typed correctly
  expect(res.body.total).toBe(TOTAL_CLIENTS);
});
```

```typescript
it('should support pagination with different page numbers', async function () {
  // Aided with basic GitHub coding tools
  const TOTAL_CLIENTS = 7;
  const PAGE_SIZE = 3;
  const SECOND_PAGE = 2;

  const clients = Array.from({ length: TOTAL_CLIENTS }, (_, index) => ({
    ...getFakeClient(false),
    name: `page-test-client-${String(index).padStart(2, '0')}`,
  }));

  const connection = depContainer.resolve(DataSource);
  await connection.getRepository(Client).insert(clients.map((c) => ({ ...c })));

  const res = await requestSender.getClients({
    queryParams: {
      page: SECOND_PAGE,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      page_size: PAGE_SIZE,
    },
  });

  expect(res).toHaveProperty('status', httpStatusCodes.OK);
  expect(res).toSatisfyApiSpec();
  // @ts-expect-error need to solve as openapi-helpers is not typed correctly
  expect(res.body.items).toBeArrayOfSize(PAGE_SIZE);
  // @ts-expect-error need to solve as openapi-helpers is not typed correctly
  expect(res.body.total).toBe(TOTAL_CLIENTS);
});
```

```typescript
it('should handle last page with fewer items', async function () {
  // Aided with basic GitHub coding tools
  const TOTAL_CLIENTS = 5;
  const PAGE_SIZE = 3;
  const LAST_PAGE = 2;
  const EXPECTED_ITEMS_ON_LAST_PAGE = 2;

  const clients = Array.from({ length: TOTAL_CLIENTS }, (_, index) => ({
    ...getFakeClient(false),
    name: `last-page-client-${String(index).padStart(2, '0')}`,
  }));

  const connection = depContainer.resolve(DataSource);
  await connection.getRepository(Client).insert(clients.map((c) => ({ ...c })));

  const res = await requestSender.getClients({
    queryParams: {
      page: LAST_PAGE,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      page_size: PAGE_SIZE,
    },
  });

  expect(res).toHaveProperty('status', httpStatusCodes.OK);
  expect(res).toSatisfyApiSpec();
  // @ts-expect-error need to solve as openapi-helpers is not typed correctly
  expect(res.body.items).toBeArrayOfSize(EXPECTED_ITEMS_ON_LAST_PAGE);
  // @ts-expect-error need to solve as openapi-helpers is not typed correctly
  expect(res.body.total).toBe(TOTAL_CLIENTS);
});
```

```typescript
it('should support sorting by name in ascending order', async function () {
  // Aided with basic GitHub coding tools
  const clientNames = ['zebra-client', 'alpha-client', 'beta-client'];
  const sortedNames = ['alpha-client', 'beta-client', 'zebra-client'];

  const clients = clientNames.map((name) => ({
    ...getFakeClient(false),
    name,
  }));

  const connection = depContainer.resolve(DataSource);
  await connection.getRepository(Client).insert(clients.map((c) => ({ ...c })));

  const res = await requestSender.getClients({
    queryParams: {
      sort: ['name:asc'],
    },
  });

  expect(res).toHaveProperty('status', httpStatusCodes.OK);
  expect(res).toSatisfyApiSpec();
  // @ts-expect-error need to solve as openapi-helpers is not typed correctly
  expect(res.body.items).toHaveLength(clientNames.length);

  // Check if items are sorted correctly
  for (let i = 0; i < sortedNames.length; i++) {
    // @ts-expect-error need to solve as openapi-helpers is not typed correctly
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(res.body.items[i].name).toBe(sortedNames[i]);
  }
});
```

```typescript
it('should support sorting by name in descending order', async function () {
  // Aided with basic GitHub coding tools
  const clientNames = ['alpha-client', 'zebra-client', 'beta-client'];
  const sortedNamesDesc = ['zebra-client', 'beta-client', 'alpha-client'];

  const clients = clientNames.map((name) => ({
    ...getFakeClient(false),
    name,
  }));

  const connection = depContainer.resolve(DataSource);
  await connection.getRepository(Client).insert(clients.map((c) => ({ ...c })));

  const res = await requestSender.getClients({
    queryParams: {
      sort: ['name:desc'],
    },
  });

  expect(res).toHaveProperty('status', httpStatusCodes.OK);
  expect(res).toSatisfyApiSpec();
  // @ts-expect-error need to solve as openapi-helpers is not typed correctly
  const items = res.body.items as IClient[];
  expect(items).toHaveLength(clientNames.length);

  // Check if items are sorted correctly in descending order
  for (let i = 0; i < sortedNamesDesc.length; i++) {
    // @ts-expect-error need to solve as openapi-helpers is not typed correctly
    expect(items[i].name).toBe(sortedNamesDesc[i]);
  }
});
```

```typescript
it('should support sorting by createdAt in ascending order', async function () {
  // Aided with basic GitHub coding tools
  const dates = [new Date('2023-01-01'), new Date('2023-03-01'), new Date('2023-02-01')];

  const clients = dates.map((date, index) => ({
    ...getFakeClient(false),
    name: `date-client-${index}`,
    createdAt: date,
  }));

  const connection = depContainer.resolve(DataSource);
  await connection.getRepository(Client).insert(clients.map((c) => ({ ...c })));

  const res = await requestSender.getClients({
    queryParams: {
      sort: ['created-at:asc'],
    },
  });

  expect(res).toHaveProperty('status', httpStatusCodes.OK);
  expect(res).toSatisfyApiSpec();
  // @ts-expect-error need to solve as openapi-helpers is not typed correctly
  expect(res.body.items).toHaveLength(dates.length);

  // Check if items are sorted by createdAt in ascending order
  // @ts-expect-error need to solve as openapi-helpers is not typed correctly
  const sortedItems = res.body.items as Client[];
  for (let i = 0; i < sortedItems.length - 1; i++) {
    // Aided with basic GitHub coding tools
    const currentItem = sortedItems[i];
    const nextItem = sortedItems[i + 1];

    // Ensure createdAt exists before creating Date objects
    if (!currentItem?.createdAt || !nextItem?.createdAt) {
      throw new Error('createdAt is required for date comparison');
    }

    const currentDate = new Date(currentItem.createdAt);
    const nextDate = new Date(nextItem.createdAt);
    expect(currentDate.getTime()).toBeLessThanOrEqual(nextDate.getTime());
  }
});
```

```typescript
it('should combine pagination and sorting', async function () {
  // Aided with basic GitHub coding tools
  const TOTAL_CLIENTS = 6;
  const PAGE_SIZE = 2;
  const TARGET_PAGE = 2;

  const clients = Array.from({ length: TOTAL_CLIENTS }, (_, index) => ({
    ...getFakeClient(false),
    name: `combo-client-${String(index).padStart(2, '0')}`,
  }));

  const connection = depContainer.resolve(DataSource);
  await connection.getRepository(Client).insert(clients.map((c) => ({ ...c })));

  const res = await requestSender.getClients({
    queryParams: {
      page: TARGET_PAGE,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      page_size: PAGE_SIZE,
      sort: ['name:asc'],
    },
  });

  expect(res).toHaveProperty('status', httpStatusCodes.OK);
  expect(res).toSatisfyApiSpec();
  // @ts-expect-error need to solve as openapi-helpers is not typed correctly
  const returnedItems = res.body.items as IClient[];
  expect(returnedItems).toBeArrayOfSize(PAGE_SIZE);
  // @ts-expect-error need to solve as openapi-helpers is not typed correctly
  expect(res.body.total).toBe(TOTAL_CLIENTS); // Verify the specific items on page 2 with sorting
  const isFirstItemCorrect = returnedItems[0]?.name === 'combo-client-02';
  const isSecondItemCorrect = returnedItems[1]?.name === 'combo-client-03';

  expect(isFirstItemCorrect).toBe(true);
  expect(isSecondItemCorrect).toBe(true);
});
```

```typescript
it('should return empty results for page beyond available data', async function () {
  // Aided with basic GitHub coding tools
  const TOTAL_CLIENTS = 3;
  const PAGE_SIZE = 5;
  const BEYOND_AVAILABLE_PAGE = 2;

  const clients = Array.from({ length: TOTAL_CLIENTS }, (_, index) => ({
    ...getFakeClient(false),
    name: `empty-test-client-${index}`,
  }));

  const connection = depContainer.resolve(DataSource);
  await connection.getRepository(Client).insert(clients.map((c) => ({ ...c })));

  const res = await requestSender.getClients({
    queryParams: {
      page: BEYOND_AVAILABLE_PAGE,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      page_size: PAGE_SIZE,
    },
  });

  expect(res).toHaveProperty('status', httpStatusCodes.OK);
  expect(res).toSatisfyApiSpec();
  // @ts-expect-error need to solve as openapi-helpers is not typed correctly
  expect(res.body.items).toBeArrayOfSize(0);
  // @ts-expect-error need to solve as openapi-helpers is not typed correctly
  expect(res.body.total).toBe(TOTAL_CLIENTS);
});
```