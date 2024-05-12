# Rails 7 & React Boilerplate Starter

This project provides a robust starting point for applications built with Rails 7 and React, featuring a structured environment with a set of predefined functionalities and configurations to expedite the development process.

### Dependencies

- Geocoder
- Postgres
- PostGIS
- OpenStreetMaps

```shell
gem install bundler
```

<br>

### Installation

Make sure you have Node & Yarn installed in your system. Recommended node version >=v20.9.0 and yarn v1.22.19. You check your ones by running these commands-

```shell
ruby -v
yarn -v
```

RVM installation is also recommended.

Then set up Rails:
```shell
bundle install
rails db:create db:migrate
```

If it's not installed in your system then please install them by checking official documentation of,

1. https://nodejs.org/en/
2. https://yarnpkg.com/lang/en/docs/install/

```shell
git clone https://github.com/IsaacBell/rails-react-starter-q3-23.git
cd rails-react-starter-q3-23
bundle
yarn
rails db:setup db:migrate
```



### Usage

```shell
./bin/dev
```
