package com.example.ievent.activity;

import android.app.Activity;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Rect;
import android.os.Bundle;
import android.text.TextUtils;
import android.view.MotionEvent;
import android.view.View;
import android.view.inputmethod.InputMethodManager;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.ProgressBar;

import com.example.ievent.R;
import com.google.android.material.textfield.TextInputEditText;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;

/***
 * Activity for user login
 * @author Zhiyuan Lu
 * @author Haolin Li
 */
public class LoginActivity extends BaseActivity {
    private TextInputEditText emailEditText;
    private TextInputEditText passwordEditText;

    private ProgressBar progressBar;

    private CheckBox checkBox;


    private static final String PREF = "LOGIN_PREF";


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        mAuth = FirebaseAuth.getInstance();

        emailEditText = findViewById(R.id.editText_login_EmailAddress);
        passwordEditText = findViewById(R.id.editText_login_pwd);
        progressBar = findViewById(R.id.progress_login);
        checkBox = findViewById(R.id.checkBox_remember);
        Button loginButton = findViewById(R.id.button_login);
        Button signUpButton = findViewById(R.id.button_signup);


        loginButton.setOnClickListener(v -> loginUser());

        signUpButton.setOnClickListener(v -> {
            // jump to sign-up page
            Intent intent = new Intent(LoginActivity.this, SignupActivity.class);
            startActivity(intent);
        });
        getPrefData();
    }

    /**
     * login user
     */
    private void loginUser() {
        String email = emailEditText.getText().toString().trim();
        String password = passwordEditText.getText().toString().trim();
        runOnUiThread(() -> progressBar.setVisibility(View.VISIBLE));
        SharedPreferences sp = getSharedPreferences(PREF, MODE_PRIVATE);
        if (checkBox.isChecked()) {
            boolean isChecked = checkBox.isChecked();
            SharedPreferences.Editor editor = sp.edit();
            editor.putString("email", email);
            editor.putString("pwd", password);
            editor.putBoolean("checked", isChecked);
            editor.apply();
        } else {
            sp.edit().clear().apply();
        }
        if (!TextUtils.isEmpty(email) && !TextUtils.isEmpty(password)) {
            mAuth.signInWithEmailAndPassword(email, password).addOnCompleteListener(this, task -> {
                progressBar.setVisibility(View.GONE);
                if (task.isSuccessful()) {
                    FirebaseUser firebaseUser = mAuth.getCurrentUser();
                    if (firebaseUser != null) {
                        // login succeed, jump to main
                        Intent intent = new Intent(LoginActivity.this, MainActivity.class);
                        startActivity(intent);
                        finish();
                    }
                } else {
                    // login failed, show failed message
                    passwordEditText.setError("Invalid password");
                }
            });
        } else {
            progressBar.setVisibility(View.GONE);
            if (TextUtils.isEmpty(email)) {
                emailEditText.setError("Email can not be empty");
            }

            if (TextUtils.isEmpty(password)) {
                passwordEditText.setError("Password can not be empty");
            }
        }
    }

    /***
     * auto fill email and password when remember password is checked.
     */
    private void getPrefData() {
        SharedPreferences sp = getSharedPreferences(PREF, MODE_PRIVATE);
        if (sp.contains("email")) {
            String storedEmail = sp.getString("email", "email not found");
            emailEditText.setText(storedEmail);
        }
        if (sp.contains("pwd")) {
            String storedPwd = sp.getString("pwd", "pwd not found");
            passwordEditText.setText(storedPwd);
        }
        if (sp.contains("checked")) {
            boolean storedIsChecked = sp.getBoolean("checked", false);
            checkBox.setChecked(storedIsChecked);
        }
    }

    private void hideKeyboard(View view) {
        InputMethodManager inputMethodManager = (InputMethodManager) getSystemService(Activity.INPUT_METHOD_SERVICE);
        if (inputMethodManager != null && view != null) {
            inputMethodManager.hideSoftInputFromWindow(view.getWindowToken(), 0);
        }
    }

    /***
     * when user touches empty space, the keyboard automatically hides
     * Supported via standard programming aids
     * @param event The touch screen event.
     *
     * @return whether the keyboard should hide
     */
    @Override
    public boolean dispatchTouchEvent(MotionEvent event) {
        if (event.getAction() == MotionEvent.ACTION_DOWN) {
            View v = getCurrentFocus();
            if (v instanceof TextInputEditText) {
                Rect outRect = new Rect();
                v.getGlobalVisibleRect(outRect);
                if (!outRect.contains((int)event.getRawX(), (int)event.getRawY())) {
                    v.clearFocus();
                    hideKeyboard(v);
                }
            }
        }
        return super.dispatchTouchEvent(event);
    }
}