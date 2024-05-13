# Apartments Service

This API stores and provides info on properties in the system.

### Dependencies

- Ruby 3.3.1
- Geocoder
- Postgres
- PostGIS
- OpenStreetMaps
- Redis (for caching)
- Supabase (for user authentication and image storage)

```shell
gem install bundler
```

<br>

### Caching

Redis is used for caching data records retrieved in API queries. The Cachable module in app/models/concerns/cachable.rb handles the caching logic.

### User Authentication and Image Storage

Supabase is used for user authentication and image storage. User data is back-filled into the main application (/api/users/create) after successful creation in Supabase.

### Scalability

For scaling in production, it may be beneficial to keep the user database and properties database separate for horizontal scalability. We can use Elasticsearch as a separate search index to offload search volume to an isolated service (whose results we can then cache in Redis for optimal search performance across the network).

Incorporating Elasticsearch for search functionality is outside the scope of this test project, but an example of how to incorporate it can be found in apt-rentals/app/models/concerns/searchable.rb, along with an example bounding box geo-query.

### Multi-Client Support

Multiple clients can be added to the package at `react/packages/package.json`.

Currently, a web client is available at `react/packages/apt`. This can be extended into its own repo in the form of a Git submodule.

### Installation

Ruby 3.3.1 is required to run the REST API service.

To run the client, make sure you have Node & Yarn installed in your system. Recommended node version >=v20.9.0 and yarn v1.22.19. You check your ones by running these commands-

```shell
ruby -v
yarn -v
```

RVM installation is recommended for ruby version management.

Then set up Rails:
```shell
bundle install
rails db:create db:migrate
```

If it's not installed in your system then please install them by checking official documentation of,

1. https://nodejs.org/en/
2. https://yarnpkg.com/lang/en/docs/install/

```shell
# in workspace root folder
bundle
rails db:setup db:migrate
cd react/packages && yarn
```

### Testing

```shell
$ bundle exec rspec spec/
```

### Usage

To run the API:
```shell
rails s -p 3005
```

To run the web client:

```shell
cd react/packages && yarn start:apt
```

Concurrently run an instance of the API service and web client:
```shell
bash start-server.sh
```
