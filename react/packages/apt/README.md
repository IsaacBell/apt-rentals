# Apartment Search Web Client Documentation

## Introduction

This is a Next.js app which depends on the Rails back end.

## Requirements

- node(20.9.0 or later)
- yarn(version 1.22.19)
- editor: Visual Studio Code(recommended)

## Tech We Have Used

Tech specification for this template is given below

- [React](https://reactjs.org/)
- [NextJs](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)

### Step 1 : Configure your env file

Within the project directory you'll find a `.env.example` file. Ask a dev for a `.env.local` file.

<br/>
<br/>
<br/>

### Step 2 : Running the project

Run below command for getting started with this template.

```bash
$ cd react/packages
$ yarn start:apt
```

If you want to test your production build in local environment then run the below commands.

```bash
# build for production
yarn build

#start template in production mode
yarn start
```

## Folder Structure & Customization

- To setup you site's basic information like **[Logo,Site title,Description etc]** go to -> `boat/src/app/layout.tsx` file
- To customize tailwind configuration go to -> `tailwind.config.js` file .
- `/public`: This folder contains `all the static data` used in this project.
- `/src/app`: This folder contains all the pages and layouts.
- `/src/components`: This folder contains all the template related ui components.
- `/src/components/ui`: This folder contains all the common sections related components.
- `/src/contexts`: This folder contains all necessary context for this template . Like `modal, drawer, gallery` etc.
- `/src/styles`: Overwrites some third party packages CSS files and our custom CSS in the `global.css` file.
- `/src/hooks` : This folder contains `hooks` etc.
- `/src/config` : This folder contains `routes, api-endpoints, constants` etc.
- `/src/pages` : This folder contains `404.tsx` file for not found or unmatching routes.
- `/src/types` : This folder contains common used types arround this project.

<br/>
<br/>
<br/>
