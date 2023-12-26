This is a Remix + FusionAuth boilerplate for anyone who wants to quickly spin up a SaaS using these technologies.

## Demo

To host the demo, We need a DigitalOcean droplet with 2GB RAM for FusionAuth to run.
You can make this happen by making a donation at https://github.com/sponsors/akoskm. 🙇‍♂️

## Setup

You must change your /etc/hosts file to test multi-tenant sign-up and sign-in. Add the following entries:

```
127.0.0.1       localhost       saasbp.io
127.0.0.1       localhost       example.saasbp.io
```

With this, you can reach the site at http://saasbp.io:3000 and http://example.saasbp.io:3000, which is necessary to test the multi-tenant sign-up and sign-in.

## Development

### FusionAuth

```
docker compose up -d
```

if you want to reset the FusionAuth system, run:

```
docker compose down -v
```

[FusionAuth Docs](https://fusionauth.io/docs/)

### Remix

```sh
npm i
npm run dev # To debug the app run this command in Run and Debug > JavaScript Debug Terminal, no other config needed
```

This starts your app in development mode, rebuilding assets on file changes.

[Remix Docs](https://remix.run/docs)

## Deployment

```sh
npm run build
npm start
```

### DIY

If you're familiar with deploying node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `remix build`

- `build/`
- `public/build/`

# Screenshots

## Sign Up

<img width="1150" alt="Xnapper-2023-11-30-12 20 48" src="https://github.com/akoskm/saas/assets/3111627/04abd82d-cd54-46bd-ae74-e209e50580df">

## Sign in

![image](https://github.com/akoskm/saas/assets/3111627/56957ae7-fe6a-4b6a-8543-f0986ddf2c67)

## User area

![image](https://github.com/akoskm/saas/assets/3111627/5d246d48-76fe-4999-b6c6-889d4c27543b)
