+++
date = "2015-05-01T10:21:48-04:00"
title = "Develop & Deploy Ghost with PM2"

+++
<!-- Introduction here -->

## Setting Up

If you already have a git repository setup and a `package.json` you can skip to [Dependencies](#dependencies).

### Project

Create a git repository for this project:

* `git init <project name>`
* `cd <project name>`

Then create your package.json the easy way:

* `npm init`

### Dependencies

Install global dependencies like [Grunt](https://www.npmjs.com/package/grunt) and [PM2](https://www.npmjs.com/package/pm2) and package dependencies like [Ghost](https://www.npmjs.com/package/ghost) and [Shrinkwrap](https://docs.npmjs.com/cli/shrinkwrap):

* `npm install -g grunt pm2`
* `npm install ghost shrinkwrap --save`

Next, create the project's index file at the root of the project. This is the entry point PM2/Node.js will use to start your app This can be whatever you like and I'll use `index.js` for the rest of the post.

Add the following to `index.js` and save it.
```
// Start Ghost
var ghost = require('ghost');
ghost().then(function (ghostServer) {
    ghostServer.start();
});
```

With that you can now run Ghost:
`pm2 start index.js --name "<process name>"`

Upon visiting http://localhost:2368 you should see the standard blog with the standard Casper theme and the default "Welcome to Ghost" blog post.

Visit http://localhost:2368/ghost/ to setup your development blog. Be sure to remember your username and password for the future. It doesn't need to be a real email address or even a secure password at thispoint because you'll only be accessing the backend from your local computer. If the page hangs quite some time, just refresh and you should be prompted to log in.

That's it. You're all setup.

## Development

If your Ghost server is still running, stop it with:
`pm2 stop <app name>`

Up until now, Ghost has been using the `content` directory in `node_modules/ghost/` to store application data, themes, images, and Ghost apps. We'll need to define a new place to store all of these things so npm doesn't overwrite on the next `npm install` or `npm update` command.

### Create a `config.js` for Ghost

Before we can adjust and configuration values to tell Ghost where we expect the `content` directory to be, as well as a host of other things, such as which port to listen on and how to send emails, we need a configuration file and we need to tell Ghost where it is.

Grab the example config from [Github](https://github.com/TryGhost/Ghost/blob/master/config.example.js) or copy it from `/node_modules/ghost/config.example.js`. Run `cp node_modules/ghost/config.example.js config.js` to copy the one npm grabbed for you. Edit the new `config.js` to remove any testing related configs for the Ghost core. This will prevent you from getting confused later on. You should be left with a "production" object and a "development" object in the "config" object in `config.js`.

Ghost expects the file and folder stucture from before to be in place wherever we tell it the `content` directory is. Run `cp -R node_modules/ghost/content/ content/` to copy the entire content directory from `node_modules` to the root of the project.

### Pass Configuration into Ghost

In `index.js` we're going to tell ghost to use the `config.js` file as it's configuration file. We can pass the `ghost()` call an object to tell it which configuration file to load: 

```
var path = require('path'),
    ghost = require('ghost');

ghost({
  config: path.join(__dirname, 'config.js')
}).then(function (ghostServer) {
  ghostServer.start();
});

```

*Don't forget to create and instance of the Node.js `path` object on line 1.*

You can now create themes and apps as you normally would with Ghost. Just be sure to edit files in the `content/` directory at the root of the project, **Not** the one in `node_modules/ghost/`.

### Before You Commit

Before you commit changes it's probably a good idea to stop the PM2 process and add `content/data/*.db` to your `.gitignore` since it's the folder SQLite uses to store databases and they have the `.db` extention.

If you already commited the SQLite database you can still edit your `.gitignore` and then run `git m -r --cached content/data/*db` to remove it from git's index. Finally, commit the `.gitignore` and the "deleted" files from git's index as usual.

## Setting up PM2 for Deployment

Since version 0.9.0, PM2 has been able to deploy code for you. To see the commands availble for deployment run `pm2 deploy help`.

### Create an ecosystem.json

To get started setting up PM2 for deployment let's have PM2 do some of the work for us. While in your project root, run `pm2 ecosystem`.

For me, this generated an `ecosystem.json5` file in the project root. [JSON5](http://json5.org) is an extention to JSON that adds some additional features to JSON like comments and unquoted keys. I'm not a fan of JSON5 for a couple of reasons, this little warning doesn't help:

> JSON5 is not an official successor to JSON, and JSON5 content may not work with existing JSON parsers. For this reason, JSON5 files use a new .json5 extension.
- [json5.org](http://json5.org)

Later, when I tried to use thie file, PM2 was still looking for `ecosystem.json` not `ecosystem.json5` so I decided to rename it to the former. I'll suggest you do the same until I know differently.

Once the file has been generated, you'll want to edit it with your projects configuration. Sine we rename the extention, we should make sure it's valid JSON first.

Here's what my `ecosystem.json` looks like:

```
{
  "apps": [{
		"name": "<project name>",
		"script": "index.js"
  }],

  "deploy": {
    "production" : {
      "user": "<user to run as on production>",
      "host": "<production IP or domain>",
      "ref": "origin/<production branch>",
      "repo": "git@github.com:<Github username>/<project name>.git",
      "path": "/var/www/<production directory>",
      "post-deploy": "npm install --production && pm2 startOrRestart ecosystem.json --env production",
      "env": {
        "NODE_ENV": "production"
      }
    },
    "staging": {
      "user": "<user to run as on stage>",
      "host": "<staging IP or domain>",
      "ref": "origin/<staging branch>",
      "repo": "git@github.com:<github username>/<project name>.git",
      "path": "/var/www/<staging directory>",
      "post-deploy": "npm install --production && pm2 startOrRestart ecosystem.json --env staging",
      "env": {
        "NODE_ENV": "staging"
      }
    }
  }
}
```

In the above config, "script" under "apps" array refers to the entry-point script you made above. I've been calling it `index.js` in this post. I for my `staging` config I tell PM2 to set my `NODE_ENV` variable to be set to "staging" because in my config.js I have a "staging" key. Ghost will load the config key of the same name as the value of `NODE_ENV`.


### Deploy Key

If your server is new you may not have setup public/private keypair authentication. Follow the instructions [Github provides](https://help.github.com/articles/generating-ssh-keys/#platform-linux). You'll then want to add this key as a deploy key for your project on Github. This will allow PM2 to authenticate with Github to clone the repo.

While you are also connected to the server you should install PM2 using npm, just as you did before locally (`npm install -g pm2`).

### Deploying

Be sure that Github is in the server's `known_hosts` file or you'll get cloning errors. This can be done by running `ssh git@github.com` on the server and accepting the prompt to add it to the file.

We need to have PM2 setup the server for deployment. Run `pm2 deploy <ecosystem.json config key> setup` from your local machine. For example, to setup my "staging" config above I would run `pm2 deploy staging setup`. I would expect to see something like this:

```
$ pm2 deploy staging setup
--> Deploying to staging environment
--> on host <staging IP or domain>
  ○ running setup
  ○ cloning git@github.com:alecho/<project name>.git
Cloning into '/var/www/<staging directory>/source'...
Warning: Permanently added the RSA host key for IP address '**Github's IP here**' to the list of known hosts.
  ○ setup complete
--> Success
```

Once PM2 is done setting up the server run `pm2 deploy <ecosystem.json config key>`. Just like above, this would be `pm2 deploy staging` for my staging environment and should output something like:

```
$ pm2 deploy staging
--> Deploying to staging environment
--> on host <staging IP or >
  ○ deploying
  ○ hook pre-deploy
  ○ fetching updates
Fetching origin
Warning: Permanently added the RSA host key for IP address '**Github's IP here**' to the list of known hosts.
  ○ resetting HEAD to origin/staging
HEAD is now at <git hash for latest commit on origin/staging> <commit message here>
  ○ executing post-deploy `npm install && pm2 startOrRestart ecosystem.json --env staging`

** npm install output here **
```

You shoudl then see the typical output of `pm2 list` with the Ghost blog process running followed by:

```
 Use `pm2 show <id|name>` to get more details about an app
  ○ hook test
  ○ successfully deployed origin/staging
--> Success
```

### That's It!

You're now able to deploy your latest changes to staging and production environments with ease. There's no reason you couldn't setup a deveopment enviroment with PM2 as well but I find that Ghost is easy enough to just "clone", "install", and "start" that I haven't yet.

If you run into issues or know of a better way of doing things let me know in the comments.
