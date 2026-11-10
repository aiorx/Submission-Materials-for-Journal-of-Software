```python
#: Tests Formed using common GitHub development resources, checked and fixed by hand

def test_convert_to_gdf_returns_gdf_if_already_gdf(self, mocker):
    gdf_mock = mocker.Mock(spec=palletjack.utils.gpd.GeoDataFrame)
    result = palletjack.utils.convert_to_gdf(gdf_mock)
    assert result is gdf_mock

def test_convert_to_gdf_returns_gdf_with_none_geometry_for_regular_df(self, mocker):
    df_mock = mocker.Mock()
    #: Simulate KeyError when accessing .spatial.geometry_type
    type(df_mock).spatial = property(lambda self: (_ for _ in ()).throw(KeyError()))
    gdf_mock = mocker.patch("palletjack.utils.gpd.GeoDataFrame")
    #: since we're mocking gpd.GeoDataFrame, the isinstance check errors, so just make it return false
    mocker.patch("palletjack.utils.isinstance", return_value=False)

    result = palletjack.utils.convert_to_gdf(df_mock)

    gdf_mock.assert_called_with(df_mock, geometry=None)
    assert result == gdf_mock.return_value

def test_convert_to_gdf_handles_spatially_enabled_dataframe(self, mocker):
    df_mock = mocker.Mock()
    df_mock.spatial.geometry_type = "Point"
    df_mock.spatial.name = "SHAPE"
    df_mock.spatial.sr.latestWkid = 4326
    gdf_mock = mocker.patch("palletjack.utils.gpd.GeoDataFrame").return_value
    gdf_mock.set_crs = mocker.Mock()
    #: since we're mocking gpd.GeoDataFrame, the isinstance check errors, so just make it return false
    mocker.patch("palletjack.utils.isinstance", return_value=False)

    result = palletjack.utils.convert_to_gdf(df_mock)

    gdf_mock.set_crs.assert_called_with(4326, inplace=True)
    assert result == gdf_mock

def test_convert_to_gdf_handles_spatially_enabled_dataframe_uses_wkid_instead_of_lakestwkid(self, mocker):
    df_mock = mocker.Mock()
    df_mock.spatial.geometry_type = "Point"
    df_mock.spatial.name = "SHAPE"

    #: spec out sr so that we get an AttributeError if we try to access latestWkid
    sr_mock = mocker.Mock(spec="palletjack.utils.arcgis.geometry.SpatialReference")
    sr_mock.wkid = 4326
    df_mock.spatial.sr = sr_mock

    gdf_mock = mocker.patch("palletjack.utils.gpd.GeoDataFrame").return_value
    gdf_mock.set_crs = mocker.Mock()
    #: since we're mocking gpd.GeoDataFrame, the isinstance check errors, so just make it return false
    mocker.patch("palletjack.utils.isinstance", return_value=False)

    result = palletjack.utils.convert_to_gdf(df_mock)

    gdf_mock.set_crs.assert_called_with(4326, inplace=True)
    assert result == gdf_mock
```