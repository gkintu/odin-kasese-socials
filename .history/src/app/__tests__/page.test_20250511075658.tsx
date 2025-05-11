import '@testing-library/jest-dom'; // This is used for custom matchers like toBeInTheDocument
import { render, screen } from '@testing-library/react'; // This is used for rendering components in tests
import Home from '../page'; // The Home page component is imported from the parent directory (src/app/page.tsx)

// 'describe' is used to group related tests. Here, it's describing tests for the Home Page.
describe('Home Page', () => {
  // 'it' is used to define an individual test case.
  // In this test, it checks if the main heading "Welcome to Kasese Socials" renders.
  it('should render the main heading "Welcome to Kasese Socials"', () => {
    render(<Home />); // Step 1: The Home component is rendered into a virtual DOM.

    // Step 2: An element with the 'heading' accessibility role and level 1 (which corresponds to an <h1> tag) is found.
    // It also specifies that its accessible name (usually its text content) should match the regular expression /Welcome to Kasese Socials/i (case-insensitive).
    const headingElement = screen.getByRole('heading', {
      name: /Welcome to Kasese Socials/i, // This is the text expected to be found in the heading
      level: 1, // It is expected to be an <h1>
    });

    // Step 3: It asserts that the found heading element is actually present in the document.
    expect(headingElement).toBeInTheDocument();
  });
});