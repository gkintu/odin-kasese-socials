Kasese Socials Dev Diary Part 2: Frontend First with Dummy DataHey everyone, and welcome back to the Kasese Socials Dev Diary! In Part 1: Laying the Groundwork (phase-0.md), we got our Next.js project set up, configured our linters and formatters, and laid the initial TDD foundation by writing our very first (albeit simple) test. We meticulously followed the kasese socials prd.md, covering the Introduction, Goals, and Section 7 (Phase 0: Setup, Boilerplate & TDD Foundation), which corresponded to PRD Functional Requirements FR0.1-FR0.5.Now, as promised in the "What's Next?" section of phase-0.md, we're diving into Phase 1: Frontend First with Dummy Data, as outlined in Section 7 of our PRD. Our primary focus for this installment will be kicking off the User Authentication features, starting with the User Registration form (PRD Requirement R1.1).But before we can build beautiful forms, we need the right tools for styling. If you recall, we deferred installing Tailwind CSS during the create-next-app process. So, our first order of business is to get Tailwind CSS and its companion, Headless UI, integrated into our project.Let's get started!1. Catching Up: What We Did Last TimeJust a quick refresher from phase-0.md:
We initialized our Next.js project (kasese-socials) with TypeScript and ESLint.
We set up Prettier for consistent code formatting.
We wrote a basic test for our home page (src/app/page.tsx) to ensure our testing environment (Jest & React Testing Library) was working.
We established our commitment to Test-Driven Development (TDD) as a guiding principle.
With that foundation in place, we're ready to build some actual UI!2. Setting the Stage: Styling & UI Libraries (PRD Section 6)Our PRD (Section 6: Technical Stack) clearly states we'll be using Tailwind CSS for styling and Headless UI for accessible, unstyled components. It's time to get them into our project.2.1. Installing and Configuring Tailwind CSS (v3)We opted to install Tailwind CSS manually to better understand the setup process. We'll be using Tailwind CSS v3, which offers a mature ecosystem and a straightforward setup for Next.js projects.1 While newer versions exist, v3 provides stability and ease of learning, which is perfect for our current needs.

2.1.1. Install Tailwind CSS and its peer dependencies
Open your terminal in the project root (kasese-socials) and run the following command:
Bashnpm install -D tailwindcss@^3 postcss autoprefixer

or if you're using Yarn:
Bashyarn add -D tailwindcss@^3 postcss autoprefixer

What this does: This command installs three crucial packages as development dependencies:

tailwindcss@^3: The core Tailwind CSS v3 library.
postcss: A tool for transforming CSS with JavaScript plugins. Tailwind CSS is itself a PostCSS plugin.
autoprefixer: A PostCSS plugin that automatically adds vendor prefixes to CSS rules, ensuring better cross-browser compatibility.

Why it's needed (PRD Section 6): These are the foundational packages required to compile Tailwind's utility classes into actual CSS that browsers can understand, aligning with our PRD's choice of Tailwind CSS.

2.1.2. Initialize Tailwind CSS
Next, generate the Tailwind CSS and PostCSS configuration files:
Bashnpx tailwindcss init -p

What this does: This command creates two important files in your project root:

tailwind.config.js: This is where you'll customize your Tailwind installation, like defining custom colors, fonts, or extending existing utilities.
postcss.config.js: This file configures PostCSS. The -p flag ensures this file is generated alongside tailwind.config.js. 1

Why it's needed: These configuration files are essential. tailwind.config.js tells Tailwind how to process your styles (e.g., which files to scan for classes), and postcss.config.js tells Next.js (which uses PostCSS under the hood) how to build the CSS.

2.1.3. Configure tailwind.config.js
Open the newly created tailwind.config.js file and update the content array. This array tells Tailwind which files to scan for class names. Tailwind uses this information to "tree-shake" unused styles, meaning only the CSS classes you actually use in your project will be included in the final CSS bundle, keeping it as small as possible. This is a critical optimization, and getting the paths right ensures your styles work as expected.
Modify your tailwind.config.js to look like this:
JavaScript// tailwind.config.js
/** @type {import('tailwindcss').Config} \*/
module.exports = {
content: [
"./src/app/**/_.{js,ts,jsx,tsx,mdx}",
"./src/components/\*\*/_.{js,ts,jsx,tsx,mdx}",
// If you plan to have components in other directories, like a 'features' folder, add them here:
// "./src/features/\*_/_.{js,ts,jsx,tsx,mdx}",
],
theme: {
extend: {},
},
plugins:,
}

What this does: We're telling Tailwind CSS to look for class names in all JavaScript, TypeScript, JSX, TSX, and MDX files within the src/app directory (for our pages and layouts) and the src/components directory (where we'll build our reusable UI components). 1
Why it's needed: This configuration is crucial for Tailwind's Just-in-Time (JIT) engine to generate styles on demand. If a file path is missing here, Tailwind classes used in those files won't be generated, and your UI won't be styled as expected. It's important to keep this array updated as your project structure evolves.

2.1.4. Configure postcss.config.js
The npx tailwindcss init -p command should have already created a postcss.config.js file with the correct basic configuration for Tailwind CSS v3. It should look like this:
JavaScript// postcss.config.js
module.exports = {
plugins: {
tailwindcss: {},
autoprefixer: {},
},
}

