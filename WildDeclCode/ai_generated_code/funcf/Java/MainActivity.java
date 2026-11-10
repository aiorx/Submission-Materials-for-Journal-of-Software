@Override
protected void onSaveInstanceState(@NonNull Bundle outState) {
    //Code suggested by ChatGPT, modified
    super.onSaveInstanceState(outState);
    //before being destroyed, the active fragment will save a tag which will be saved for when fragments have to be restored
    outState.putString(ACTIVE_TAG, activeFragment.getTag());
}