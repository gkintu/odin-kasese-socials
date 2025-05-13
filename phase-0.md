Kasese Socials Dev Diary Part 1: Laying the Groundwork – Project Setup & Your First TDD Cycle!Welcome, future full-stack developer! Ready to build your very own social media app from scratch? It's going to be an amazing journey, and I'm thrilled to guide you every step of the way. Together, we'll be building Kasese Socials, a modern, feature-rich social media platform.Our primary goal throughout this series isn't just to build an app, but to learn and apply modern web development practices, including Test-Driven Development (TDD), modular design, and working with a full-stack JavaScript environment. Think of this as your hands-on apprenticeship!Our official guidebook for this adventure is the Kasese Socials Product Requirements Document (PRD). This document outlines all the features and goals for our project. In this very first post, we'll get acquainted with the project by looking at the PRD's Introduction and Goals (let's imagine these are Sections 1 & 2 of our PRD). Then, we'll roll up our sleeves and dive straight into Phase 0: Setup, Boilerplate & TDD Foundation (as outlined in Section 4.0 of our PRD).Specifically, we'll be covering these initial steps, which correspond to Functional Requirements FR0.1, FR0.2, FR0.3, FR0.4, and FR0.5 from our PRD:
Setting up our Next.js project using TypeScript.
Configuring essential tools for top-notch code quality: ESLint, Prettier, and Husky.
Laying the groundwork for Test-Driven Development (TDD) with Jest and React Testing Library.
Establishing our initial project folder structure.
And, the exciting part – writing our very first test!
By the end of this post, you'll have a fully configured Next.js project, a clear understanding of why each tool we set up is important, and the satisfaction of running your first passing test.A quick note on our development environment: we'll be using VSCode as our code editor, and all terminal commands are intended for an Ubuntu WSL (Windows Subsystem for Linux) terminal. If you're on a Mac or a native Linux system, the commands should be very similar.PrerequisitesBefore we jump in, make sure you have a few things ready:
A basic understanding of HTML, CSS, and JavaScript will be helpful.
Node.js installed on your system. We recommend version 18.17 or later. This also installs npm (Node Package Manager), which we'll use. You can check your Node.js version by running node -v in your terminal.
VSCode installed.
If you're on Windows, an Ubuntu WSL setup is recommended for a smoother development experience.
Step-by-Step: Setting Up Kasese Socials (Phase 0)Alright, let's get our hands dirty and start building!3.1. Creating the Project Directory (PRD: FR0.4 - Initial Folder Structure Foundation)First things first, we need a home for our project.Open your Ubuntu WSL terminal (or your standard terminal on Mac/Linux) and navigate to where you usually store your development projects (e.g., a projects folder in your home directory).Then, run the following commands:Bash# Run in your preferred development projects directory (e.g., ~/projects/)
mkdir kasese-socials
This command, mkdir kasese-socials, creates a new folder named kasese-socials. This will be the main container for our entire application.Now, let's move into our newly created directory:Bash# Run in your preferred development projects directory (e.g., ~/projects/)
cd kasese-socials
The cd kasese-socials command changes your terminal's current directory to kasese-socials. All subsequent commands in this post (unless otherwise specified) should be run from within this kasese-socials/ directory.What this does: We've simply created the root folder for our project.Why it's needed: This is the foundational step for FR0.4 (Establish initial project folder structure). Every file and folder related to Kasese Socials will live inside here, keeping things organized.3.2. Initializing Next.js with TypeScript (PRD: FR0.1)Now, let's bring Next.js into the picture! Next.js is a fantastic React framework that will power both our frontend and backend. We'll use create-next-app, the official command-line tool, which makes setting up a new Next.js project incredibly simple.In your terminal, ensuring you are inside the kasese-socials/ directory, run:Bash# Run in kasese-socials/ terminal:
npx create-next-app@latest.
Notice the . at the end – this tells create-next-app to install the project in the current directory (kasese-socials/) instead of creating a new sub-folder.You'll be prompted with a series of questions. Here’s how we recommend answering them for Kasese Socials, and why:
Would you like to use TypeScript? Yes

Why? TypeScript adds static typing to JavaScript, which helps us catch errors during development rather than in production. It also makes our code more readable and maintainable. This is crucial for fulfilling FR0.1 from our PRD.

Would you like to use ESLint? Yes

Why? ESLint is a linter that helps us find and fix problems in our code, ensuring consistency and adherence to best practices. This is the first step towards FR0.2.

Would you like to use Tailwind CSS? No

Why? While Tailwind is a great CSS framework, our PRD doesn't specify it for now. We'll focus on core functionality first and can decide on a styling approach later. Keeping things simple initially is key for learning.

Would you like to usesrc/directory? Yes

Why? Organizing our application code within a src/ directory is a common best practice. It provides a clear separation between our source code (like components and pages) and project configuration files (like package.json or next.config.mjs) that live in the root.

Would you like to use App Router? (recommended) Yes

Why? The App Router is the latest and recommended way to handle routing in Next.js. It offers powerful features like server components and improved data fetching patterns.

Would you like to customize the default import alias (@/\*)? No

Why? Next.js will set up an import alias @/_ which points to the src/ directory (or the root if you didn't choose src/). This is very convenient for importing modules without long relative paths (e.g., import MyComponent from '@/components/MyComponent'). The default @/_ is perfectly fine for us.

Once you answer these prompts, create-next-app will work its magic, downloading the necessary packages and setting up your project structure. This might take a minute or two.What this does: npx create-next-app@latest. scaffolds a brand new, ready-to-run Next.js application in our project directory. It also installs TypeScript and sets up basic ESLint configuration based on our answers.Why it's needed (PRD FR0.1): This step directly fulfills FR0.1: Initialize Next.js project with TypeScript. The choice of the src/ directory and the App Router sets us up with modern Next.js conventions from the start.It's worth taking a moment to appreciate how much create-next-app does for us. Manually configuring Next.js with TypeScript, setting up the correct directory structure, and integrating ESLint would be a much more involved process. This tool significantly lowers the barrier to getting started with a well-structured, professional-grade project, allowing us to focus on building features sooner.3.3. Setting Up Linters & Formatters: ESLint, Prettier & Husky (PRD: FR0.2)Clean, consistent code isn't just about aesthetics; it's about readability, maintainability, and reducing bugs. To help us achieve this, we'll use a trio of powerful tools:
ESLint: To analyze our code for potential errors and enforce coding standards.
Prettier: To automatically format our code, ensuring a consistent style across the project.
Husky: To run ESLint and Prettier automatically before we commit any code to version control (Git).
This combination forms an automated quality gate, ensuring our codebase stays healthy.ESLint Verification (PRD FR0.2 Part 1)Good news! When we told create-next-app to use ESLint, it already installed and configured it for us. Let's quickly verify this.

Check the ESLint Configuration File:Open your project in VSCode. In the root of your kasese-socials directory, you should find a file named .eslintrc.json. It will likely look something like this:
JSON// kasese-socials/.eslintrc.json
{
"extends": "next/core-web-vitals" // Default Next.js ESLint configuration
}

This extends line means our project is using the recommended ESLint rules provided by the Next.js team, which includes checks for Core Web Vitals (important for web performance and user experience).

Run the Lint Command:Next.js also added a lint script to our package.json file. Let's try running it:
Bash# Run in kasese-socials/ terminal:
npm run lint

You should see some output indicating that ESLint checked your files. If there are no issues in the boilerplate code, it might say something like "No ESLint warnings or errors."

What this does: ESLint is now set up to statically analyze our code based on the next/core-web-vitals ruleset.Why it's needed: This is the first part of fulfilling FR0.2. It helps us catch potential bugs and maintain consistent coding standards.Installing Prettier and ESLint Integration (PRD FR0.2 Part 2)While ESLint can format code to some extent, Prettier is a dedicated, opinionated code formatter. It takes your code and reprints it according to a consistent set of rules, removing all original styling. We'll also make ESLint and Prettier work together harmoniously.

Install Prettier and Helper Packages:Run the following command in your kasese-socials/ terminal to install Prettier and two helper packages as development dependencies (--save-dev):
Bash# Run in kasese-socials/ terminal:
npm install --save-dev prettier eslint-config-prettier eslint-plugin-prettier

prettier: The core Prettier library.
eslint-config-prettier: This turns off ESLint rules that might conflict with Prettier. We want Prettier to handle all formatting concerns.
eslint-plugin-prettier: This runs Prettier as an ESLint rule and reports differences as ESLint issues. This is great because you can see formatting issues directly in your editor alongside other linting errors.

Configure ESLint to Use Prettier:Now, we need to tell ESLint about Prettier. Modify your kasese-socials/.eslintrc.json file:
Open: kasese-socials/.eslintrc.jsonChange it to:
JSON// kasese-socials/.eslintrc.json
{
"extends":
}

By adding "plugin:prettier/recommended", we're telling ESLint to use the recommended configurations from eslint-plugin-prettier and eslint-config-prettier.

Create a Prettier Configuration File:Prettier is opinionated, but it does allow some configuration. Let's create a configuration file for it.
Create file: kasese-socials/prettier.config.jsAdd this content:
JavaScript// kasese-socials/prettier.config.js
module.exports = {
semi: true, // Add semicolons at the end of statements.
singleQuote: true, // Use single quotes instead of double quotes for strings.
trailingComma: 'es5', // Add trailing commas where valid in ES5 (objects, arrays, etc.).
tabWidth: 2, // Indent lines with 2 spaces.
printWidth: 80, // Wrap lines that exceed 80 characters.
};

These are some common and sensible defaults. Feel free to adjust them to your team's preference later, but for now, these are great.

Add an npm Script for Formatting:Let's add a script to our package.json to easily format our entire project.
Open: kasese-socials/package.jsonAdd the format script to the scripts section:
JSON// kasese-socials/package.json
{
//... other package.json content...
"scripts": {
"dev": "next dev",
"build": "next build",
"start": "next start",
"lint": "next lint",
"format": "prettier --write." // Add this line to format all supported files
}
//... other package.json content...
}

The prettier --write. command tells Prettier to find all supported file types in the current directory (.) and its subdirectories, and format them in place (--write).

Test Your Setup:Now, try running the format and lint commands:
Bash# Run in kasese-socials/ terminal:
npm run format
npm run lint

npm run format should reformat any files that didn't match your Prettier config. npm run lint should now also report Prettier formatting issues if any exist (because we integrated it with ESLint).

Setting up Husky for Pre-commit Hooks (PRD FR0.2 Part 3)This is where the magic of automation comes in! We'll use Husky to automatically run our linter and formatter before any code is committed to our Git repository. If the checks fail, the commit will be aborted, forcing us to fix the issues. This is a fantastic way to maintain a clean and consistent codebase.Prerequisite: Initialize GitIf you haven't already, initialize a Git repository in your project:Bash# Run in kasese-socials/ terminal:
git init
git add.
git commit -m "Initial project setup with Next.js"
(You might get a warning from Husky later if you set it up before the first commit, so it's good to have an initial commit.)Now, let's set up Husky:

Install Husky:
Bash# Run in kasese-socials/ terminal:
npm install --save-dev husky

Enable Git Hooks with Husky:This command prepares Husky to manage your Git hooks.
Bash# Run in kasese-socials/ terminal:
npx husky install

This will create a .husky/ directory in your project. This directory should be committed to Git.

Add a Pre-commit Hook:Now, we'll tell Husky what command to run before each commit. We want it to run our linting and formatting scripts.
Bash# Run in kasese-socials/ terminal:
npx husky add.husky/pre-commit "npm run lint && npm run format"

This command does two things:

It creates a new file: kasese-socials/.husky/pre-commit.
It writes the command npm run lint && npm run format into that file.

The content of kasese-socials/.husky/pre-commit will look something like this:
Bash#!/usr/bin/env sh

. "$(dirname -- "$0")/\_/husky.sh"npm run lint && npm run format

```
What this does: Husky is now configured! Before you can successfully git commit any changes, Husky will automatically execute npm run lint. If that passes, it will then execute npm run format. If either of these commands fails (e.g., ESLint finds an error, or Prettier has issues), the commit process will be halted.Why it's needed: This automated pre-commit check is a cornerstone of FR0.2. It enforces our code quality standards proactively, preventing problematic code from ever entering our version history. This synergy between ESLint (error checking), Prettier (style consistency), and Husky (automation) creates a powerful feedback loop that encourages good coding habits from the very start. It means less time spent on manual checks and debates about code style, and more time focusing on building awesome features for Kasese Socials.Try making a small, unformatted change to a file (like src/app/page.tsx), save it, then try to commit it using git add. and git commit -m "test husky". Husky should run, format the file, and if linting passes, allow the commit. If you introduce a linting error, the commit should fail!3.4. TDD Foundation: Jest & React Testing Library (PRD: FR0.3)Test-Driven Development (TDD) is a software development process where you write tests before you write the actual code. This might sound counter-intuitive at first, but it's a powerful practice that leads to better-designed, more reliable, and more maintainable code. For Kasese Socials, TDD is a core requirement.Let's set up our testing tools:
Jest: A delightful JavaScript testing framework. It's our test runner, assertion library, and provides mocking capabilities.
React Testing Library (RTL): A library for testing React components in a way that resembles how users interact with them. It focuses on testing component behavior from the user's perspective, rather than implementation details.


Installing Dependencies:Let's install Jest, RTL, and some essential helper packages as development dependencies.
Bash# Run in kasese-socials/ terminal:
npm install --save-dev jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom @types/jest ts-node

Let's break these down:

jest: The core Jest testing framework.
jest-environment-jsdom: Allows Jest to simulate a browser environment (the DOM) which is necessary for testing React components that render to the DOM.
@testing-library/react: The main React Testing Library package.
@testing-library/jest-dom: Adds custom Jest matchers that make it easier to write assertions about DOM elements (e.g., toBeInTheDocument(), toHaveTextContent()).
@types/jest: TypeScript type definitions for Jest, giving us autocompletion and type checking in our test files.
ts-node: Allows Jest to directly execute TypeScript files, including our Jest configuration file if we write it in TypeScript.



Configuring Jest (jest.config.ts):Next.js comes with a built-in Jest configuration helper (next/jest) that simplifies the setup significantly. It handles a lot of the Next.js-specific compilation and transformation steps for us.
Create file: kasese-socials/jest.config.tsAdd this content:
TypeScript// kasese-socials/jest.config.ts
import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and.env files in your test environment.
  // If your app is in the root directory (not src/), use './'
  dir: './',
});

// Add any custom config to be passed to Jest
const config: Config = {
  coverageProvider: 'v8', // Specifies the coverage provider. 'v8' is modern and efficient.
  testEnvironment: 'jsdom', // Sets up a JSDOM environment for testing React components.
  // Add more setup options before each test is run
  setupFilesAfterEnv:, // Points to a file that runs after Jest is set up, for global test configurations.
  moduleNameMapper: {
    // Handle module aliases (this should match the paths in your tsconfig.json)
    // If you chose src/ directory and default alias:
    '^@/(.*)$': '<rootDir>/src/$1',
    // If you did not choose src/ directory and default alias:
    // '^@/(.*)$': '<rootDir>/$1',
  },
  // By default, next/jest handles mocking of CSS Modules, global CSS, and image imports.
  // If you have other types of assets or specific needs, you might add more moduleNameMapper rules or transform settings here.
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config);


Key points:

dir: './' tells next/jest where your Next.js application root is (adjust to './src/' if you moved pages or app into src and next.config.js remains at root, but typically create-next-app with src/ keeps next.config.js at root and dir: './' is correct for next/jest to find it, while moduleNameMapper handles src paths). For our setup with src/ directory, the @/(.*) alias in moduleNameMapper should point to <rootDir>/src/$1.
testEnvironment: 'jsdom' is crucial for testing UI components.
setupFilesAfterEnv: tells Jest to run our jest.setup.ts file before each test suite. We'll create this next.
moduleNameMapper helps Jest resolve those convenient @/ import aliases we have in our Next.js project. Make sure the path matches your tsconfig.json paths configuration.





Creating Jest Setup File (jest.setup.ts):This file is perfect for global test configurations or importing things that all your tests might need. We'll use it to import the helpful matchers from @testing-library/jest-dom.
Create file: kasese-socials/jest.setup.tsAdd this content:
TypeScript// kasese-socials/jest.setup.ts
// This imports handy custom assertions for Jest, like.toBeInTheDocument()
import '@testing-library/jest-dom';

Now, matchers like toBeInTheDocument(), toHaveClass(), etc., will be available in all our test files without needing to import them explicitly everywhere.


Adding Test Scripts to package.json:Let's add scripts to package.json to easily run our tests.
Open: kasese-socials/package.jsonAdd/modify the test and test:watch scripts:
JSON// kasese-socials/package.json
{
  //... other package.json content...
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "format": "prettier --write.",
    "test": "jest", // Add this line to run tests once
    "test:watch": "jest --watch" // Add this line to run tests in watch mode
  }
  //... other package.json content...
}


npm test will run all tests once.
npm run test:watch will start Jest in watch mode. It will re-run tests automatically whenever you save a file, which is incredibly useful during development.


What this does: We've installed and configured Jest and React Testing Library. next/jest handles much of the complex Next.js-specific configuration, making our setup cleaner.Why it's needed (PRD FR0.3): This fulfills FR0.3: Configure Jest and React Testing Library for TDD. This setup is the bedrock of our TDD approach. Without it, we can't write the tests that will drive our development. The next/jest wrapper is a significant advantage because it abstracts away many of the complexities that used to come with setting up Jest for a Next.js project, especially concerning compilation and module resolution. This allows us, and you, to get to writing tests much faster.3.5. Establishing Initial Project Folder Structure (PRD: FR0.4)A well-organized project is a happy project! It makes finding files easier, understanding the codebase simpler, and collaborating more efficient. Since we selected the src/ directory option during create-next-app, our application code will live there. Let's define some core folders within src/.

Navigate into src/ and Create Core Folders:Make sure your terminal is in the kasese-socials/ root.
Bash# Run in kasese-socials/ terminal:
cd src
mkdir components lib styles utils tests
mkdir components/ui components/layout components/features
cd..


cd src: Navigates into the src directory.
mkdir components lib styles utils tests: Creates our main organizational folders.
mkdir components/ui components/layout components/features: Creates subdirectories within components for better component organization.
cd..: Navigates back to the project root (kasese-socials/).



Explanation of Each Folder's Purpose:

src/app/: This was created by create-next-app. It's where all our Next.js App Router specific files will go – pages (route handlers), layouts, loading UIs, error UIs, etc.
src/components/: This is for all our React components.

ui/: For small, highly reusable, generic UI components that are not tied to any specific feature (e.g., Button.tsx, Card.tsx, Input.tsx, Modal.tsx). Think of these as your basic building blocks.
layout/: For components that define the structure or layout of parts of our application (e.g., Header.tsx, Footer.tsx, Sidebar.tsx, PageWrapper.tsx).
features/: For components that are specific to a particular feature or domain of Kasese Socials (e.g., for authentication, we might have LoginForm.tsx or RegistrationForm.tsx here; for posts, we might have PostCard.tsx or CreatePostForm.tsx).


src/lib/: This folder is often used for helper functions, utility code that might have side effects or interact with external services, constants, or even more complex business logic that doesn't fit neatly into a component or a simple utility. For example, API client setup, date formatting libraries, or custom hooks that encapsulate complex logic.
src/styles/: For global stylesheets, CSS variable definitions, theme files, etc. While Next.js supports CSS Modules co-located with components (which we'll likely use), this folder is good for truly global styles.
src/utils/: For pure utility functions – small, focused functions that take an input, produce an output, and have no side effects (e.g., a function to capitalize a string, a function to validate an email format if not using a library).
src/tests/: An alternative place for test files, especially for utility functions or library code. However, for React components and App Router pages/layouts, we will often co-locate tests. This means a test file like MyComponent.test.tsx will live right next to MyComponent.tsx in the same folder. This makes it easier to find tests and see which components are covered. We'll demonstrate co-location in the next step.



Initial Folder Tree Diagram:After these steps, your kasese-socials/ directory should look roughly like this (some files omitted for brevity, especially within node_modules and .next which is generated during build/dev):
Plaintextkasese-socials/
├──.husky/
│   └── pre-commit
├── node_modules/
├── public/               # For static assets like images, fonts
│   ├── next.svg
│   └── vercel.svg
├── src/
│   ├── app/              # Next.js App Router core
│   │   ├── favicon.ico
│   │   ├── globals.css   # Global styles imported into layout
│   │   ├── layout.tsx    # Root layout for the application
│   │   └── page.tsx      # Homepage component
│   ├── components/
│   │   ├── features/
│   │   ├── layout/
│   │   └── ui/
│   ├── lib/
│   ├── styles/
│   ├── tests/            # General tests, or can be co-located
│   └── utils/
├──.eslintrc.json
├──.gitignore
├── jest.config.ts
├── jest.setup.ts
├── next-env.d.ts         # TypeScript declarations for Next.js
├── next.config.mjs       # Next.js configuration file
├── package-lock.json
├── package.json
├── prettier.config.js
└── tsconfig.json         # TypeScript configuration


What this does: We've established a clear and logical initial folder structure for our project.Why it's needed (PRD FR0.4): This directly fulfills FR0.4. A good folder structure is absolutely crucial for keeping a project maintainable and scalable, especially as Kasese Socials grows with more features and code. This structure isn't set in stone; it will evolve. However, starting with a sensible organization like this makes it much easier to know where to put new files and where to find existing ones. The separation into components/ui, components/layout, and components/features already encourages modular thinking, which is a key principle for building robust applications.3.6. Your First Test: Homepage Smoke Test (PRD: FR0.5)Now for a truly exciting moment – writing our first test! And true to Test-Driven Development, we'll write the test before we ensure the homepage has what the test expects.Introduction to TDD (Red-Green-Refactor)The core cycle of TDD is Red-Green-Refactor:
RED: Write a test for a small piece of functionality. Run it. It should fail (turn "red") because the functionality doesn't exist yet.
GREEN: Write the minimum amount of application code necessary to make the test pass (turn "green").
REFACTOR: Improve the application code (and test code if needed) for clarity, performance, or structure, ensuring all tests still pass.
Let's apply this to create a "smoke test" for our homepage. A smoke test is a basic initial test to ensure that the most critical functionality works, or in our case, that a component renders without crashing and displays some essential content.TDD - RED: Write the Failing Smoke TestWe want to test our homepage, which is the page.tsx file located in src/app/. We'll co-locate its test file.

Create the Test File:Inside the src/app/ directory, create a new folder named __tests__ (double underscores are a common convention for test folders). Inside __tests__, create a file named page.test.tsx.
File path: kasese-socials/src/app/__tests__/page.test.tsx


Write the Test Code:Add the following code to page.test.tsx:
TypeScript// kasese-socials/src/app/__tests__/page.test.tsx
import '@testing-library/jest-dom'; // For custom matchers like toBeInTheDocument
import { render, screen } from '@testing-library/react'; // For rendering components in tests
import Home from '../page'; // Importing our Home page component from the parent directory (src/app/page.tsx)

// 'describe' groups related tests. Here, we're describing tests for the Home Page.
describe('Home Page', () => {
  // 'it' defines an individual test case.
  // This test checks if the main heading "Welcome to Kasese Socials" renders.
  it('should render the main heading "Welcome to Kasese Socials"', () => {
    render(<Home />); // Step 1: Render the Home component into a virtual DOM.

    // Step 2: Find an element with the 'heading' accessibility role and level 1 (which corresponds to an <h1> tag).
    // We also specify that its accessible name (usually its text content) should match the regular expression /Welcome to Kasese Socials/i (case-insensitive).
    const headingElement = screen.getByRole('heading', {
      name: /Welcome to Kasese Socials/i, // The text we expect to find in the heading
      level: 1, // We expect it to be an <h1>
    });

    // Step 3: Assert that the found heading element is actually present in the document.
    expect(headingElement).toBeInTheDocument();
  });
});



Run the Test (and watch it fail!):Open your terminal (still in the kasese-socials/ root) and run your test script:
Bash# Run in kasese-socials/ terminal:
npm test

You should see output from Jest indicating that the test FAILED. The error message will be something like:Unable to find an accessible element with the role "heading" and name \/Welcome to Kasese Socials\/i and level 1.
This is perfect! Our test is failing because the default homepage created by create-next-app doesn't have an <h1> with the text "Welcome to Kasese Socials". This is the RED state. Our test is correctly telling us that a requirement (implicit in our test) is not yet met.

TDD - GREEN: Write Code to Make the Test PassNow, let's write the minimum amount of code in our src/app/page.tsx file to make this test pass.

Modify the Homepage Component:Open kasese-socials/src/app/page.tsx. It will have some default boilerplate from Next.js. Let's change it to include the heading our test is looking for.
File: kasese-socials/src/app/page.tsxModify it to:
TypeScript// kasese-socials/src/app/page.tsx
// We can remove the default Image import if we're not using it immediately.
// import Image from 'next/image';

// This is the main functional component for our homepage.
export default function Home() {
  return (
    // The <main> tag is a semantic HTML element for the main content of the page.
    // The className provides some default Next.js styling; we can change this later.
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      {/* This is the heading our test is looking for! */}
      <h1>Welcome to Kasese Socials</h1>

      {/* We'll keep some of the default Next.js structure for now,
          but we will replace all of this content throughout the series. */}
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Get started by editing&nbsp;
          <code className="font-mono font-bold">src/app/page.tsx</code>
        </p>
        {/*... other default content can remain or be cleaned up as desired... */}
      </div>
    </main>
  );
}

The key change is adding: <h1>Welcome to Kasese Socials</h1>.


Run the Test Again (aiming for Green!):Go back to your terminal and run:
Bash# Run in kasese-socials/ terminal:
npm test

This time, you should see a glorious PASS message!PASS src/app/__tests__/page.test.tsx
Success! We've added the necessary code, and our test confirms it. This is the GREEN state.

TDD - REFACTOR: Improve the Code (and Tests if needed)In the REFACTOR step, we look at the code we just wrote (both the application code and the test code) and see if we can improve it – make it cleaner, more readable, more performant, or better structured – without changing its behavior (i.e., all tests should still pass).For our current simple example:
Application Code (src/app/page.tsx): It's very minimal. The <h1> is clear. The surrounding Next.js boilerplate is fine for now. No major refactoring needed here yet.
Test Code (src/app/__tests__/page.test.tsx): Our test is also quite clear and focused. It describes what it's testing, renders the component, finds an element by its role and name, and asserts its presence. This is good.
So, for this first cycle, our refactor step is minimal. As our application grows, this step will become much more important.Engaging Explanations:
What the code/command does:

The test file uses describe to group tests for the Home Page and it to define a specific test case.
render(<Home />) from React Testing Library renders our Home component into a virtual DOM accessible for testing.
screen.getByRole('heading', { name: /.../i, level: 1 }) is a powerful query from RTL. It finds elements based on their accessibility role (like 'heading', 'button', 'link'), which is how users (and assistive technologies) perceive the page. We specified level: 1 to ensure it's an <h1>.
expect(headingElement).toBeInTheDocument() uses a matcher from @testing-library/jest-dom to assert that the element was indeed found and rendered.
The change in src/app/page.tsx was simply adding the <h1> tag with the expected text.


Why it's needed (PRD FR0.5): This entire process fulfills FR0.5: Create a basic "smoke test" for the homepage. This test isn't just about the heading; it proves that our entire testing setup (Jest, React Testing Library, next/jest, jest-dom, and our configurations) is working correctly. If this first test didn't work due to setup issues, we'd be blocked from effectively applying TDD to any other part of the application. Its success is a crucial "all clear" signal.
How it fits into TDD: We've just walked through our very first Red-Green-Refactor cycle! We saw the test fail (Red), wrote code to make it pass (Green), and considered improvements (Refactor). This iterative process will be the rhythm of our development for every feature in Kasese Socials. It helps ensure we're building what's required, that our code works as expected, and that we have a safety net of tests to prevent regressions.
Key Tooling OverviewWe've set up quite a few tools in this first session! It might seem like a lot, but each plays a vital role in modern web development, helping us write better code, faster, and with more confidence. Here’s a quick summary of what they are and why they're important for Kasese Socials:ToolPurpose for Kasese SocialsKey PRD Aspect AddressedNext.jsOur core React framework for building the full-stack application.FR0.1TypeScriptAdds static typing to JavaScript for more robust, error-free code.FR0.1ESLintAnalyzes code to find potential errors and enforce coding standards.FR0.2PrettierAutomatically formats our code for a consistent style.FR0.2HuskyAutomates running linters and formatters before we commit code.FR0.2JestOur test runner for executing all JavaScript/TypeScript tests.FR0.3React Testing LibraryHelps us write tests for React components that resemble how users interact with them.FR0.3, FR0.5This table connects each tool directly to the requirements of our Kasese Socials project. Understanding why we're using a tool is just as important as knowing how to use it. These tools aren't just arbitrary choices; they are industry-standard practices that contribute to building high-quality software.ConclusionFantastic work getting through this foundational setup! You've successfully:
Created and initialized the Kasese Socials project with Next.js and TypeScript.
Configured essential development tools for code quality: ESLint, Prettier, and Husky.
Established a solid foundation for Test-Driven Development with Jest and React Testing Library.
Set up an initial, organized folder structure.
And most importantly, you wrote and passed your first smoke test for the homepage, completing your first TDD cycle!
This setup for Phase 0 is absolutely crucial for everything that comes next. You've built a strong launchpad.What's Next?In our next post, we'll dive into Phase 1: Frontend First with Dummy Data from our PRD. We'll start building out the User Authentication features, beginning with the User Registration form (PRD Requirement R1.1). Get ready to apply your newfound TDD skills to build UI components from the ground up!You've accomplished a lot today. Take a well-deserved break, and I'll see you in the next installment of the Kasese Socials Dev Diary!
```