What this does: This file configures PostCSS to use two plugins:

tailwindcss: This plugin processes your Tailwind directives (like @tailwind base;) and utility classes.
autoprefixer: As mentioned earlier, this adds vendor prefixes to CSS properties for better browser compatibility. 1

Why it's needed: This setup acts as the bridge, allowing Tailwind's special syntax and utility-first approach to be transformed into standard CSS that all modern browsers can understand.

2.1.5. Import Tailwind directives into globals.css
Finally, you need to tell your application to actually use Tailwind's styles. Open the ./src/app/globals.css file (which should have been created by create-next-app) and replace its contents with the following Tailwind directives:
CSS/_./src/app/globals.css _/
@tailwind base;
@tailwind components;
@tailwind utilities;

/_ You can add other global styles or custom base styles below this line if needed _/

What this does: These are special Tailwind-specific at-rules that get processed by PostCSS:

@tailwind base;: Injects Tailwind's base styles, which include a modern CSS reset (like Preflight) to smooth out browser inconsistencies.
@tailwind components;: Injects Tailwind's component classes. While Tailwind is primarily utility-first, this layer can be used for more complex, reusable component styles (though we'll mostly rely on utilities).
@tailwind utilities;: Injects all of Tailwind's utility classes (like text-blue-500, p-4, flex, etc.). 1

Why it's needed: This makes Tailwind's styles globally available throughout your application. Next.js, by default, imports globals.css in your root layout (src/app/layout.tsx), so these styles will be applied everywhere.

2.2. Verifying Tailwind CSSWith the setup complete, let's do a quick check to ensure Tailwind is working. Modify your src/app/page.tsx file slightly. For example, let's change the heading's color and font size.TypeScript// src/app/page.tsx (example modification)
import Image from 'next/image'

export default function Home() {
return (
<main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-100">
<div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
{/_... existing content... _/}
</div>

      {/* Let's add a more prominent Kasese Socials welcome message */}
      <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-full sm:before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full sm:after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]">
        <h1 className="text-5xl font-bold text-indigo-600 hover:text-indigo-800 transition-colors">
          Welcome to Kasese Socials!
        </h1>
      </div>
      {/* You can remove or modify the default Next.js links/cards below if you wish */}
      <div className="mb-32 mt-16 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
        {/*... existing content... */}
      </div>
    </main>

)
}
Now, run your development server:Bashnpm run dev
Open your browser to http://localhost:3000. You should see your home page with the "Welcome to Kasese Socials!" text styled in a larger font size and an indigo color. If you hover over it, the color should change slightly. The background of the page should also be a light gray.
What this does: This simple modification and visual check provides immediate feedback that our Tailwind CSS setup is correctly processing utility classes and applying them.
Why it's needed: It's always a good idea to perform a quick sanity check after configuring a new tool or library. This ensures we haven't missed a step and can proceed with confidence.
2.3. Installing and Setting Up Headless UI (PRD Section 6)Next up is Headless UI. As per our PRD, this library will provide us with unstyled, fully accessible UI components. This is fantastic because it handles all the complex logic and accessibility concerns (like keyboard navigation, ARIA attributes) for components like dropdowns, modals, tabs, etc., while giving us complete control over their appearance using Tailwind CSS.3 Building accessible UIs is a cornerstone of modern web development, and Headless UI gives us a significant head start.

2.3.1. Installation
Install Headless UI using npm or yarn:
Bashnpm install @headlessui/react

or
Bashyarn add @headlessui/react

What this does: This command installs the Headless UI React library from npm.3
Why it's needed (PRD Section 6): The PRD specifies Headless UI for building our UI components. It allows us to focus on the unique look and feel of Kasese Socials without reinventing the wheel for common interactive patterns.

2.3.2. A Note on 'use client' in Next.js App Router
Many Headless UI components are interactive and manage their own internal state (e.g., whether a dropdown is open or closed). In the Next.js App Router environment, components that use React Hooks like useState or useEffect (which Headless UI components often rely on internally) must be marked as Client Components. You do this by adding the 'use client'; directive at the very top of the .tsx file where you use these Headless UI components or manage such state.5

What this does: The 'use client'; directive tells Next.js that the component (and its children, if they are also client components) should be rendered on the client-side, allowing them to use browser APIs and React's client-side capabilities.
Why it's needed: By default, components in the Next.js app directory are React Server Components, which cannot use client-side hooks or interactivity. Since Headless UI components are inherently interactive and stateful, the pages or components directly using them will often need to be Client Components.

