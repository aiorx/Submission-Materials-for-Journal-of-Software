package com.group8.foodwizard.model.recipe;

import com.group8.foodwizard.model.api.ApiUtils;
import com.group8.foodwizard.model.formatter.JsonParser;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.io.IOException;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mockStatic;
import static org.mockito.Mockito.times;

import com.group8.foodwizard.model.recipe.RecipeModel.CachedMealFetcher;

import org.mockito.MockedStatic;
import org.mockito.Mockito;

class RecipeModelTest {

    /** A mock instance of the singleton RecipeModel used for testing. */
    private RecipeModel mockModel;
    /** A sample ingredient representing "Chicken". */
    private Ingredient ingredient1;
    /** A sample ingredient representing "Rice". */
    private Ingredient ingredient2;
    /** A sample ingredient representing "Garlic". */
    private Ingredient ingredient3;
    /** A sample meal: "Chicken Alfredo Primavera". */
    private Meal meal1;
    /** A sample meal: "Chicken Congee". */
    private Meal meal2;
    /** A sample meal: "Pasta". */
    private Meal meal3;
    /** An instance of the CachedMealFetcher for testing caching logic. */
    private CachedMealFetcher fetcher;

    /**
     * Initializes common objects before each test case.
     *
     * @throws IOException if data fetching fails during model initialization
     */
    @BeforeEach
    void setUp() throws IOException {
        RecipeModel.resetInstanceForTest(); // Clear the existing singleton instance
        mockModel = RecipeModel.getInstance(); // Re-initialize the singleton instance

        ingredient1 = new Ingredient("1", "Chicken", "");
        ingredient2 = new Ingredient("268", "Rice", "");
        ingredient3 = new Ingredient("149", "Garlic", "");

        meal1 = new Meal("Chicken Alfredo Primavera",
                "https://www.themealdb.com/images/media/meals/syqypv1486981727.jpg", "52796");
        meal2 = new Meal("Chicken Congee",
                "https://www.themealdb.com/images/media/meals/1529446352.jpg", "52956");
        meal3 = new Meal("Pasta", "thumb3", "103");

        fetcher = new CachedMealFetcher();
    }


    /** Tests that RecipeModel uses the Singleton pattern. */
    @Test
    public void testSingletonReturnsSameInstance() throws IOException {
        RecipeModel instance1 = RecipeModel.getInstance();
        RecipeModel instance2 = RecipeModel.getInstance();

        assertNotNull(instance1);
        assertSame(instance1, instance2, "Both instances should be the same (singleton)");
    }

    /** Verifies that all ingredients are loaded correctly. */
    @Test
    void testGetAllIngredients() {
        int exepctedAllIngredientsNumber = 575;
        assertEquals(exepctedAllIngredientsNumber, mockModel.getAllIngredients().size());
    }

    /** Verifies that all categories are loaded correctly. */
    @Test
    void testGetAllCategories() {
        System.out.println(mockModel.getAllCategories());
        assertTrue(mockModel.getAllCategories().contains("Seafood"));
    }

    /** Verifies that all areas are loaded correctly. */
    @Test
    void testGetAllAreas() {
        System.out.println(mockModel.getAllAreas());
        assertTrue(mockModel.getAllAreas().contains("Italian"));
    }

    /** Verifies that the correct intersection meals are returned
     * when meals are shared based on user-selected filters. */
    @Test
    void testFindIntersection() {
        List<Set<Meal>> sets = List.of(
                Set.of(meal1, meal2),
                Set.of(meal1),
                Set.of(meal1, meal3)
        );

        Set<Meal> result = mockModel.findIntersection(sets);
        assertEquals(1, result.size());
        assertTrue(result.contains(meal1));
    }

    /** Verifies that findIntersection returns an empty set when given an empty list. */
    @Test
    void testFindIntersectionWithEmptySet() {
        List<Set<Meal>> sets = List.of();
        Set<Meal> result = mockModel.findIntersection(sets);
        assertEquals(0, result.size());
    }

    /**
     * Verifies retrieval of a complete recipe by meal ID.
     *
     * @throws IOException if recipe retrieval fails
     */
    @Test
    void testGetRecipeByIdMeal() throws IOException {
        Recipe recipe = mockModel.getRecipeByIdMeal(Integer.parseInt(meal1.idMeal()));
        assertNotNull(recipe);
        System.out.println(recipe);
        assertEquals("Chicken Alfredo Primavera", recipe.recipeName());
    }

    /**
     * Tests processing: 1. Single ingredient, no category, no area
     */
    @Test
    void testSingleIngredientOnly() throws IOException {
        Set<Ingredient> userIngredients = Set.of(ingredient2);
        Set<Meal> result = mockModel.processMeals(userIngredients, null, null);
        assertEquals(11, result.size());
        assertTrue(result.contains(meal2));
    }

