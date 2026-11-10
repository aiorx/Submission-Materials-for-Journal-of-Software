package com.example.frontend.apiwrappers;

import com.google.gson.JsonElement;
import retrofit2.Call;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

/**
 * Whole class generated with ChatGPT
 */
public class UBCGradesRequest extends ServerRequest{
    public static final String RequestTag = "Requests";
    private static final String BASE_URL = "https://ubcgrades.com/"; // Replace with your API base URL

    private ApiService apiService;
    /**
     * Aided using common development resources
     */
    public UBCGradesRequest() {
        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl(BASE_URL)
                .addConverterFactory(GsonConverterFactory.create())
                .build();

        apiService = retrofit.create(ApiService.class);
    }

    public void makeUBCGradesGetRequest(String endpoint, final ApiRequestListener listener) {
        Call<JsonElement> call = apiService.getData(endpoint);
        callHandler(listener, call);
    }
}