We might not use Headless UI extensively for our very first registration form (as it's relatively simple), but having it installed and understanding its role is crucial for the more complex components we'll build later, like navigation menus, modals for posts, or user settings dialogs.3. Building Our Registration Form: A TDD Journey (PRD R1.1)Alright, with our styling and UI component library foundation in place, it's time to tackle our first major feature: the User Registration Form (PRD R1.1). And we're going to do this using Test-Driven Development (TDD)!The TDD Philosophy: Red, Green, RefactorLet's quickly revisit the TDD cycle 8:
RED: Write a test that describes a small piece of functionality you want to add. Run your tests; this new test should fail because the code to make it pass doesn't exist yet. This failure is important – it proves your test is working correctly and testing the right thing.
GREEN: Write the absolute minimum amount of code necessary to make the failing test pass. Don't worry about perfection at this stage; just get it to green.
REFACTOR: Now that your test is passing, you can clean up your code. Improve its structure, readability, or performance without changing its external behavior (i.e., all your tests should still pass after refactoring).
This iterative cycle might feel a bit slow for very simple components, but its rigor pays off immensely as features become more complex. It leads to better-designed, more maintainable code and gives you a safety net of tests that document how your application is supposed to work.Setting up Jest and React Testing LibraryWhen we initialized our Next.js project with create-next-app, it came with Jest pre-configured. However, to make our testing experience even better, especially for DOM assertions and simulating user events, we need a couple more packages: @testing-library/jest-dom for custom Jest matchers (like toBeInTheDocument()) and @testing-library/user-event for more realistic user interaction simulations.11If you haven't already, install them:Bashnpm install --save-dev @testing-library/jest-dom @testing-library/user-event
orBashyarn add --dev @testing-library/jest-dom @testing-library/user-event
Using userEvent is generally preferred over fireEvent (from @testing-library/react) because it simulates user interactions more closely to how they happen in a real browser, dispatching all the relevant events (e.g., keyDown, keyPress, keyUp for typing).11 This leads to more robust and reliable tests.Next, we need to tell Jest to use the custom matchers from @testing-library/jest-dom. Create a file named jest.setup.js (or jest.setup.ts if you prefer) in your project's root directory:JavaScript// jest.setup.js
import '@testing-library/jest-dom';
Then, update your jest.config.js (or jest.config.mjs) file to tell Jest about this setup file. If you don't have a jest.config.js file, you might have a jest section in your package.json, or Next.js might be handling it implicitly. If you have jest.config.js (or jest.config.mjs), add or modify the setupFilesAfterEnv option:JavaScript// jest.config.js or jest.config.mjs
// If you're using the default Next.js Jest config, it might look like this:
const nextJest = require('next/jest')

const createJestConfig = nextJest({
dir: './', // Path to our Next.js app to load next.config.js and.env files
})

// Add any custom config to be passed to Jest
const customJestConfig = {
setupFilesAfterEnv:, // <== ADD THIS LINE
testEnvironment: 'jest-environment-jsdom',
// Add more setup options before each test is run
// setupFilesAfterEnv:,
}

module.exports = createJestConfig(customJestConfig)
Make sure the path <rootDir>/jest.setup.js correctly points to your setup file.Creating the Component FilesLet's create the files for our registration form component and its tests. We'll organize our authentication-related components under a src/components/Auth directory.Create the following files:
src/components/Auth/RegistrationForm.tsx
src/components/Auth/RegistrationForm.test.tsx
Now, let the TDD cycle begin!3.1. RED: Test for Basic Form Rendering (RegistrationForm.test.tsx)We'll start by writing a test to ensure our RegistrationForm component (which doesn't really exist yet) will render the essential UI elements: an email input, a password input, and a submit button. Using queries like getByLabelText or getByRole is preferred over querying by class names or data-testids (where possible) because it encourages writing more accessible HTML and makes tests less brittle to styling or structural changes.8TypeScript// src/components/Auth/RegistrationForm.test.tsx
import { render, screen } from '@testing-library/react';
import RegistrationForm from './RegistrationForm'; // This will initially cause an error or warning

describe('RegistrationForm', () => {
it('should render email input, password input, and submit button', () => {
render(<RegistrationForm onSubmit={jest.fn()} />); // Pass a mock onSubmit for now

    // Using getByLabelText is preferred for accessibility and robustness
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();

    // For buttons, getByRole is a good choice
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();

});
});

What this does: This defines our first test case.

describe: Groups related tests together.
it: Defines an individual test case.
render(<RegistrationForm onSubmit={jest.fn()} />): Renders our (soon-to-be-created) component. We're passing a jest.fn() as the onSubmit prop because our component will eventually need it, and it's good practice for testability (we'll cover this more later).
screen.getByLabelText(/email/i): Tries to find an input field associated with a label containing the text "email" (case-insensitive).
screen.getByRole('button', { name: /register/i }): Tries to find a button element with the accessible name "Register".
toBeInTheDocument(): Asserts that the found element is present in the DOM. 11

Why it's needed (PRD R1.1): This test directly reflects the core UI elements stipulated by PRD R1.1 for user registration – fields for email and password, and a mechanism (button) to submit the registration.
How it fits into TDD: This is our "RED" step. If you run npm test (or yarn test) now, this test will fail spectacularly because RegistrationForm.tsx is either empty or doesn't exist in a way that exports a component, and even if it did, it wouldn't render these elements.
3.2. GREEN: Minimal RegistrationForm.tsx StructureNow, let's write the absolute minimum code in src/components/Auth/RegistrationForm.tsx to make our first test pass.TypeScript// src/components/Auth/RegistrationForm.tsx
import React from 'react';

// We'll define the props type later when we actually use onSubmit
interface RegistrationFormProps {
onSubmit: (data: any) => void; // Temporary 'any' for data
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ onSubmit }) => {
return (
<form onSubmit={(e) => { e.preventDefault(); onSubmit({}); }}>
<div>
<label htmlFor="email">Email</label>
<input type="email" id="email" name="email" />
</div>
<div>
<label htmlFor="password">Password</label>
<input type="password" id="password" name="password" />
</div>
<button type="submit">Register</button>
</form>
);
};

