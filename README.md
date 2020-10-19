# React Multi-Page Application Starter

Structure for a Multi-Page Application using ReactJS and Webpack.

## Getting Started

To get started you'll want to clone the repository.

```
git clone git@github.com:dadlian/vegetable-lister.git
```

Alternatively you can download the source as a ZIP file from GitHub.

### Installation

Once you've downloaded the started project to your local machine. Getting it
installed is as as simple as navigating to the source root and invoking npm
from the CLI.

```
npm install
```

### Development

While developing you can view changes to your MPA in real-time via any browser of
your choice. To run the project locally via the Webpack test server, run the following
from your command prompt:

```
npm run serve
```

The project will now be available from your browser at localhost:3000. Webpack
will automatically watch your source code directory and refresh the page
whenever changes are made.

### Deploying

To deploy your MPA Project you will first need to build it. There are several
build options based on the environment you are deploying to.

To build for development:

```
npm run build-dev
```

To build for staging:

```
npm run build-staging
```

To build for production:

```
npm run build
```

Once built, your compiled files will be available in the /dist directory. The
contents of this folder can be uploaded via FTP, or other means, to your server
