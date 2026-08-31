```python
@bp.route('/stock/<symbol>', methods=['GET'])
@login_required
def stock_detail(symbol):
    # Retrieve the primary stock information
    stock = SP500Stock.query.filter_by(symbol=symbol).first_or_404()
    
    # Load the watchlist to check for existing notes
    watchlist = load_watchlist()  # Assisted using common GitHub development utilities
    watchlist_notes = {}  # Assisted using common GitHub development utilities
    for symbol, notes in watchlist.get('notes', {}).items():  # Assisted using common GitHub development utilities
        if isinstance(notes, list) and notes:  # Assisted using common GitHub development utilities
            watchlist_notes[symbol] = notes[-1]['text']  # Assisted using common GitHub development utilities
        else:  # Assisted using common GitHub development utilities
            watchlist_notes[symbol] = ""  # Assisted using common GitHub development utilities

    # Determine timeframe
    timeframe = request.args.get('timeframe', '1y')  
    include_spy = request.args.get('include_spy', 'true') == 'true'
    include_sector = request.args.get('include_sector', 'true') == 'true'

    # Determine start date based on timeframe
    start_date = calculate_start_date(timeframe)

    # Fetch primary stock data based on timeframe
    if timeframe == 'intraday':
        primary_data = StockData.get_intraday_data(stock.symbol)
    else:
        primary_data = StockData.get_sector_data(stock.symbol, start_date)
    
    # Fetch SPY data and normalize if included
    if include_spy:
        spy_data = StockData.get_intraday_data('SPY') if timeframe == 'intraday' else StockData.get_sector_data('SPY', start_date)
        normalized_spy_data = StockData.normalize_to_percentage_scale(primary_data, spy_data)
    else:
        normalized_spy_data = {}

    # Fetch sector data and normalize if timeframe supports and included
    sector_data = {}
    if include_sector and timeframe not in ['intraday', '5d']:
        sector_symbol = StockData.get_sector_symbol(stock.sector)
        if sector_symbol:
            print(f"Fetching Sector Data for stock sector {stock.sector} {sector_symbol}")
            raw_sector_data = StockData.get_sector_data(sector_symbol, start_date)
            sector_data = StockData.normalize_to_percentage_scale(primary_data, raw_sector_data)
        else:
            print(f"Unable to fetch sector data for {stock.sector}")

    # JSON response structure
    if request.args.get('format') == 'json':
        return jsonify({
            'primary_data': primary_data,
            'spy_data': normalized_spy_data,
            'sector_data': sector_data
        })

    # Render HTML template
    return render_template(
        'sp500/stock_detail.html',
        stock=stock,
        primary_data=primary_data,
        spy_data=normalized_spy_data,
        sector_data=sector_data,
        timeframe=timeframe,
        watchlist_notes=watchlist_notes  # Assisted using common GitHub development utilities
    )
```