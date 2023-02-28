<div align="center">

<img  src=" src/assets/app-logo.png"  alt="Dummygram"  width="250"  height="200">

[See Live!](https://dummy-gram.web.app/)

### _Instagram_, dummified

![Issues](https://img.shields.io/github/issues/narayan954/dummygram?color=brightgreen)
![Pull requests](https://img.shields.io/github/issues-pr/narayan954/dummygram)
![Forks](https://img.shields.io/github/forks/narayan954/dummygram)
![Stars](https://img.shields.io/github/stars/narayan954/dummygram)
![Licence](https://img.shields.io/github/license/narayan954/dummygram?color=orange)

---

</div>

# What is Dummygram?

## Vision

When you learn ReactJs it seems obvious to work on some projects and for the projects you might want to choose something that interests you. How about a clone of the app developed by the company that released ReactJs ? Yes, you might be getting the point, this application is basically a clone of the original Instagram and tends to add features like instagram or in fact the features that could not have been added in the instagram. So what are you waiting for? Use this opportunity to contribute and learn. :smiley:

## Status

Dummygram has been in development since September 2022 and is part of GitHub since the very beginning. Our current priorities and what we are working on is kind of obvious, but still we want to give it a unique look and make it feature rich.:sparkles:

# Table of Contents

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
        <a href="#codebase">Codebase</a>
        <ul>
          <li><a href="#technologies">Technologies</a></li>
		  <li><a href="#folder-structure">Folder Structure</a></li>
        </ul>
      </li>
      <li>
        <a href="#project-setup">Project Setup</a>
        <ul>
          <li><a href="#first-time-setup">First time setup</a></li>
          <li><a href="#installation">Installation</a></li>
		      <li><a href="#running-the-app-locally">Running the app locally</a></li>
        </ul>
      </li>
      <li><a href="#how-to-get-started-with-open-source">How to get started with Open Source</a></li>
      <li><a href="#how-to-use-dummygram">How to use Dummygram</a></li>
      <li><a href="#contributing">Contributing</a></li>
      <li><a href="#rules">Rules</a></li>
      <li><a href="#open-source-programs">Open Source Programs</a></li>
      <li><a href="#license">License</a></li>
  </ol>
</details>






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
npm run dev
```

<div  align="center"><img  height="200px"  src="https://user-images.githubusercontent.com/77617189/192947926-37284128-9965-46a4-b29b-c75e47b2f76b.svg"  /></div>

## How to get started with Open Source

Here's a quick run down on how to get started with open source, first of all let's know some basic terminologies:

- Git: is a versioning system that let's you store your code and code history on your local computer preventing loses and allowing sharing of that code
- Github: is a server that let's you store the history in a database
- Open Source: A project is said to be open sourced if you can see the code on GitHub
- Fork: This is a copy that you make of a project on GitHub, it gets added to your repositories
- Repository: A project on GitHub is called a repository
- Pull Request: This is a fix for an issue proposed to be done in a project, this consists of you editing a file in the project.
- Issue: An issue is a change that should be done in a project, can be a bug, a new feature or a suggestion to a project
- Branch: A branch is a new workspace derived from the default workspace(main or master), it allows you to work on something without affecting the original code

Now you know some basic terms, let's get into how to get started with some resources to let you understand open source better:

- [Crash Course to Git and Github](https://www.youtube.com/watch?v=apGV9Kg7ics) - Video
- [A complete Guide to Open Source](https://www.youtube.com/watch?v=yzeVMecydCE) - Video
- [Guide to Open Source](https://www.freecodecamp.org/news/how-to-contribute-to-open-source-projects-beginners-guide/) - Article

## How to use Dummygram

[Flow of Control](FlowOfControl.md)

## Contributing

**We heartily welcome any and all contributions that match our engineering standards! :raised_hands:**

That being said, this codebase isn't your typical open source project because it's not a library or package with a limited scope—it's our entire product.

## Rules

- **No `console.log`s in any file**: We use the `debug` module across the codebase to log debugging information in development only. Never commit a file that contains a `console.log` as CI will fail your build. The only exceptions are errors, which you can log, but you have to use `console.error` to be explicit about it
- **Code reviews**: All submissions, including submissions by project members, require review. We use GitHub pull requests for this purpose.

### Contributions and discussion guidelines

All conversations and communities on Dummygram agree to GitHub's [Community Guidelines](https://help.github.com/en/github/site-policy/github-community-guidelines) and [Acceptable Use Policies](https://help.github.com/en/github/site-policy/github-acceptable-use-policies). This code of conduct also applies to all conversations that happen within our contributor community here on GitHub. We expect discussions in issues and pull requests to stay positive, productive, and respectful. **Remember**: There are real people on the other side of that screen:exclamation:

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


## <h1 align=center>Open Source Programs</h1>

<p align="center">

<a href="https://hacktoberfest.com/"><img alt="hacktoberfest logo" src="https://user-images.githubusercontent.com/79099734/189589410-ca17afb8-5855-4316-918a-054f27594809.png"></a>

<p align="center">
<a href="https://www.codepeak.tech/"><img alt="codepeak" src="https://user-images.githubusercontent.com/77617189/205454287-c5bffb68-d08f-4103-a191-02b7f54fb81f.png" width="47%" height="400"></a>
&nbsp; &nbsp; &nbsp; &nbsp;
<a href="https://kwoc.kossiitkgp.org/"><img alt="kwoc" src="https://user-images.githubusercontent.com/77617189/205456062-b28a333d-c48b-41ef-96c3-676ef2363ade.png" width="47%" height="400"></a>
</p>

<a href="https://iwoc.live/"><img alt="iwoc program" src="https://user-images.githubusercontent.com/77617189/215256338-87d294c6-c33e-4da6-8236-f8ab6fae6c4b.png"></a>
<a href="https://jwoc.tech/"><img alt="jwoc program" src="https://user-images.githubusercontent.com/77617189/219851281-59de273a-388a-4367-a7c6-39d37196ee90.png"></a>

</p>

## <h1 align=center>CONTRIBUTION 👏</h1>



## 🧑‍💻 About the Admin

| Admin   | 
| :----------: | 
|<a href="https://github.com/narayan954"><img src="https://avatars.githubusercontent.com/narayan954" width=150px height=150px /></a><br>Narayan soni<br>|
<br>

## 👩🏽‍💻 Contributing

- Contributions make the open source community such an amazing place to learn, inspire, and create.
- Any contributions you make are greatly appreciated.
- Check out our [contribution guidelines](/CONTRIBUTING.md) for more information.

<br>

## Thanks to all Contributors 💪

Thanks a lot for spending your time helping dummygram grow. Thanks a lot! Keep rocking 🍻

[![Contributors](https://contrib.rocks/image?repo=narayan954/dummygram)](https://github.com/narayan954/dummygram/graphs/contributors)

## License

**MIT License, see the [LICENSE](./LICENSE) file.**

<br>
---
<div align="center">
    <h3><b>Take a moment to star ⭐ the project if you like it</b></h3>
    <h3>Do checkout the other repos 💫</h3> 
</div>
