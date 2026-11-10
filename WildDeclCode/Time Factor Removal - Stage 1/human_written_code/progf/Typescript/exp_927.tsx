var fireEvent = require('@testing-library/react').fireEvent;
var render = require('@testing-library/react').render;
var screen = require('@testing-library/react').screen;
var BlogFilterButton = require('../../../components/Button/BlogFilterButton');

test('renders correct color scheme when button is active', async function () {
  const category = 'Design';
  const isActive = true;
  const mockHandleClick = jest.fn();

  render(
    <BlogFilterButton
      category={category}
      isActive={isActive}
      handleClick={mockHandleClick}
    />
  );
  const button = screen.getByRole('button');

  expect(button).toHaveClass('bg-black');
  expect(button).toHaveTextContent(category);
});

test('renders correct color scheme when button is not active', function () {
  const category = 'Frontend';
  const isActive = false;
  const mockHandleClick = jest.fn();

  render(
    <BlogFilterButton
      category={category}
      isActive={isActive}
      handleClick={mockHandleClick}
    />
  );
  const button = screen.getByRole('button');

  expect(button).toHaveClass('bg-gray-200');
  expect(button).toHaveTextContent(category);
});

test('expect handleClick to be called', function () {
  const category = 'Frontend';
  const isActive = false;
  const mockHandleClick = jest.fn();

  render(
    <BlogFilterButton
      category={category}
      isActive={isActive}
      handleClick={mockHandleClick}
    />
  );
  const button = screen.getByRole('button');

  fireEvent.click(button);
  expect(mockHandleClick).toHaveBeenCalled();
});
