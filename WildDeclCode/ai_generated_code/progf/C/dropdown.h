#include <stdio.h>
#include <stdlib.h>
#include <conio.h>

#define ESC "\033"
#define UP 72
#define DOWN 80
#define ENTER 13

struct ColorString
{
  char *string; // the option's string to display
  int color;    // ANSI color code
};

union Option
{
  char *string;                   // A char pointer for normal options
  struct ColorString colorString; // A ColorString struct for colorful options
};

/*
# Dropdown
A function that creates a dropdown menu with the given options and returns the selected option

## Parameters
- `options`: An array of Option unions containing the options to display
- `num_options`: The number of options in the array
- `selected`: The index of the option to select by default
- `colorful`: A flag to indicate whether the options are colorful or not

## Returns
The index of the selected option

## Example
```c
union Option options[] = {{"Option 1"}, {"Option 2"}, {"Option 3"}};
int selected = dropdown(options, 3, 0, 0);
printf("You selected: %s\n", options[selected].string);

struct ColorString colorOptions[] = {{"Red", 31}, {"Green", 32}, {"Blue", 34}};
for (int i = 0; i < 3; i++)
{
  options[i].colorString = colorOptions[i]; // Assign the ColorString structs to the Option unions
}
selected = dropdown(options, 3, 0, 1);
printf("You selected: %s\n", options[selected].colorString.string);
```

## Acknowledgements
This function was Crafted via basic programming aids-4 (Bing)
*/
int dropdown(
    union Option options[],
    int num_options,
    int selected,
    int colorful)
{
  int key; // The key pressed by the user

  while (1) // Loop until the user presses enter
  {
    // Print the options with ANSI escape codes to move the cursor and change the color
    for (int i = 0; i < num_options; i++)
    {
      if (i == selected) // If this is the selected option, print it in reverse color
      {
        if (colorful) // If the options are colorful, print them with their background colors
          printf(ESC "[%dm" ESC "[7m %s " ESC "[0m\n", options[i].colorString.color, options[i].colorString.string);
        else // Otherwise, print them as normal strings
          printf(ESC "[7m %s " ESC "[0m\n", options[i].string);
      }
      else // Otherwise, print them in normal color
      {
        if (colorful) // If the options are colorful, print them with their foreground colors
          printf(ESC "[%dm %s " ESC "[0m\n", options[i].colorString.color, options[i].colorString.string);
        else // Otherwise, print them as normal strings
          printf(" %s \n", options[i].string);
      }
    }

    key = _getch(); // Get the key pressed by the user

    if (key == 0 || key == 224) // If the key is a special key (such as an arrow key), get the next key
      key = _getch();

    if (key == UP) // If the key is the up arrow, move the selection up
    {
      selected--;
      if (selected < 0) // If the selection goes beyond the first option, wrap around to the last option
        selected = num_options - 1;
    }
    else if (key == DOWN) // If the key is the down arrow, move the selection down
    {
      selected++;
      if (selected >= num_options) // If the selection goes beyond the last option, wrap around to the first option
        selected = 0;
    }
    else if (key == ENTER) // If the key is enter, break out of the loop
      break;
    else if (key == 27) // If the key is escape, return -1 to indicate that the user cancelled the selection
      return -1;

    printf(ESC "[%dA", num_options); // Move the cursor up by the number of options
  }

  return selected; // Return the index of the selected option
}
