# How to Deploy Changes

## 🚀 Easiest Method (Recommended)

After making changes to your code, run:

```bash
./quick-push.sh
```

This will:
1. Ask you what changes you made
2. Add all your changes
3. Commit them with your message
4. Push to GitHub
5. Vercel will automatically deploy

**Example:**
```bash
$ ./quick-push.sh
What changes did you make? (Enter a brief description):
Updated homepage hero image
🚀 Pushing changes to GitHub...
✅ Done! Your changes are being deployed to Vercel.
```

## Alternative Methods

### Method 2: Use push script with message

```bash
./push.sh "Description of your changes"
```

Example:
```bash
./push.sh "Updated homepage design"
```

### Method 3: Use npm script

```bash
npm run push
```

(Note: This uses a default message "Update")

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

