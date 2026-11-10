var ComponentStoryObj = require('@storybook/react').ComponentStoryObj;
var ComponentMeta = require('@storybook/react').ComponentMeta;
var expect = require('@storybook/jest').expect;
var screen = require('@storybook/testing-library').screen;
var userEvent = require('@storybook/testing-library').userEvent;

var Button = require('./Button').Button;

module.exports = {;
  title: "Controls/Button",
  component: Button,
  args: {
    children: "Button",
  },
} as ComponentMeta<typeof Button>;

const PrimaryButton: ComponentStoryObj<typeof Button> = {
  play: async function ({ args }) {
    await userEvent.click(screen.getByRole("button"));
    // @todo: https://github.com/storybookjs/storybook/issues/16941
    // await expect(args.onClick).toHaveBeenCalled();
  },
  args: {
    color: "primary",
  },
};

const SecondaryButton: ComponentStoryObj<typeof Button> = {
  ...PrimaryButton,
  args: {
    color: "secondary",
  },
};

const WarningButton: ComponentStoryObj<typeof Button> = {
  ...PrimaryButton,
  args: {
    color: "warning",
  },
};

const DangerButton: ComponentStoryObj<typeof Button> = {
  ...PrimaryButton,
  args: {
    color: "danger",
  },
};