export default RegistrationForm;

What this does: We've created a very basic React functional component that returns a form with two labeled inputs (for email and password) and a submit button. The htmlFor attribute on labels is linked to the id of the inputs, which is crucial for getByLabelText to work and for general accessibility. We've also added a basic onSubmit prop and handler to prevent errors for now.
Why it's needed: This is the simplest possible implementation to satisfy our first test.
How it fits into TDD: This is the "GREEN" step. Run npm test again. Your first test should now pass!
3.3. Integrating React Hook Form (PRD Section 6)Our PRD (Section 6) specifies React Hook Form for handling forms. This is an excellent choice because it's performant (primarily uses uncontrolled inputs), makes validation easy, and significantly reduces boilerplate code compared to managing form state manually.11First, let's install it:Bashnpm install react-hook-form
orBashyarn add react-hook-form
Now, let's define the TypeScript types for our form values. This gives us type safety and makes our code easier to understand and maintain.13Add this at the top of src/components/Auth/RegistrationForm.tsx (or you could create a separate types.ts file if you prefer):TypeScript// At the top of src/components/Auth/RegistrationForm.tsx

// Define the type for our form values
type RegistrationFormValues = {
email: string;
password: string;
};

// Update the props interface
interface RegistrationFormProps {
onSubmit: (data: RegistrationFormValues) => void; // Use the specific type
}

What this does: We've created a RegistrationFormValues type that clearly defines the shape of the data our registration form will handle: an email string and a password string. We've also updated our RegistrationFormProps to use this type.
Why it's needed: Using TypeScript types helps us catch errors early (during development rather than at runtime) and makes our component's API (its props) explicit.
3.4. RED: Test User Input HandlingOur form renders, but can the user actually type into the fields? Let's write a test for that.TypeScript// Add to src/components/Auth/RegistrationForm.test.tsx
import userEvent from '@testing-library/user-event'; // Make sure this is imported at the top

//... inside describe('RegistrationForm', () => {... })
it('should allow users to enter email and password', async () => {
const user = userEvent.setup(); // Setup userEvent
render(<RegistrationForm onSubmit={jest.fn()} />);

const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement; // Cast for.value
const passwordInput = screen.getByLabelText(/password/i) as HTMLInputElement; // Cast for.value

await user.type(emailInput, 'test@example.com');
await user.type(passwordInput, 'password123');

expect(emailInput.value).toBe('test@example.com');
expect(passwordInput.value).toBe('password123');
});

What this does:

userEvent.setup(): Initializes the user-event library.
await user.type(emailInput, 'test@example.com'): Simulates a user typing "test@example.com" into the email field. This is an asynchronous action.
expect(emailInput.value).toBe('test@example.com'): Checks if the value property of the email input element now holds the typed text. We cast the elements to HTMLInputElement to satisfy TypeScript about the .value property. 11

Why it's needed: This test verifies that our input fields are not just static elements but can actually capture user input, a fundamental requirement for any form.
How it fits into TDD: This is our next "RED" step. This test will likely fail (or pass vacuously if the inputs are simple HTML inputs without React Hook Form yet). With plain HTML inputs, it might pass, but it's not testing React Hook Form's involvement yet. The key is that once we integrate React Hook Form, we need to ensure its register method correctly wires up the inputs.
3.5. GREEN: Implement Input Handling with useForm and registerNow, let's integrate React Hook Form into RegistrationForm.tsx to manage the input fields.TypeScript// src/components/Auth/RegistrationForm.tsx
import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form'; // Import useForm and SubmitHandler

type RegistrationFormValues = {
email: string;
password: string;
};

interface RegistrationFormProps {
onSubmit: SubmitHandler<RegistrationFormValues>; // SubmitHandler is a RHF type
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ onSubmit }) => {
const { register, handleSubmit } = useForm<RegistrationFormValues>();

// The actual submission logic will be handled by the onSubmit prop
// passed to handleSubmit.

return (
// handleSubmit will validate inputs before calling our onSubmit prop
<form onSubmit={handleSubmit(onSubmit)}>
<div>
<label htmlFor="email">Email</label>
<input
type="email"
id="email"
{...register('email')} // Register the email input
/>
</div>
<div>
<label htmlFor="password">Password</label>
<input
type="password"
id="password"
{...register('password')} // Register the password input
/>
</div>
<button type="submit">Register</button>
</form>
);
};

export default RegistrationForm;

What this does:

import { useForm, SubmitHandler } from 'react-hook-form';: We import the necessary hooks and types. SubmitHandler is a useful type from React Hook Form for our submission function.
const { register, handleSubmit } = useForm<RegistrationFormValues>();: We call the useForm hook, providing our RegistrationFormValues type for type safety. This hook returns several useful functions and objects:

register: This function is used to "register" our input fields with React Hook Form. It handles value tracking, validation, etc. We spread its return value ({...register('fieldName')}) onto our input elements.
handleSubmit: This function wraps our actual form submission handler (the onSubmit prop in our case). It will first trigger validation, and only if validation passes will it call our onSubmit function with the form data. 13

