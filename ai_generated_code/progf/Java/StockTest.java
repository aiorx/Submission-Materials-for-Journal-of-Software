
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.slf4j.Logger;
import static java.lang.invoke.MethodHandles.lookup;
import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.mockito.Mockito.*;
import static org.slf4j.LoggerFactory.getLogger;

import pt.ua.deti.tqs.IStockmarketService;
import pt.ua.deti.tqs.Stock;
import pt.ua.deti.tqs.StocksPortfolio;


@ExtendWith(MockitoExtension.class)
public class StockTest {
    static final Logger log = getLogger(lookup().lookupClass());

    @Mock
    IStockmarketService stockMarket;

    @InjectMocks
    StocksPortfolio portfolio;

    @BeforeEach
    void setUp() {
        log.info("Running StockTest...");
    }


    @Test
    void testTotalValue() {
        log.info("Running testTotalValue...");

        Stock googleStock = new Stock("1", 10);
        Stock appleStock = new Stock("2", 20);
        Stock teslaStock = new Stock("3", 5);
        Stock amazonStock = new Stock("4", 5);

        portfolio.addStock(googleStock);
        portfolio.addStock(appleStock);
        portfolio.addStock(teslaStock);
        portfolio.addStock(amazonStock);

        when(stockMarket.lookUpPrice("1")).thenReturn(50.0);
        when(stockMarket.lookUpPrice("2")).thenReturn(1000.0);
        when(stockMarket.lookUpPrice("3")).thenReturn(500.0);
        when(stockMarket.lookUpPrice("4")).thenReturn(100.0);

        double result = portfolio.totalValue();

        double objective = 23500.0;

        assertThat(result, equalTo(objective));

        verify(stockMarket, times(4)).lookUpPrice(anyString());
    }


    // i've generated this test using github copilot, i analyzed the code ant it seems good to me.
    @Test
    void testMostValuableStocks() {
        log.info("Running testMostValuableStocks...");

        Stock googleStock = new Stock("1", 10);
        Stock appleStock = new Stock("2", 20);
        Stock teslaStock = new Stock("3", 5);
        Stock amazonStock = new Stock("4", 5);

        portfolio.addStock(googleStock);
        portfolio.addStock(appleStock);
        portfolio.addStock(teslaStock);
        portfolio.addStock(amazonStock);

        when(stockMarket.lookUpPrice("1")).thenReturn(50.0);
        when(stockMarket.lookUpPrice("2")).thenReturn(1000.0);
        when(stockMarket.lookUpPrice("3")).thenReturn(500.0);
        when(stockMarket.lookUpPrice("4")).thenReturn(100.0);

        var result = portfolio.mostValuableStocks(2);

        assertThat(result.get(0).getLabel(), equalTo("2"));
        assertThat(result.get(1).getLabel(), equalTo("3"));

        verify(stockMarket, times(4)).lookUpPrice(anyString());
    }

    // after i checked the coverage of the tests i realized, that my tests are covering 100% of the StocksPortfolio class!
}
