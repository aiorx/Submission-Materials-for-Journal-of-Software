```typescript
export function mkTestRowsNoRepeat(opts?: any) {
  const rows: any[] = [];

  for (let i = 0; i < TEST_NUM_ROWS; i++) {
    rows.push({
      name: 'apples',
      quantity: 10,
      price: 2.6,
      day: new Date('2017-11-26'),
      date: new Date(TEST_VTIME + 1000 * i),
      finger: 'FNORD',
      inter: { months: 42, days: 23, milliseconds: 777 },
      stock: { quantity: 10, warehouse: 'A' },
      colour: ['green', 'red'],
      compression: opts && opts.compression
    });

    rows.push({
      name: 'oranges',
      quantity: 20,
      price: 2.7,
      day: new Date('2017-11-26'),
      date: new Date(TEST_VTIME + 2000 * i),
      finger: 'FNORD',
      inter: { months: 42, days: 23, milliseconds: 777 },
      stock: {
        quantity: 50,
        warehouse: 'X'
      },
      colour: ['orange']
    });

    rows.push({
      name: 'kiwi',
      price: 4.2,
      quantity: undefined,
      day: new Date('2017-11-26'),
      date: new Date(TEST_VTIME + 8000 * i),
      finger: 'FNORD',
      inter: { months: 42, days: 23, milliseconds: 777 },
      stock: { quantity: 20, warehouse: 'x' },
      colour: ['green', 'brown'],
      meta_json: { expected_ship_date: new Date(TEST_VTIME) }
    });

    rows.push({
      name: 'banana',
      price: 3.2,
      day: new Date('2017-11-26'),
      date: new Date(TEST_VTIME + 6000 * i),
      finger: 'FNORD',
      inter: { months: 42, days: 23, milliseconds: 777 },
      colour: ['yellow'],
      meta_json: { shape: 'curved' }
    });
  }

  return rows;
}
```