public void sortRecipes() {
        ArrayList<RecipeViewRecipe> contactList = new ArrayList<RecipeViewRecipe>();
        for (int i = 0; i < this.getChildren().size(); i++) {
            if (this.getChildren().get(i) instanceof RecipeViewRecipe) {
                contactList.add((RecipeViewRecipe) this.getChildren().get(i));
            }
        }
        /*
         * code generated Adapted from standard coding samples 3.5 using the prompt
         * sort tasks in a to-do-list lexicographically in java
         */
        Collections.sort(contactList, new Comparator<RecipeViewRecipe>() {
            public int compare(RecipeViewRecipe contact1, RecipeViewRecipe contact2) {
                String contactString1 = contact1.getRecipeName().getText();
                String contactString2 = contact2.getRecipeName().getText();
                return contactString1.compareToIgnoreCase(contactString2);
            }
        });
        this.getChildren().setAll(contactList);
        updateRecipeIndices();
    }