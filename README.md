<div align="center">

<img src="https://user-images.githubusercontent.com/77617189/192938064-17157845-e074-45cb-bb2d-4773a8cb1602.png" alt="Dummygram" width="200" height="200">

(https://dummy-gram.web.app/)

### Instagram, dummified.

</div>

## What is Dummygram?

### Vision

When you learn ReactJs it seems obvious to work on some projects and for the projects you might want to choose something that interests you, maybe a clone of the app developed by the company that released ReactJs? Yes, you might be getting the point, this application is basically a clone of the original Instagram and tends to add features like instagram or maybe in fact the features that could not have been added in the instagram.

### Status

Dummygram has been in full-time development since september 2022 and is part of GitHub since the very beginning. Our current priorities and what we are working on in the flexible and kind of obvious, but still we want to give it a unique look and make it feature rich

<div align="center">
  <img height="50px" alt="cluster" src="https://user-images.githubusercontent.com/77617189/192940070-15abdfcf-b8c7-4c13-aebf-7640ead16503.svg" />
</div>


## Docs

- [Contributing](#contributing)
  - [Ground Rules](#ground-rules)
  - [Codebase](#codebase)
    - [Technologies](#technologies)
    - [Folder Structure](#folder-structure)
    - [Code Style](#code-style)
  - [First time setup](#first-time-setup)
  - [Running the app locally](#running-the-app-locally)
  - [Roadmap](https://github.com/withspectrum/spectrum/projects/19)
- [Technical](docs/)
  - [Testing](docs/testing/intro.md)
  - [Background Jobs](docs/workers/background-jobs.md)
  - [Deployment](docs/deployments.md)
  - [API](docs/backend/api/)
    - [Fragments](docs/backend/api/fragments.md)
    - [Pagination](docs/backend/api/pagination.md)
    - [Testing](docs/backend/api/testing.md)
    - [Tips and Tricks](docs/backend/api/tips-and-tricks.md)

## Contributing

**We heartily welcome any and all contributions that match our engineering standards!**

That being said, this codebase isn't your typical open source project because it's not a library or package with a limited scope—it's our entire product.

### Ground Rules

#### Contributions and discussion guidelines

All conversations and communities on Dummygram agree to GitHub's [Community Guidelines](https://help.github.com/en/github/site-policy/github-community-guidelines) and [Acceptable Use Policies](https://help.github.com/en/github/site-policy/github-acceptable-use-policies). This code of conduct also applies to all conversations that happen within our contributor community here on GitHub. We expect discussions in issues and pull requests to stay positive, productive, and respectful. Remember: there are real people on the other side of that screen!

#### Reporting a bug or discussing a feature idea

If you found a technical bug on Dummygram or have ideas for features we should implement, the issue tracker is the best place to share your ideas. Make sure to follow the issue template and you should be golden! ([click here to open a new issue](https://github.com/narayan954/dummygram/issues/new))

#### Fixing a bug or implementing a new feature

If you find a bug on Dummygram and open a PR that fixes it we'll review it as soon as possible to ensure it matches our engineering standards.

If you want to implement a new feature, open an issue first to discuss what it'd look like .

If you want to contribute but are unsure to start, we have [a "good first issue" label](https://github.com/narayan954/dummygram/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22) which is applied to newcomer-friendly issues. Take a look at [the full list of good first issues](https://github.com/narayan954/dummygram/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22) and pick something you like!

Want to fix a bug or implement an agreed-upon feature? Great, jump to the [local setup instructions](#first-time-setup)!

<div align="center">
  <img height="70px" src="https://user-images.githubusercontent.com/77617189/192940773-639eb52f-e688-4a5f-9c49-8184246345fa.svg" />
</div>

### Codebase

#### Technologies

With the ground rules out of the way, let's talk about the coarse architecture of this mono repo:

**Frontend JavaScript**: We use React to power our frontend apps. Almost all of the code you'll touch in this codebase will be JavaScript.
  Here is a list of all the big technologies we use:

- **React**: Frontend React app
- **Firebase**: Data storage and Authentication

#### Folder structure

```sh
dummygram/
├── public     # Public files used on the frontend
├── src        # Frontend Code in React
```

#### Code Style

We run Prettier on-commit, which means you can write code in whatever style you want and it will be automatically formatted according to the common style when you run `git commit`. We also have ESLint set up, although we've disabled all stylistic rules since Prettier takes care of those.

##### Rules

- **No `console.log`s in any file**: We use the `debug` module across the codebase to log debugging information in development only. Never commit a file that contains a `console.log` as CI will fail your build. The only exceptions are errors, which you can log, but you have to use `console.error` to be explicit about it

<div align="center">
  <img height="70px" src="https://user-images.githubusercontent.com/77617189/192942891-31b9152c-918b-4fac-af05-0ad6b1f594aa.svg" />
</div>

### First time setup

The first step to running dummygram locally is downloading the code by cloning the repository:

```sh
git clone git@github.com:narayan954/dummygram.git
```

If you get `Permission denied` error using `ssh` refer [here](https://help.github.com/articles/error-permission-denied-publickey/)
or use `https` link as a fallback.

```sh
git clone https://github.com/narayan954/dummygram.git
```

#### Installation

Dummygram has a single installation step:
- **Install the dependencies**: 

```sh
node shared/install-dependencies.js
```

You've now finished installing everything! Let's start :100:

Now you're ready to run the app locally and sign into your local instance!

### Running the app locally

#### Start the servers

Depending on what you're trying to work on you'll need to start servers. Generally, all servers run in by doing `npm install`, but if you run if some dependancy installation issues you may try `npm install --force` to run the server ignoring warnings.

<br />	
<div align="center">	
  <img height="200px" src="https://user-images.githubusercontent.com/77617189/192947926-37284128-9965-46a4-b29b-c75e47b2f76b.svg" />	
</div>

## GitHub

Dummygram is now part of GitHub. For code of conduct, please see [GitHub's Community Guidelines](https://help.github.com/en/github/site-policy/github-community-guidelines) and [Acceptable Use Policies](https://help.github.com/en/github/site-policy/github-acceptable-use-policies).

## License

BSD 3-Clause, see the [LICENSE](./LICENSE) file.
