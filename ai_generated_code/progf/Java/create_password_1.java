package com.w3itexperts.ombe.fragments;

import android.content.Intent;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentTransaction;

import com.w3itexperts.ombe.APIservice.ApiClient;
import com.w3itexperts.ombe.APIservice.ApiService;
import com.w3itexperts.ombe.activity.login_signin_Activity;
import com.w3itexperts.ombe.apimodals.users;
import com.w3itexperts.ombe.databinding.CreatePasswordBinding;
import com.w3itexperts.ombe.methods.EncryptionUtil;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

// can use retrofit to communcicate/use API
// https://square.github.io/retrofit/
public class create_password extends Fragment {
    private CreatePasswordBinding b;
    private int userId;
    private String email;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater,
                             @Nullable ViewGroup container,
                             @Nullable Bundle savedInstanceState) {
        b = CreatePasswordBinding.inflate(inflater, container, false);
        return b.getRoot();
    }

    @Override
    public void onViewCreated(@NonNull View view,
                              @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        // Retrieve userId and email from the previous page
        if (getArguments() != null) {
            userId = getArguments().getInt("userId", -1);
            email = getArguments().getString("email", "");
        }

        if (userId == -1 || TextUtils.isEmpty(email)) {
            String err = "Error retrieving user information";
            Toast.makeText(getContext(), "404 ERROR: Contact Admin Support", Toast.LENGTH_SHORT).show();
            Log.d("NOMLYPROCESS", err);
            //since data fail we return them back to login page
            startActivity(new Intent(getContext(), login.class));
            getActivity().finish();
            return;
        }

        b.backbtn.setOnClickListener(v -> getActivity().onBackPressed());

        b.signinBtn.setOnClickListener(v -> startActivity(new Intent(getContext(), login_signin_Activity.class)));

        b.continueBtn.setOnClickListener(v -> {
            String newPassword = b.enterpassword.getText().toString().trim();
            String confirmPassword = b.confirmpassword.getText().toString().trim();

            if (TextUtils.isEmpty(newPassword) || TextUtils.isEmpty(confirmPassword)) {
                String msg = "Please fill in all fields";
                Toast.makeText(getContext(), msg, Toast.LENGTH_SHORT).show();
                Log.d("NOMLYPROCESS", msg);
                return;
            }

            // Check password strength
            if (!isValidPassword(newPassword)) {
                String msg = "Password must be at least 8 characters long, include 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.";
                Toast.makeText(getContext(), msg, Toast.LENGTH_LONG).show();
                Log.d("NOMLYPROCESS", msg);
                return;
            }

            if (!newPassword.equals(confirmPassword)) {
                String msg = "Passwords do not match";
                Toast.makeText(getContext(), msg, Toast.LENGTH_SHORT).show();
                Log.d("NOMLYPROCESS", msg);
                return;
            }

            ApiService apiService = ApiClient.getApiService();
            Log.d("NOMLYPROCESS", "Retrieving current user for userId: " + userId);

            // Retrieve the current user first
            try
            {
                apiService.getUser(userId).enqueue(new Callback<users>() {
                    @Override
                    public void onResponse(Call<users> call, Response<users> response) {
                        if (response.isSuccessful() && response.body() != null) {
                            users currentUser = response.body();
                            Log.d("NOMLYPROCESS", "User retrieved: " + currentUser.getUserId());

                            // Encrypt the password here
                            // Supported via standard programming aids for encryption of password - edited by erika
                            String encryptedPassword = newPassword;
                            boolean encryptstat = false;
                            try {
                                encryptedPassword = EncryptionUtil.encrypt(newPassword);
                                encryptstat = true;
                            } catch (Exception e) {
                                e.printStackTrace();
                                Toast.makeText(getContext(), "Error encrypting password", Toast.LENGTH_SHORT).show();
                            }

                            if (encryptstat) {
                                //put user stuff into hashmap then pass to the API
                                Map<String, String> updateBody = new HashMap<>();
                                updateBody.put("username", currentUser.getUsername() != null ? currentUser.getUsername() : "");
                                updateBody.put("email", email);
                                updateBody.put("password", encryptedPassword);
                                updateBody.put("preferences", currentUser.getPreferences() != null ? currentUser.getPreferences() : "");
                                updateBody.put("image", currentUser.getImage() != null ? currentUser.getImage() : "");

                                Log.d("NOMLYPROCESS", "Calling updateUser with updateBody: " + updateBody.toString());
                                apiService.updateUser(userId, updateBody).enqueue(new Callback<users>() {
                                    @Override
                                    public void onResponse(Call<users> call, Response<users> response) {
                                        if (response.isSuccessful() && response.body() != null) {

                                            String msg = "Password updated successfully";
                                            Toast.makeText(getContext(), msg, Toast.LENGTH_SHORT).show();
                                            Log.d("CREATE_PW", msg);
                                            startActivity(new Intent(getContext(), login_signin_Activity.class));
                                            getActivity().finish();

                                        } else {
                                            Log.d("NOMLYPROCESS", "i came here look at me");
                                            String errorMsg = "Password update failed: " + response.code();
                                            try {
                                                if (response.errorBody() != null) {
                                                    String errorissue = response.errorBody().string();
                                                    errorMsg += " || " + errorissue;
                                                }
                                            } catch (IOException e) {
                                                e.printStackTrace();
                                                errorMsg += " || Error parsing error body: " + e.getMessage();
                                            }
                                            Toast.makeText(getContext(), errorMsg, Toast.LENGTH_LONG).show();
                                            Log.d("NOMLYPROCESS", errorMsg);
                                        }
                                    }
                                    @Override
                                    public void onFailure(Call<users> call, Throwable t) {
                                        String msg = "Password update failed: " + t.getMessage();
                                        Toast.makeText(getContext(), msg, Toast.LENGTH_SHORT).show();
                                        Log.d("NOMLYPROCESS", msg);
                                    }
                                });
                            } else {
                                Log.d("NOMLYPROCESS", "Encryption failed, did not proceed to update password.");
                            }

                        } else {
                            String msg = "Failed to retrieve user details: " + response.code();
                            Toast.makeText(getContext(), msg, Toast.LENGTH_SHORT).show();
                            Log.d("NOMLYPROCESS", msg);
                        }
                    }

                    @Override
                    public void onFailure(Call<users> call, Throwable t) {
                        String msg = "Failed to retrieve user: " + t.getMessage();
                        Toast.makeText(getContext(), "404 ERROR: Contact Admin Support", Toast.LENGTH_SHORT).show();
                        Log.d("NOMLYPROCESS", msg);
                    }
                });
            }
            catch (Exception e) {
                Log.e("NOMLYPROCESS", "ERROR: Failed to update password - " + e.getMessage());
                Toast.makeText(getContext(), "404 ERROR: Contact Admin Support", Toast.LENGTH_SHORT).show();
            }

        });

    }

    // password safety, we do what we did in create account page
    // External sources - stackoverflow https://stackoverflow.com/questions/3802192/regexp-java-for-password-validation
    private boolean isValidPassword(String password) {
        // Minimum 8 characters, at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character
        String passwordPattern = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!]).{8,}$";
        return password.matches(passwordPattern);
    }

}
