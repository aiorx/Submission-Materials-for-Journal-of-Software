def optimize_transaction_pairing(
    trans: List[Transaction],
    strategies: Dict[int, str],
) -> List[SaleRecord]:
    """
    • When a SELL closes an existing long, use the legacy find_buys logic.
      Any excess quantity becomes a new short lot.

    • When a BUY covers a short, consume open shorts in strict FIFO order.
      Any excess quantity opens (or enlarges) a long lot and will later be
      matched by find_buys when a SELL occurs.

    Long-only results remain byte-for-byte identical to the historical
    implementation; short selling now works deterministically.

    Initially Drafted using standard development resources o3.
    """
    warn_about_default_strategy(trans, strategies)

    sale_records: List[SaleRecord] = []
    sale_map: Dict[Transaction, SaleRecord] = {}
    open_shorts: deque[_OpenShort] = deque()        # FIFO queue of short lots

    # Process chronologically
    for t in sorted(trans, key=lambda x: x.time):

        # SELL: first close longs with the original machinery
        if t.is_sale:
            try:
                buy_records = find_buys(t, trans, strategies)   # unchanged call
            except ValueError:
                # TODO: Resolve this HACK. Add some status reporting.
                print(f"Could not find a buy transaction for {t}, openning short.")
                buy_records = []

            matched_qty = sum(br._count_consumed for br in buy_records)
            total_qty   = -t.count          # positive number of shares sold
            excess_qty  = total_qty - matched_qty  # may be zero

            # Record the long close (even if partially matched)
            sale_rec = SaleRecord(t, buy_records)
            sale_records.append(sale_rec)
            sale_map[t] = sale_rec

            # Any excess opens / enlarges a short position
            if excess_qty:
                open_shorts.append(_OpenShort(t, excess_qty))

        # BUY: cover outstanding shorts FIFO, then leave the rest as a long
        else:
            remaining = t.count

            while remaining and open_shorts:
                short_lot = open_shorts[0]  # Always FIFO for short covers.
                qty = min(remaining, short_lot.remaining)

                fee_used = t.consume_shares(qty)
                buy_rec = BuyRecord(t, qty, fee_used, is_short_cover=True)

                sale_rec = sale_map.get(short_lot.tx)
                if sale_rec is None:  # should not generally happen
                    sale_rec = SaleRecord(short_lot.tx, [])
                    sale_records.append(sale_rec)
                    sale_map[short_lot.tx] = sale_rec
                sale_rec.append_buy_record(buy_rec)

                short_lot.remaining -= qty
                remaining -= qty
                if short_lot.remaining == 0:
                    open_shorts.popleft()

            # Any *remaining* shares now form / enlarge a long position.
            # No extra action needed: they will be paired by find_buys later.

    if open_shorts:
        print("Warning: Unmatched open short positions remain after pairing.")
        # TODO: Add some status reporting.

    return sale_records