    /**
     * Tests processing: 2. Two ingredients, no category, no area
     */
    @Test
    void testTwoIngredientsOnly() throws IOException {
        // ingredient 1: chicken
        // ingredient 2: rice
        // return all meals using chicken OR rice
        Set<Meal> result = mockModel.processMeals(Set.of(ingredient1, ingredient2), null, null);
        System.out.println(result);
        assertEquals(22, result.size());
        assertTrue(result.contains(meal1));
        assertTrue(result.contains(meal2));
    }

    /**
     * Tests processing: 3. Single ingredient + one category, no area
     */
    @Test
    void testSingleIngredientAndCategory() throws IOException {
        // ingredient3 = garlic
        Set<Meal> result = mockModel.processMeals(Set.of(ingredient3), "Pasta", null);
        System.out.println(result);
        // Set<Meal> findIntersection(List<Set<Meal>> mealSets)
        String expectedResult = "[Meal[mealName=Lasagne, "
                + "mealImg=https://www.themealdb.com/images/media/meals/wtsvxx1511296896.jpg, "
                + "idMeal=52844], "
                + "Meal[mealName=Pilchard puttanesca, "
                + "mealImg=https://www.themealdb.com/images/media/meals/vvtvtr1511180578.jpg, "
                + "idMeal=52837], "
                + "Meal[mealName=Venetian Duck Ragu, "
                + "mealImg=https://www.themealdb.com/images/media/meals/qvrwpt1511181864.jpg, "
                + "idMeal=52838]]";
        Set<Meal> expectedIntersection = mockModel.findIntersection(
                List.of(mockModel.getMealsByIngredient(Set.of(ingredient3)),
                        mockModel.getMealsByCategory("Pasta"))
        );
        assertEquals(expectedResult, result.toString());
        assertEquals(expectedIntersection, result);

    }

    /**
     * Tests processing: 4. Two ingredients + one area, no category
     */
    @Test
    void testTwoIngredientsAndArea() throws IOException {
        // ingredient 1: chicken
        // ingredient 2: rice
        // return all meals using chicken OR rice
        Set<Meal> result = mockModel.processMeals(Set.of(ingredient1, ingredient2), null, "Italian");
        Set<Meal> expected = mockModel.findIntersection(
                List.of(mockModel.getMealsByIngredient(Set.of(ingredient1, ingredient2)),
                        mockModel.getMealsByArea("Italian"))
        );
        assertEquals(expected, result);
    }

    /**
     * Tests processing: 5. Single ingredient + one category + one area
     */
    @Test
    void testSingleIngredientCategoryArea() throws IOException {
        Set<Meal> result = mockModel.processMeals(Set.of(ingredient1), "Pasta", "Italian");
        Set<Meal> expected = mockModel.findIntersection(
                List.of(mockModel.getMealsByIngredient(Set.of(ingredient1)),
                        mockModel.getMealsByCategory("Pasta"),  mockModel.getMealsByArea("Italian"))
        );
        assertEquals(expected, result);
    }

    /**
     * Tests processing: 6. No ingredients, no category, no area
     */
    @Test
    void testNoInputs() throws IOException {
        Set<Meal> result = mockModel.processMeals(null, null, null);
        assertTrue(result.isEmpty());
    }

    /**
     * Tests processing: 7.  No ingredients, one category, no area
     */
    @Test
    void testOnlyCategory() throws IOException {
        Set<Meal> result = mockModel.processMeals(null, "Pasta", null);
        System.out.println(result);
        assertFalse(result.isEmpty());
    }

    /**
     * Tests processing: 8. No ingredients, no category, one area
     */
    @Test
    void testOnlyArea() throws IOException {
        Set<Meal> result = mockModel.processMeals(null, null, "Italian");
        System.out.println(result);
        assertFalse(result.isEmpty());
    }

    /**
     * Tests processing: 9. No ingredients, one category, one area
     */
    @Test
    void testOnlyCategoryAndArea() throws IOException {
        Set<Meal> result = mockModel.processMeals(null, "Pasta", "Italian");
        Set<Meal> expected = mockModel.findIntersection(
                List.of(mockModel.getMealsByCategory("Pasta"),  mockModel.getMealsByArea("Italian"))
        );
        assertEquals(expected, result);

    }

    /**
     * Ensures getMealsByIngredient handles the exception and returns an empty set.
     * This test is Aided using common development resources.
     */
    @Test
    void testGetMealsByIngredientWhenIOExceptionThenReturnsEmptySet() {
        Ingredient fakeIngredient = new Ingredient("1", "Chicken", "image.png");
        Set<Ingredient> ingredients = Set.of(fakeIngredient);

        try (MockedStatic<ApiUtils> apiMock = mockStatic(ApiUtils.class)) {
            apiMock.when(() -> ApiUtils.getMealsByIngredient("Chicken"))
                    .thenThrow(new IOException("Mocked IOException"));

            Set<Meal> result = fetcher.getMealsByIngredient(ingredients);
            assertTrue(result.isEmpty(), "Expected empty set when IOException occurs");
        }
    }

