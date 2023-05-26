## Docs for the Repo

  - [Codebase](#codebase)

    - [Technologies](#technologies)
    - [Folder Structure](#folder-structure)

  - [Project Setup](#project-setup)

    - [First time setup](#first-time-setup)
    - [Installation](#installation)
    - [Running the app locally](#running-the-app-locally)

  - [Testing](#testing)
  - [How to get started with Open Source](#how-to-get-started-with-open-source)
  - [How to use Dummygram](#how-to-use-dummygram)
  - [Contributing](#contributing)
  - [Rules](#rules)
 

## Codebase

### Technologies

With the ground rules out of the way, let's talk about the coarse architecture of this mono repo:

**Frontend JavaScript**: We use React to power our frontend apps. Almost all of the code you'll touch in this codebase will be JavaScript.
<img  src="http://3con14.biz/code/_data/js/intro/js-logo.png"  alt="JS"  width="30"  height="30">

Here is a list of all the big technologies we use:

- **React**: Frontend React app <img  src="https://raw.githubusercontent.com/jalbertsr/logo-badge-images/master/img/react_logo.png"  alt="REACT"  width="35"  height="35">

- **Firebase**: Data storage and Authentication <img  src="https://cdn4.iconfinder.com/data/icons/google-i-o-2016/512/google_firebase-2-128.png"  alt="FIREBASE"  width="30"  height="30">

### Folder structure

```sh

dummygram/

├── public # Public files used on the frontend

├── src # Frontend Code in React

```

## Project Setup

### First time setup

The first step to running dummygram locally is downloading the code by cloning the repository:

<details><summary>Video Demo to run Dummygram in your local under 2 minutes</summary> <br>

<https://github.com/narayan954/dummygram/assets/77617189/c21f0bdc-e845-4c32-b148-54d8048cbc33>

</details>

```sh

git clone git@github.com:narayan954/dummygram.git

```

If you get `Permission denied` error using `ssh` refer [here](https://help.github.com/articles/error-permission-denied-publickey/)

or use `https` link as a fallback.

```sh

git clone https://github.com/narayan954/dummygram.git

```

### Installation

Dummygram has a single installation step:

- **Install the dependencies**:

```sh

npm install

```

You've now finished installing everything! Let's start :100:

Ps: if you're getting error installing the dependencies, try --force command along with npm install. For example

```sh

npm install --force

```

Now you're ready to run the app locally and sign into your local instance!

### Running the app locally

#### Start the servers

To Start the development server run

```sh
npm start
```

<div  align="center"><img  height="200px"  src="https://user-images.githubusercontent.com/77617189/192947926-37284128-9965-46a4-b29b-c75e47b2f76b.svg" /></div>

## Testing

Here we will see, how to run tests and how to setup new test cases.
_We will be using Cypress for our testing purposes._

### Introduction to Cypress

<img src='https://docs.cypress.io/img/guides/overview/v10/real-world-app.png' width='920'>

<details><summary>See More</summary> <br>

Cypress is a relatively new automated tests tool which is gaining popularity at a very rapid pace

Here is the home page for Cypress if someone wants to look it up
<https://www.cypress.io/>

Cypress has very strong documentation so a new comer could find most of the information from their own site
<https://docs.cypress.io/guides/overview/why-cypress.html#In-a-nutshell>

Also as a starting point it would be good to go through these tutorial videos
<https://docs.cypress.io/examples/tutorials>

</details>

---

### Start Testing

> You need to [setup](#project-setup) the project as usual, and after that we can run our test cases.

<sub>See It Running</sub>

<https://user-images.githubusercontent.com/84321236/223492442-1b161401-4ca2-41f7-832d-7302e2832b5a.mp4>

<details><summary>See More</summary> <br>

1. **Run This Command**

```zsh
npm run cypress:open
```

_It will open up this window,_

<img src='https://i.ibb.co/QC72wq8/image.png' width='720'>

> As you can see, we only added E2E testing

2. **Click on E2E Testing & Select Browser**

<img src='https://i.ibb.co/4TpgRgG/image.png' width='720'>

3. **Now Click on any Test to Run it**

<img src='https://i.ibb.co/z59yv8B/image.png' width='720'>

</details>

---

### Create New Test Cases

Working Directory: `/cypress/` <br>
E2E Files: `/cypress/e2e/`

<img width="720" alt="image" src="https://user-images.githubusercontent.com/84321236/223501582-99163f05-940c-4e9a-a59a-8951a1be1e3a.png">

<details><summary>See More</summary> <br>

**To Create New E2E Tests**

1. Goto `/cypress/e2e/`
2. You can create new file (similar to `spec.cy.js`). <br>
   **OR** add new `it` function inside existing `describe` function in this existing file.

<img width="720" alt="test-file-screenshot" src="https://user-images.githubusercontent.com/84321236/223485219-2fd93fa7-686e-4a60-92b0-2a927ee4a7b0.png">

3. Then, [test](#start-testing) your test cases:

   ```zsh
   npm run cypress:open
   ```

</details>

---

## How to get started with Open Source

Here's a quick rundown on how to get started with open source. First of all, let's know some basic terminologies:

- Git: This is a versioning system that lets you store your code and code history on your local computer, preventing loss and allowing sharing of that code.
- Github: This is a server that lets you store the history in a database.
- Open Source: A project is said to be open sourced if you can see the code on GitHub.
- Fork: This is a copy that you make of a project on GitHub, it gets added to your repositories.
- Repository: A project on GitHub is called a repository.
- Pull Request: This is a fix for an issue proposed to be done in a project, this consists of you editing a file in the project.
- Issue: An issue is a change that should be done in a project, can be a bug, a new feature or a suggestion to a project.
- Branch: A branch is a new workspace derived from the default workspace(main or master) that allows you to work on something without affecting the original code.

Now you know some basic terms, let's get into how to get started with some resources to let you understand open source better:

- [Video on Crash Course to Git and Github](https://www.youtube.com/watch?v=apGV9Kg7ics) 
- [Video on a complete Guide to Open Source](https://www.youtube.com/watch?v=yzeVMecydCE) 
- [Article on Guide to Open Source](https://www.freecodecamp.org/news/how-to-contribute-to-open-source-projects-beginners-guide/) 
  
## How to use Dummygram

[Flow of Control](FlowOfControl.md)

## Contributing

**We heartily welcome any and all contributions that match our engineering standards! :raised_hands:**

That being said, this codebase isn't your typical open source project because it's not a library or package with a limited scope—it's our entire product.

## Rules

- **No `console.log`s in any file**: We use the `debug` module across the codebase to log debugging information in development only. Never commit a file that contains a `console.log` as CI will fail your build. The only exceptions are errors, which you can log, but you have to use `console.error` to be explicit about it
- **Code reviews**: All submissions, including submissions by project members, require review. We use GitHub pull requests for this purpose.

### Contributions and discussion guidelines

🎊All conversations and communities on Dummygram agree to GitHub's [Community Guidelines](https://help.github.com/en/github/site-policy/github-community-guidelines) and [Acceptable Use Policies](https://help.github.com/en/github/site-policy/github-acceptable-use-policies).

🎊Code of conduct is applied for all conversations that happen within the contributor community here on GitHub.

🎊Discussions are important,productive and respectful.

🎊**Remember**:-There are real people on the other side of that screen:exclamation:

### Reporting a bug or discussing a feature idea

If you found a technical bug on Dummygram or have ideas for features we should implement, the issue tracker is the best place to share your ideas. Make sure to follow the issue template and you should be golden! ([click here to open a new issue](https://github.com/narayan954/dummygram/issues/new))

### Fixing a bug or implementing a new feature

- If you find a bug on Dummygram and open a PR that fixes it we'll review it as soon as possible to ensure it matches our engineering standards.
- If you want to implement a new feature, open an issue first to discuss what it'd look like .
- If you want to contribute but are unsure to start, we have [a "good first issue" label](https://github.com/narayan954/dummygram/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22) which is applied to newcomer-friendly issues. Take a look at [the full list of good first issues](https://github.com/narayan954/dummygram/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22) and pick something you like!
- Want to fix a bug or implement an agreed-upon feature? Great, jump to the [local setup instructions](#first-time-setup)!

## Code of Conduct

Dummygram is now part of GitHub. For code of conduct, please see [GitHub's Community Guidelines](https://help.github.com/en/github/site-policy/github-community-guidelines) and [Acceptable Use Policies](https://help.github.com/en/github/site-policy/github-acceptable-use-policies).

<div  align="center"><img  height="70px"  src="https://user-images.githubusercontent.com/77617189/192942891-31b9152c-918b-4fac-af05-0ad6b1f594aa.svg"  /></div>

