## Adding Lib As Submodule

 ```bash
 git submodule add git@github.com:tinkokowin96/easpos-api-libs.git libs
 ```

## tsconfig

```JSON 
"typeRoots": ["libs/common/types"],
"paths": {
"@app/*": ["src/utils/*"],
"@common/*": ["libs/common/src/*"],
"@global/*": ["libs/global/src/*"]
} 
```

## Common

- For ```schema/dto```, only add core and those that need communication with other apps

## Do

- ```Service``` class ***must*** extend ```CoreService``` and use ```AppService``` rather than ```Injectable```
- ```Controller``` class ***must*** extend ```CoreController``` and use ```AppController``` rather than ```Controller```
- Use `Entity`(include only entity's id) `EntityFull`(include all entity's fields) `EntityCompact`(include only some
  meta name, description etc.)
    - eg. `Product, ProductFull, ProductCompact`
- Only request other app's service at the end of the first party app's service wherever possible to be able to roll back
  the transaction if something goes wrong

## Don't

- End-point can't be more than four segment (eg. ```/admin-api/user/```)
- Don't store object_id in nested object, instead just save string version of object_id

## NOTE

- ### Cautions about `Barrel Files` (```index.ts``` -> ```export * ...```)
    - Barrel files are used to aggregate exports from several files into a single file. This is a common pattern in
      JavaScript and TypeScript projects because it allows you to import multiple modules from a directory using a
      single
      path.
    - However, barrel files can cause unexpected errors and circular dependencies which is very hard to trace.
    - So, it's better to avoid barrel files as much as possible.
    - In short word, don't barrel export from a directory that has dependencies(`import`)

- ### Cautions about ```Request Scope Service```
    - While ```Request Scope Service``` provide convenient way to maintain request-specific instance, it raises tons of
      challenges
    - ```Default Scope Service``` create only once and by the time they are create ```Request Scope Dependencies```
      are ```undefined``` and as ```Default Scope Service``` won't re-create instance, these will be ```undefined```
      forever
    - So we'll have to use run-time dep resolver like ```ModuleRef``` every time we need throughout the service
    - So, we should avoid ```Request Scope``` as much as we can and should handle ```Request``` specific state
      with ```Interceptor```.
- ### Request Context (HTTP)
    - Why we don't add request context to body(which is more flexible, we don't need @Req on every handler) is becz
      class-validator validate `DTO` on the request body and trigger `Max call stack size exceeded` error. Whether
      `@Allow, @Exclude, @ValidateIf=> false or ever valid custom validator` can't help to avoid validating request
      context