Why it's needed: This is the standard and recommended way to integrate React Hook Form for uncontrolled inputs. It efficiently manages form state and provides a clean API for validation and submission.
How it fits into TDD: This is the "GREEN" step for our input handling test. Run npm test. The test for user input should now pass, confirming that React Hook Form is correctly capturing the values.
3.6. RED: Test Validation Logic (Required, Email Format, Password Length)A registration form isn't very useful without validation! PRD R1.1 implicitly requires basic validation for email (it should look like an email) and password (it should exist, and probably have a minimum length for security). Let's write tests for these rules:
Email and password fields are required.
The email field must contain a valid email format.
The password field must meet a minimum length (let's say 6 characters for now, a common default).
TypeScript// Add to src/components/Auth/RegistrationForm.test.tsx
//... (ensure userEvent is imported)

it('should show error messages for required fields when submitted empty', async () => {
const user = userEvent.setup();
render(<RegistrationForm onSubmit={jest.fn()} />);
const submitButton = screen.getByRole('button', { name: /register/i });

await user.click(submitButton); // Click without filling anything

// findByText is useful for elements that appear asynchronously (like error messages after validation)
expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
expect(await screen.findByText(/password is required/i)).toBeInTheDocument();
});

it('should show an error message for an invalid email format', async () => {
const user = userEvent.setup();
render(<RegistrationForm onSubmit={jest.fn()} />);

const emailInput = screen.getByLabelText(/email/i);
const submitButton = screen.getByRole('button', { name: /register/i });

await user.type(emailInput, 'invalidemail'); // Type an invalid email
await user.click(submitButton); // Attempt to submit

expect(await screen.findByText(/invalid email format/i)).toBeInTheDocument();
});

it('should show an error message for a password that is too short', async () => {
const user = userEvent.setup();
render(<RegistrationForm onSubmit={jest.fn()} />);

const passwordInput = screen.getByLabelText(/password/i);
const submitButton = screen.getByRole('button', { name: /register/i });

await user.type(passwordInput, '123'); // Type a short password
await user.click(submitButton); // Attempt to submit

expect(await screen.findByText(/password must be at least 6 characters/i)).toBeInTheDocument();
});

What this does: These tests simulate various invalid user inputs:

Submitting the form with empty fields.
Entering an incorrectly formatted email.
Entering a password that's too short.
After each action, we use await screen.findByText(...) to check if the corresponding error message appears on the screen. findBy\* queries are suitable here because React Hook Form's validation and the subsequent rendering of error messages can be asynchronous. 11

Why it's needed (PRD R1.1): Proper validation and clear error messages are crucial for a good user experience. They guide the user to correctly fill out the form, preventing frustration and ensuring data quality.
How it fits into TDD: This is the "RED" step. All these new validation tests will fail because our form currently has no validation rules and doesn't display any error messages.
3.7. GREEN: Implement Validation Rules and Error DisplayLet's make these validation tests pass by adding rules to our register calls and displaying error messages from React Hook Form's formState.TypeScript// src/components/Auth/RegistrationForm.tsx
import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';

type RegistrationFormValues = {
email: string;
password: string;
};

interface RegistrationFormProps {
onSubmit: SubmitHandler<RegistrationFormValues>;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ onSubmit }) => {
const { register, handleSubmit, formState: { errors } } = useForm<RegistrationFormValues>({
mode: 'onSubmit', // Validate on submit
reValidateMode: 'onChange', // Re-validate on change after first submission attempt (good UX)
});

return (
<form onSubmit={handleSubmit(onSubmit)}>
<div>
<label htmlFor="email">Email</label>
<input
type="email"
id="email"
{...register('email', {
required: 'Email is required',
pattern: {
value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, // Standard email regex
message: 'Invalid email format',
},
})}
aria-invalid={errors.email? "true" : "false"} // For accessibility
/>
{/_ Display error message for email field _/}
{errors.email && (
<span role="alert" style={{ color: 'red', fontSize: '0.875rem' }}> {/_ Basic styling for now _/}
{errors.email.message}
</span>
)}
</div>

      <div>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          {...register('password', {
            required: 'Password is required',
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters',
            },
          })}
          aria-invalid={errors.password? "true" : "false"} // For accessibility
        />
        {/* Display error message for password field */}
        {errors.password && (
          <span role="alert" style={{ color: 'red', fontSize: '0.875rem' }}> {/* Basic styling for now */}
            {errors.password.message}
          </span>
        )}
      </div>
      <button type="submit">Register</button>
    </form>

);
};

export default RegistrationForm;

What this does:

formState: { errors }: We destructure errors from the formState object returned by useForm. This object will contain any validation errors.
useForm<RegistrationFormValues>({ mode: 'onSubmit', reValidateMode: 'onChange' }): We've added some configuration options to useForm. mode: 'onSubmit' means validation will run when the form is submitted. reValidateMode: 'onChange' means that after the first submission attempt, fields will be re-validated as the user types, providing instant feedback. This is generally a good user experience.
Validation rules in register:

For email: We've added required: 'Email is required' and a pattern rule with a regular expression for email validation, along with a corresponding message.
For password: We've added required: 'Password is required' and a minLength rule.

