```tsx
interface ThemedCanvasProps extends React.ComponentProps<typeof Canvas> {
  /**
   * Space Kit specific theme to render the preview with.
   *
   * Remember, this will only affect the preview pane, not the storybook
   * stories. Stories must also include themed backgrounds
   */
  theme?: "light" | "dark";
}
```