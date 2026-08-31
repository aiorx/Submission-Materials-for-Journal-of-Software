package fi.nordicwatt.model.data;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.time.LocalDateTime;

import org.junit.jupiter.api.Test;
import fi.nordicwatt.model.datamodel.EnergyModel;
import fi.nordicwatt.types.DataType;
import fi.nordicwatt.types.MeasurementUnit;

/**
 * @author Supported by standard GitHub tools
 */
public class EnergyModelTest {

    @Test
    public void testEnergyModel() {

        EnergyModel model = new EnergyModel(DataType.CONSUMPTION, MeasurementUnit.MEGA_WATT_HOUR,
                LocalDateTime.of(2021, 1, 1, 0, 0), new Double[] {1.0, 2.0, 3.0});

        assertEquals(DataType.CONSUMPTION, model.getDataType());
        assertEquals(MeasurementUnit.MEGA_WATT_HOUR, model.getUnit());
        // assertEquals("2021-01-01 00:00:00", model.getFirstEntryTimestamp());
        assertEquals(3, model.getDataPoints().size());
        assertEquals(1.0, model.getDataPoints().get(LocalDateTime.of(2021, 1, 1, 0, 0)));
        assertEquals(2.0, model.getDataPoints().get(LocalDateTime.of(2021, 1, 1, 1, 0)));
        assertEquals(3.0, model.getDataPoints().get(LocalDateTime.of(2021, 1, 1, 2, 0)));
    }

    // Test all possible data types
    @Test
    public void testEnergyModelDataTypes() {
        EnergyModel model = new EnergyModel(DataType.CONSUMPTION, MeasurementUnit.MEGA_WATT_HOUR);
        assertEquals(DataType.CONSUMPTION, model.getDataType());

        model = new EnergyModel(DataType.PRODUCTION, MeasurementUnit.MEGA_WATT_HOUR);
        assertEquals(DataType.PRODUCTION, model.getDataType());
    }

    // Test that values added are correct
    @Test
    public void testAddDataPoint() {
        EnergyModel model = new EnergyModel(DataType.CONSUMPTION, MeasurementUnit.MEGA_WATT_HOUR);
        model.addDataPoint(LocalDateTime.of(2021, 1, 1, 0, 0), 1.0);
        model.addDataPoint(LocalDateTime.of(2021, 1, 1, 1, 0), 2.0);
        model.addDataPoint(LocalDateTime.of(2021, 1, 1, 2, 0), 3.0);
        assertEquals(3, model.getDataPoints().size());
        assertEquals(1.0, model.getDataPoints().get(LocalDateTime.of(2021, 1, 1, 0, 0)));
        assertEquals(2.0, model.getDataPoints().get(LocalDateTime.of(2021, 1, 1, 1, 0)));
        assertEquals(3.0, model.getDataPoints().get(LocalDateTime.of(2021, 1, 1, 2, 0)));
    }

    // Test that returned map is correct, without range
    @Test
    public void testGetDataPoints() {
        EnergyModel model = new EnergyModel(DataType.CONSUMPTION, MeasurementUnit.MEGA_WATT_HOUR,
                LocalDateTime.of(2021, 1, 1, 0, 0), new Double[] {1.0, 2.0, 3.0});
        assertEquals(3, model.getDataPoints().size());
        assertEquals(1.0, model.getDataPoints().get(LocalDateTime.of(2021, 1, 1, 0, 0)));
        assertEquals(2.0, model.getDataPoints().get(LocalDateTime.of(2021, 1, 1, 1, 0)));
        assertEquals(3.0, model.getDataPoints().get(LocalDateTime.of(2021, 1, 1, 2, 0)));
    }

    // Test that returned map is correct, with range
    @Test
    public void testGetDataPointsWithRange() {
        EnergyModel model = new EnergyModel(DataType.CONSUMPTION, MeasurementUnit.MEGA_WATT_HOUR,
                LocalDateTime.of(2021, 1, 1, 0, 0), new Double[] {1.0, 2.0, 3.0});
        assertEquals(3, model.getDataPointsWithRange(LocalDateTime.of(2021, 1, 1, 0, 0),
                LocalDateTime.of(2021, 1, 1, 2, 0)).size());
        assertEquals(1.0,
                model.getDataPointsWithRange(LocalDateTime.of(2021, 1, 1, 0, 0),
                        LocalDateTime.of(2021, 1, 1, 2, 0))
                        .get(LocalDateTime.of(2021, 1, 1, 0, 0)));
        assertEquals(2.0,
                model.getDataPointsWithRange(LocalDateTime.of(2021, 1, 1, 0, 0),
                        LocalDateTime.of(2021, 1, 1, 2, 0))
                        .get(LocalDateTime.of(2021, 1, 1, 1, 0)));
        assertEquals(3.0,
                model.getDataPointsWithRange(LocalDateTime.of(2021, 1, 1, 0, 0),
                        LocalDateTime.of(2021, 1, 1, 2, 0))
                        .get(LocalDateTime.of(2021, 1, 1, 2, 0)));
    }
}