Displaying errors: {errors.email && <span role="alert">...</span>}. If an error exists for a field (e.g., errors.email is not undefined), we render a span containing the error message (errors.email.message). The role="alert" attribute is important for accessibility, as it signals to assistive technologies that this is an important message.
aria-invalid={errors.email? "true" : "false"}: This accessibility attribute is added to inputs to indicate whether their current value is invalid. 13

Why it's needed: This implements the core validation logic. The error messages provide crucial feedback to the user, and the accessibility attributes ensure the form is usable by a wider range of people.
How it fits into TDD: This is our "GREEN" step for the validation tests. Run npm test. All your validation tests should now pass!
3.8. RED: Test Mock Form SubmissionOur form validates, but does it actually do anything when submitted correctly? We need to test that our onSubmit prop is called with the correct form data when the inputs are valid.To make our component more testable and reusable, it's good practice for the component itself not to contain the actual submission logic (e.g., an API call). Instead, it should receive an onSubmit function as a prop. We've already set up our RegistrationFormProps to expect an onSubmit prop.TypeScript// Add to src/components/Auth/RegistrationForm.test.tsx
//...

it('should call the onSubmit prop with form data when the form is valid and submitted', async () => {
const user = userEvent.setup();
const mockSubmitHandler = jest.fn(); // Create a Jest mock function

render(<RegistrationForm onSubmit={mockSubmitHandler} />);

const emailInput = screen.getByLabelText(/email/i);
const passwordInput = screen.getByLabelText(/password/i);
const submitButton = screen.getByRole('button', { name: /register/i });

// Fill the form with valid data
await user.type(emailInput, 'valid@example.com');
await user.type(passwordInput, 'securepassword123');

// Click the submit button
await user.click(submitButton);

// Assertions
expect(mockSubmitHandler).toHaveBeenCalledTimes(1); // Was it called once?
expect(mockSubmitHandler).toHaveBeenCalledWith( // Was it called with the correct data?
{
email: 'valid@example.com',
password: 'securepassword123',
},
expect.anything() // React Hook Form's handleSubmit also passes the event object
);
});

What this does:

const mockSubmitHandler = jest.fn();: We create a "mock function" using Jest. This special function keeps track of how it's called, what arguments it receives, etc., without performing any real action.
render(<RegistrationForm onSubmit={mockSubmitHandler} />);: We pass our mock function as the onSubmit prop to the component.
We then simulate a user filling the form with valid data and clicking submit.
expect(mockSubmitHandler).toHaveBeenCalledTimes(1);: Checks if our mock function was called exactly once.
expect(mockSubmitHandler).toHaveBeenCalledWith({... }, expect.anything());: Checks if our mock function was called with an object containing the correct email and password. The expect.anything() is used because React Hook Form's handleSubmit also passes the native form event as the second argument to the submit handler, which we usually don't need to assert in detail for this kind of test. 11

Why it's needed: This test confirms that when the form is valid, it correctly gathers the data and passes it to the provided submission handler. This is a critical integration point before we think about sending data to a backend.
How it fits into TDD: "RED" step. This test will currently fail because while our RegistrationForm accepts an onSubmit prop, the handleSubmit from useForm is correctly wired to call it. So this test should actually pass without further changes to the component logic itself, assuming the previous steps were correct. If it fails, it indicates an issue in how handleSubmit is wired or how the mock is set up. Let's assume it passes, which means our previous "GREEN" step for handleSubmit was sufficient. If it were to fail, the "GREEN" step would be to ensure handleSubmit(onSubmit) is correctly used.
3.9. GREEN: Implement Mock Submission Logic (and refactor for testability)Actually, our current RegistrationForm.tsx is already set up correctly to call the onSubmit prop via handleSubmit(onSubmit). So, the test written in step 3.8 should already pass! This is great – sometimes a refactor for testability (like making onSubmit a prop) naturally leads to the "green" for the next test.The component RegistrationForm.tsx already takes onSubmit as a prop and uses it with handleSubmit.TypeScript// src/components/Auth/RegistrationForm.tsx
//... (existing code is already good for this step)
// const RegistrationForm: React.FC<RegistrationFormProps> = ({ onSubmit }) => {
// const { register, handleSubmit, formState: { errors } } = useForm<RegistrationFormValues>({ /_... _/ });
//
// return (
// <form onSubmit={handleSubmit(onSubmit)}> {/_ This correctly calls the prop _/}
// {/_... form fields... _/}
// </form>
// );
// };
//...

What this does: The existing structure where handleSubmit (from React Hook Form) wraps the onSubmit prop ensures that our prop is called only after successful client-side validation, and with the correct form data.
Why it's needed: This design decouples the form's presentation and validation logic from the actual submission action (e.g., API call). This makes the RegistrationForm component more reusable and easier to test in isolation. This is a subtle but important architectural benefit.
How it fits into TDD: This is effectively the "GREEN" step for the submission test. All our functional tests for the form logic should now be passing.
3.10. REFACTOR & STYLE: Applying Tailwind CSSWe've reached the "REFACTOR" stage of our TDD cycle for the form's core functionality! All tests are green, meaning the form works as expected. Now we can safely refactor the code or, in this case, apply styles using Tailwind CSS without worrying about breaking the logic.Let's make our RegistrationForm.tsx look a bit nicer. Feel free to get creative with your Tailwind classes! Here's an example:TypeScript// src/components/Auth/RegistrationForm.tsx
import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';

