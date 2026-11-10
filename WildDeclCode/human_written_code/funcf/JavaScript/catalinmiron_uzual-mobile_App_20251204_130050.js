```js
_loadResourcesAsync = async () => {
  this.apolloClient = await setupApolloClient();

  return Promise.all([
    Asset.loadAsync([
      require('./assets/images/buymeacoffee-logo.png'),
      require('./assets/images/youtube-logo.png'),
      require('./assets/images/brain.png')
    ]),
    Font.loadAsync({
      // This is the font that we are using for our tab bar
      ...Icon.Ionicons.font,
      // We include SpaceMono because we use it in HomeScreen.js. Feel free
      // to remove this if you are not using it in your app
      'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
      Menlo: require('./assets/fonts/Menlo-Regular.ttf')
    })
  ]);
};
```