import '@testing-library/jest-dom'; // I use this for custom matchers like toBeInTheDocument
import { render, screen } from '@testing-library/react'; // I use this for rendering components in my tests
import Home from '../page'; // I'm importing my Home page component from the parent directory (src/app/page.tsx)

// I use 'describe' to group my related tests. Here, I'm describing tests for the Home Page.
describe('Home Page', () => {
  // I use 'it' to define an individual test case.
  // In this test, I check if the main heading "Welcome to Kasese Socials" renders.
  it('should render the main heading "Welcome to Kasese Socials"', () => {
    render(<Home />); // Step 1: I render the Home component into a virtual DOM.

    // Step 2: I find an element with the 'heading' accessibility role and level 1 (which corresponds to an <h1> tag).
    // I also specify that its accessible name (usually its text content) should match the regular expression /Welcome to Kasese Socials/i (case-insensitive).
    const headingElement = screen.getByRole('heading', {
      name: /Welcome to Kasese Socials/i, // This is the text I expect to find in the heading
      level: 1, // I expect it to be an <h1>
    });

    // Step 3: I assert that the found heading element is actually present in the document.
    expect(headingElement).toBeInTheDocument();
  });
});