type RegistrationFormValues = {
email: string;
password: string;
};

interface RegistrationFormProps {
onSubmit: SubmitHandler<RegistrationFormValues>;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ onSubmit }) => {
const { register, handleSubmit, formState: { errors } } = useForm<RegistrationFormValues>({
mode: 'onSubmit',
reValidateMode: 'onChange',
});

return (
<form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full"> {/_ Added space-y-6 and w-full _/}
<div>
<label htmlFor="email" className="block text-sm font-medium text-gray-700">
Email address
</label>
<input
type="email"
id="email"
className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
{...register('email', {
required: 'Email is required',
pattern: {
value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
message: 'Invalid email format',
},
})}
aria-invalid={errors.email? "true" : "false"}
/>
{errors.email && (
<p className="mt-2 text-sm text-red-600" role="alert"> {/_ Changed span to p for block display _/}
{errors.email.message}
</p>
)}
</div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          type="password"
          id="password"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          {...register('password', {
            required: 'Password is required',
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters',
            },
          })}
          aria-invalid={errors.password? "true" : "false"}
        />
        {errors.password && (
          <p className="mt-2 text-sm text-red-600" role="alert"> {/* Changed span to p */}
            {errors.password.message}
          </p>
        )}
      </div>

      <div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Register
        </button>
      </div>
    </form>

);
};

export default RegistrationForm;

What this does: We've added various Tailwind CSS utility classes to style the labels, inputs, error messages (now using <p> tags for better block display and margin), and the submit button. Classes like space-y-6, block, font-medium, border-gray-300, rounded-md, bg-indigo-600, hover:bg-indigo-700, etc., quickly give our form a professional look and feel.
Why it's needed: While functionality is key, a good user interface is also important. Tailwind allows us to style directly in our JSX, keeping styles co-located with their components.
How it fits into TDD: This is the "REFACTOR" step. The primary goal here is to improve the non-functional aspects (aesthetics, layout) of the component. After applying these styles, it's crucial to re-run all your tests (npm test). They should all still pass, confirming that our styling changes haven't accidentally broken any of the form's logic or accessibility (as tested by getByLabelText, etc.).
Phew! That was quite a journey through TDD for our registration form. We now have a well-tested, functional, and styled component.4. Bringing it to Life: The Signup PageOur RegistrationForm component is ready, but users need a way to access it. That means creating a dedicated signup page.4.1. Creating the Signup Route (src/app/signup/page.tsx)Thanks to Next.js's App Router, creating a new page is as simple as creating a new folder and a page.tsx file within it.19
Create a new folder named signup inside your src/app directory.
Inside src/app/signup, create a new file named page.tsx.
Now, let's populate src/app/signup/page.tsx to use our RegistrationForm component.TypeScript// src/app/signup/page.tsx
'use client'; // Needed because we're handling form submission state/logic here,
// and RegistrationForm is interactive.

import React from 'react';
import RegistrationForm from '@/components/Auth/RegistrationForm'; // Adjust path if your structure differs
import { SubmitHandler } from 'react-hook-form';

// Re-defining this type here for the page, or import from a shared types file
type RegistrationFormValues = {
email: string;
password: string;
};

const SignupPage: React.FC = () => {
const handleRegistration: SubmitHandler<RegistrationFormValues> = (data) => {
console.log('Attempting Kasese Socials Signup with:', data);
// In a real application, this is where you would make an API call
// to your backend to actually register the user.
// For Phase 1, we're using dummy data and mocked submissions.
alert(`Registration submitted for ${data.email}! (This is a dummy action for now)`);
// You might want to redirect the user or clear the form here in a real app.
};

return (
<div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
<div className="max-w-md w-full space-y-8 p-10 bg-white shadow-xl rounded-xl">
<div>
{/_ You could add a logo here later _/}
<h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
Create your Kasese Socials account
</h2>
<p className="mt-2 text-center text-sm text-gray-600">
And start connecting with your community!
</p>
</div>
<RegistrationForm onSubmit={handleRegistration} />
</div>
</div>
);
};

export default SignupPage;

What this does:

