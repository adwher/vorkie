Vorkie is a declarative JavaScript & TypeScript library for building web server applications. Instead of use "auto-magicly" generated code, Vorkie provides a declarative way to abstract the logic of your application by providing a simple API to be productive and collaborative building your application block-by-block.

## Features

-   100% TypeScript.
-   Flexible schema definition as you business needs.
-   Modular design to extends with features as needed.
-   Fast as lightning.
-   Use only what you need to use.

## Why Vorkie?

### Declarative

Declare your collections, fields, databases, plugins and set them up, without complexity or "auto-magic" code. Vorkie provides the tools to define the core of it, and on top Vorkie, build all the abstractions needed to build awesome applications.

### Modular

Set up your application block-by-block using plugins with features you need. Vorkie was designed with the idea to be extensible and have only a small core with a set of basic features, and then extend it with plugins, custom fields and database adapters.

> Even a basic RESTful HTTP API is defined as a plugin.

### Performant

Under the hood, Vorkie uses [Polka](https://github.com/lukeed/polka) an extremely minimal, highly performant [native-HTTP](https://github.com/lukeed/polka#:~:text=Polka%20is%20just%20a-,native%20HTTP%20server,-with%20added%20support) based server, who offer some awesome features like:

-   Up to ~80K request/second, based on results of [Web Frameworks Benchmark](https://web-frameworks-benchmark.netlify.app/result?l=javascript).
-   33-50% faster than Express for simple applications.
-   Middleware support, including Express middleware you already know & love.
-   ~90 LOC for [Polka](https://github.com/lukeed/polka), 120 including its router.

## License

[MIT](./LICENSE) - Andres Celis ([@adwher](https://github.com/adwher))
