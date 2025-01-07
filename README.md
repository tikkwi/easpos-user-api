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
- ```Hanlder``` that shouldn't allow direct http communication (only allow inter-service interaction) ***must*** start
  with `nc_` (we don't need validation for these handlers)
- Use `Entity`(include only entity's id) `EntityFull`(include all entity's fields) `EntityCompact`(include only some
  meta name, description etc.)
    - eg. `Product, ProductFull, ProductCompact`

## Don't

- Except standalone files that won't have connection with other files (eg. ```constant```),don't aggregate exports with
  barrel files(```index.ts``` -> ```export * ...```) which can raise tan of unexpected errors and circular dependencies
  which is very hard to trace..
- End-point can't be more than four segment (eg. ```/admin-api/user/```)
- User services **_mustn't_** be handle by user-api-app as for the offline app, as user is needed for authentication and
  codes will live in client device(for offline variant), there is a risk of misuse
- Don't store object_id in nested object, instead just save string version of object_id

## NOTE

- ### Cautions about ```Request Scope Service```
    - While ```Request Scope Service``` provide convenient way to maintain request-specific instance, it raise tons of
      challenges
    - ```Default Scope Service``` create only once and by the time they are create ```Request Scope Dependencies```
      are ```undefined``` and as ```Default Scope Service``` won't re-create instance, these will be ```undefined```
      forever
    - So we'll have to use run-time dep resolver like ```ModuleRef``` every time we need throughout the service
    - So, we should avoid ```Request Scope``` as much as we can and should handle ```Request``` specific state
      with ```Interceptor```.