Creates a new page accessible at the /signup URL.
It imports and renders our RegistrationForm component.
It defines a handleRegistration function that will be called when the form is successfully submitted. For now, this function just logs the data to the console and shows an alert – remember, Phase 1 is "Frontend First with Dummy Data."
The 'use client'; directive is important here. The SignupPage itself now contains logic (handleRegistration) that might involve client-side effects (like showing notifications or redirecting, which we'd add later) and it hosts the RegistrationForm which is a client component due to its interactivity and use of React Hook Form.

Why it's needed (PRD R1.1): This page provides the actual user interface for the registration feature, making our RegistrationForm component usable within the application.
Navigate to http://localhost:3000/signup in your browser. You should see your beautifully styled registration form, ready for action! Try submitting it – you should see your console.log message and the alert.4.2. Testing the Signup Page (Basic Render Test)While our RegistrationForm component is thoroughly tested, it's good practice to have a simple test for the SignupPage itself to ensure it renders correctly and includes the form.Create a new test file: src/app/signup/page.test.tsx.For page-level tests, we often don't need to re-test the full functionality of child components. We can mock the child component to keep the page test focused and fast.17TypeScript// src/app/signup/page.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SignupPage from './page'; // Imports src/app/signup/page.tsx

// Mock the RegistrationForm component
// This allows us to test the SignupPage in isolation without re-testing RegistrationForm's internals.
jest.mock('@/components/Auth/RegistrationForm', () => {
// The mock component should replicate the props interface of the original, especially onSubmit
return jest.fn(({ onSubmit }) => (
<form
data-testid="mock-registration-form"
onSubmit={(e) => {
e.preventDefault();
// Simulate a submission with some dummy data for testing the page's handler
onSubmit({ email: 'test@example.com', password: 'password' });
}} >
<label htmlFor="mock-email">Email</label>
<input id="mock-email" type="email" />
<button type="submit">Mock Register</button>
</form>
));
});

// Mock window.alert as it's called in handleRegistration
global.alert = jest.fn();

describe('SignupPage', () => {
beforeEach(() => {
// Clear mock history before each test
(global.alert as jest.Mock).mockClear();
// Also clear the mock component's call history if needed, though RegistrationForm is re-mocked per import
// require('@/components/Auth/RegistrationForm').mockClear(); // This syntax might be needed if mock isn't clearing
});

it('should render the signup page title and the registration form', () => {
render(<SignupPage />);

    expect(screen.getByText(/Create your Kasese Socials account/i)).toBeInTheDocument();
    expect(screen.getByTestId('mock-registration-form')).toBeInTheDocument();

});

it('should call the handleRegistration function when the mock form is submitted', async () => {
const user = userEvent.setup();
const consoleSpy = jest.spyOn(console, 'log'); // Spy on console.log

    render(<SignupPage />);

    const submitButton = screen.getByRole('button', { name: /mock register/i });
    await user.click(submitButton);

    // Check if the page's handleRegistration logic was triggered
    expect(consoleSpy).toHaveBeenCalledWith(
      'Attempting Kasese Socials Signup with:',
      { email: 'test@example.com', password: 'password' }
    );
    expect(global.alert).toHaveBeenCalledWith(
      'Registration submitted for test@example.com! (This is a dummy action for now)'
    );

    consoleSpy.mockRestore(); // Clean up the spy

});
});

What this does:

jest.mock('@/components/Auth/RegistrationForm',...): This line mocks our actual RegistrationForm. Instead of rendering the real complex form, Jest will render the simple mock version we define. This makes the SignupPage test faster and less dependent on the RegistrationForm's internal details.
The first test checks if the main heading of the signup page and our data-testid="mock-registration-form" (from the mocked component) are rendered.
The second test verifies that when the mocked form is submitted, the handleRegistration function within SignupPage is triggered (we check this by spying on console.log and the mocked alert).

Why it's needed: This ensures that the SignupPage correctly integrates its child components and that its own specific logic (like the handleRegistration handler) is working.
How it fits into TDD: While the main TDD cycle was for the RegistrationForm component, pages also benefit from tests. This is more of an integration test at the page level, ensuring the pieces fit together.
Run npm test. All your tests, including the new ones for SignupPage, should pass!5. Phase 1 Checkpoint: What We've Built & What's NextAnd that brings us to the end of this very productive chunk of work for Phase 1! Let's take a moment to appreciate what we've accomplished:
Styling Superpowers Unleashed: We successfully installed and configured Tailwind CSS (v3) in our Next.js project, and it's already making our form look sharp.
Accessible Components Ready: We installed Headless UI, preparing us to build complex, accessible UI components with ease, styled our way with Tailwind.
Registration Form - TDD Style: We meticulously followed the Test-Driven Development cycle (Red-Green-Refactor) to build our RegistrationForm.tsx component.

It renders the necessary email and password fields, and a submit button.
It uses React Hook Form for efficient state management and validation.
It implements client-side validation for required fields, email format, and password length, providing clear error messages.
It has a (mocked) submission process, ready to be hooked up to a real backend later.

Signup Page Live: We created the /signup page in our application, integrating the RegistrationForm so users can (theoretically) start signing up.
PRD and Best Practices: Throughout this process, we've kept our kasese socials prd.md in mind and emphasized best practices like TDD, writing accessible HTML, and creating testable components.
What's Next in our Dev Diary?We've laid some solid frontend groundwork for user authentication. Here's what you can likely expect as we continue with Phase 1 ("Frontend First with Dummy Data"):
Login Form (PRD R1.2): The natural next step is to build the Login form. We'll likely follow a similar TDD process.
Client-Side State for Auth?: As we build out authentication, we might soon need to manage user authentication state globally on the client (e.g., "is the user logged in?"). This could be our first opportunity to introduce Zustand (as per PRD Section 6) for simple, effective client-side state management.
More Frontend Components: We could start sketching out other UI elements for Kasese Socials, like a basic post component or a simple user profile display – all still using dummy data, of course.
This "Frontend First" approach allows us to make significant progress on the user interface and user experience, getting early feedback and iterating quickly, even before the backend is fully built out.Thanks for following along with Part 2 of the Kasese Socials Dev Diary! It's been a deep dive, but hopefully, you've learned a lot about setting up styling, TDD, form handling with React Hook Form, and building pages in Next.js.Stay tuned for the next update, and happy coding!
