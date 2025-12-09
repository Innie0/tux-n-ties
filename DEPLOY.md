# How to Deploy Changes

## Quick Deploy (Easiest)

After making changes to your code, run:

```bash
npm run push
```

This will automatically:
1. Add all your changes
2. Commit them
3. Push to GitHub
4. Vercel will automatically deploy

## Alternative: Use the Script

You can also use the push script:

```bash
./push.sh "Description of your changes"
```

Example:
```bash
./push.sh "Updated homepage design"
```

## Manual Method

If you prefer to do it manually:

```bash
git add -A
git commit -m "Your commit message"
git push origin main
```

## What Happens Next?

1. ✅ Your code is pushed to GitHub
2. ✅ Vercel detects the push automatically
3. ✅ Vercel starts a new deployment
4. ✅ Your website updates (usually takes 2-3 minutes)

## Check Deployment Status

- Go to [vercel.com](https://vercel.com)
- Click on your project
- Go to "Deployments" tab
- You'll see the latest deployment status

