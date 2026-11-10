//Mock GardenService to only return testgarden
//Supported via standard GitHub programming aids 🤪
when(gardenService.getGardens()).thenReturn(Collections.singletonList(testGarden));
when(gardenService.getOwnedGardens(any(Long.class))).thenReturn(Collections.singletonList(testGarden));
when(gardenService.findGarden(any(Long.class))).thenReturn(Optional.of(testGarden));