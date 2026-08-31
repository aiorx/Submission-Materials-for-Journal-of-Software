@Override
public void onResponse(Call<List<users>> call, Response<List<users>> response) {
    if (response.isSuccessful() && response.body() != null) {

        boolean validUser = false;
        for (users user : response.body()) {
            // check if user exist
            if (user.getUsername().equalsIgnoreCase(enteredUsername)) {
                try {
                    // password is encrypted so need to decrypt
                    // Supported via standard programming aids for decryption - edit by erika
                    String decryptedPassword = EncryptionUtil.decrypt(user.getPassword());

                    // if password is correct, login is successful
                    if (decryptedPassword.equals(enteredPassword)) {
                        validUser = true;
                        // create a session then login
                        SessionManager.getInstance(getContext()).setCurrentUser(user);
                        startActivity(new Intent(getContext(), home.class));
                        break;
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                    Toast.makeText(getContext(), "Error decrypting password", Toast.LENGTH_SHORT).show();
                }
            }

        }

        // output error model
        if (!validUser) {
            DialogAreYouConfirmBinding bb = DialogAreYouConfirmBinding.inflate(getLayoutInflater());
            //bb.cancelBtn.setOnClickListener(v1 -> dialog.dismiss());
            bb.confirmBtn.setOnClickListener(v1 -> dialog.dismiss());
            dialog.setContentView(bb.getRoot());
            dialog.show();
            //Toast.makeText(getContext(), "Please fill in all fields", Toast.LENGTH_SHORT).show();
            return;
            //Log.e("LOGIN", "Invalid credentials!");
        }
    } else {
        Log.e("NOMLYPROCESS", "API response error: " + response.code());
        DialogError400Binding bb = DialogError400Binding.inflate(getLayoutInflater());
        //bb.cancelBtn.setOnClickListener(v1 -> dialog.dismiss());
        bb.confirmBtn.setOnClickListener(v1 -> dialog.dismiss());
        dialog.setContentView(bb.getRoot());
        dialog.show();
    }
}