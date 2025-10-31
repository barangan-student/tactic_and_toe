# GEMINI.md

This file provides a comprehensive overview of the Tactic Toe project, its structure, and how to interact with it.

## Project Overview

Tactic Toe is a web application that offers a collection of Tic-Tac-Toe game variations. It is built using modern web technologies to provide a fast, responsive, and engaging user experience.

- **Framework:** [Next.js](https://nextjs.org/) (v15) with Turbopack
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
- **Linting:** [ESLint](https://eslint.org/)

## Getting Started

To get the project up and running locally, follow these steps:

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Run the Development Server:**
    ```bash
    npm run dev
    ```
    This will start the development server with Turbopack at `http://localhost:3000`.

## Project Structure

The project follows the standard Next.js App Router structure.

-   `app/`: Contains the main application logic and pages.
    -   `layout.tsx`: The main layout for the application.
    -   `page.tsx`: The landing page of the application, which links to the different game modes.
    -   `classic/page.tsx`: The "Classic" Tic-Tac-Toe game mode.
    -   `crisscross/page.tsx`: The "Criss Cross" Tic-Tac-Toe game mode.
    -   `poof/page.tsx`: The "Tic-Tac-Poof" game mode.
-   `components/`: Contains reusable React components.
    -   `ui/`: Contains shadcn/ui components.
    -   `theme-provider.tsx`: The theme provider for the application.
    -   `theme-toggle.tsx`: The theme toggle component.
-   `lib/`: Contains utility functions.
-   `public/`: Contains static assets like images and fonts.
-   `next.config.ts`: The Next.js configuration file.
-   `tailwind.config.ts`: The Tailwind CSS configuration file.
-   `package.json`: The project's dependencies and scripts.

## Available Scripts

-   `npm run dev`: Starts the development server with Turbopack.
-   `npm run build`: Builds the application for production with Turbopack.
-   `npm run start`: Starts the production server.
-   `npm run lint`: Lints the codebase using ESLint.

## Game Modes

The application features several variations of Tic-Tac-Toe:

-   **Classic Tic-Tac-Toe:** The original 3x3 grid game. You can play against another player or an AI.
-   **Tic-Tac-Poof:** A version where moves disappear after a certain number of turns, preventing draws.
-   **Criss Cross:** A strategic 2D challenge where players build crosses to connect three in a row.

## Search Engine Optimization

To help search engines like Google index the site, we've included a `sitemap.xml` and `robots.txt` file in the `public/` directory.

-   `robots.txt`: This file tells search engine crawlers which pages they can or cannot access. It also points to the `sitemap.xml` file.
-   `sitemap.xml`: This file lists all the pages on the site, making it easier for search engines to discover and index them.

When you add new pages to the site, you should update the `public/sitemap.xml` file to include the new URLs. You can do this by manually adding a new `<url>` entry for each new page.
