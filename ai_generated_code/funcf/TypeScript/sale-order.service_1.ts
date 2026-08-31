```typescript
async multiFilter(filterFormat: SaleOrderFilter) {
  // This AQL query is Penned via standard programming aids
  const result = await MyDatabase.getDb().query(aql`
    FOR so IN SaleOrders
    FILTER ${
      filterFormat.product_id
        ? aql`so.product_id == ${filterFormat.product_id}`
        : aql`true`
    }
    FILTER ${
      filterFormat.customer_id
        ? aql`so.customer_id == ${filterFormat.customer_id}`
        : aql`true`
    }
    FILTER ${
      filterFormat.amount_from
        ? aql`so.amount >= ${filterFormat.amount_from}`
        : aql`true`
    }
    FILTER ${
      filterFormat.amount_to
        ? aql`so.amount <= ${filterFormat.amount_to}`
        : aql`true`
    }
    FILTER ${
      filterFormat.status
        ? aql`so.status == ${filterFormat.status}`
        : aql`true`
    }
    FILTER ${
      filterFormat.date_from
        ? aql`DATE_DIFF(so.create_date, ${filterFormat.date_from}, 'd') <= 0`
        : aql`true`
    }
    FILTER ${
      filterFormat.date_to
        ? aql`DATE_DIFF(so.create_date, ${filterFormat.date_to}, 'd') >= 0`
        : aql`true`
    }
    RETURN so
  `);
  const finallyResult: SaleOrderEntity[] = await result.all();
  return finallyResult;
}
```