    /**
     * Ensures getMealsByCategory handles the exception and returns an empty set.
     * This test is Aided using common development resources.
     */
    @Test
    void testGetMealsByCategoryWhenIOExceptionThenReturnsEmptySet() {
        String category = "Seafood";

        try (
                MockedStatic<ApiUtils> apiMock = mockStatic(ApiUtils.class);
                MockedStatic<JsonParser> parserMock = mockStatic(JsonParser.class)
        ) {
            // Simulate a RuntimeException for Exception
            apiMock.when(() -> ApiUtils.mealsByCategory(category))
                    .thenThrow(new RuntimeException("Mocked Exception"));

            // mock parser error
            parserMock.when(() -> JsonParser.extractMeals(Mockito.any()))
                    .thenReturn(Set.of());

            // call the real method
            RecipeModel.CachedMealFetcher fetcher = new RecipeModel.CachedMealFetcher();
            Set<Meal> result = fetcher.getMealsByCategory(category);

            assertTrue(result.isEmpty(), "Expected empty set when RuntimeException occurs");
        }
    }

    /**
     * Ensures getMealsByArea handles the exception and returns an empty set.
     * This test is Aided using common development resources.
     */
    @Test
    void testGetMealsByAreaWhenIOExceptionThenReturnsEmptySet() {
        String area = "Italian";

        try (
                MockedStatic<ApiUtils> apiMock = mockStatic(ApiUtils.class);
                MockedStatic<JsonParser> parserMock = mockStatic(JsonParser.class)
        ) {
            // Simulate RuntimeException (broader Exception)
            apiMock.when(() -> ApiUtils.mealsByArea(area))
                    .thenThrow(new RuntimeException("Mocked Exception"));

            // mock parser error
            parserMock.when(() -> JsonParser.extractMeals(Mockito.any()))
                    .thenReturn(Set.of());

            // Call the actual method
            RecipeModel.CachedMealFetcher fetcher = new RecipeModel.CachedMealFetcher();
            Set<Meal> result = fetcher.getMealsByArea(area);

            assertTrue(result.isEmpty(), "Expected empty set when RuntimeException occurs");
        }
    }

    /**
     * Verifies caching behavior of getMealsByIngredient.
     * This test is Aided using common development resources.
     */
    @Test
    void testIngredientCaching() {
        CachedMealFetcher fetcher = new CachedMealFetcher();
        Ingredient lime = new Ingredient("202", "Lime", "");
        Set<Ingredient> ingredients = Set.of(lime);

        Meal mockMeal = new Meal("MockMeal", "mockThumb", "1");
        Set<Meal> mockMeals = Set.of(mockMeal);

        try (MockedStatic<ApiUtils> mocked = mockStatic(ApiUtils.class)) {
            mocked.when(() -> ApiUtils.getMealsByIngredient("Lime")).thenReturn(mockMeals);

            // First call: API should be used
            Set<Meal> first = fetcher.getMealsByIngredient(ingredients);
            assertEquals(mockMeals, first);

            // Second call: should be cached
            Set<Meal> second = fetcher.getMealsByIngredient(ingredients);
            assertEquals(mockMeals, second);

            // Verify API called only once
            mocked.verify(() -> ApiUtils.getMealsByIngredient("Lime"), times(1));
        }
    }

    /**
     * Verifies caching behavior of getMealsByCategory.
     * This test is Aided using common development resources.
     */
    @Test
    void testCategoryCaching() {
        CachedMealFetcher fetcher = new CachedMealFetcher();
        Set<Meal> mockMeals = Set.of(new Meal("MockMeal", "mockThumb", "1"));

        try (MockedStatic<ApiUtils> mocked = mockStatic(ApiUtils.class);
             MockedStatic<JsonParser> jsonMock = mockStatic(JsonParser.class)) {

            mocked.when(() -> ApiUtils.mealsByCategory("Beef")).thenReturn(null);
            jsonMock.when(() -> JsonParser.extractMeals(null)).thenReturn(mockMeals);

            // Call twice
            fetcher.getMealsByCategory("Beef");
            fetcher.getMealsByCategory("Beef");

            // Verify both calls only once
            mocked.verify(() -> ApiUtils.mealsByCategory("Beef"), times(1));
            jsonMock.verify(() -> JsonParser.extractMeals(null), times(1));
        }
    }

    /**
     * Verifies caching behavior of getMealsByArea.
     * This test is Aided using common development resources.
     */
    @Test
    void testAreaCaching() {
        CachedMealFetcher fetcher = new CachedMealFetcher();
        Set<Meal> mockMeals = Set.of(new Meal("MockMeal", "mockThumb", "1"));

        try (MockedStatic<ApiUtils> mocked = mockStatic(ApiUtils.class);
             MockedStatic<JsonParser> jsonMock = mockStatic(JsonParser.class)) {

            mocked.when(() -> ApiUtils.mealsByArea("American")).thenReturn(null);
            jsonMock.when(() -> JsonParser.extractMeals(null)).thenReturn(mockMeals);

            // Call twice
            fetcher.getMealsByArea("American");
            fetcher.getMealsByArea("American");

            // Verify both calls only once
            mocked.verify(() -> ApiUtils.mealsByArea("American"), times(1));
            jsonMock.verify(() -> JsonParser.extractMeals(null), times(1));
        }
    }
}
