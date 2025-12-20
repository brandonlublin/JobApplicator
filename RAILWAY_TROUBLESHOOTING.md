# Railway API Key Troubleshooting

If you're seeing "API key is missing" even though you've added `RAPIDAPI_KEY`:

## Quick Checks

1. **Verify Variable Location**
   - Make sure `RAPIDAPI_KEY` is in your **web service** variables
   - NOT in the MongoDB service variables
   - Click on your web service → Variables tab

2. **Check Variable Name**
   - Must be exactly: `RAPIDAPI_KEY`
   - Case-sensitive (all caps)
   - No spaces before/after
   - No quotes around the value

3. **Check the Value**
   - No leading/trailing spaces
   - No quotes (Railway adds them automatically if needed)
   - The full key from RapidAPI dashboard

## Step-by-Step Fix

### Step 1: Verify in Railway Dashboard

1. Go to Railway dashboard
2. Click on your **web service** (the one running your app, not MongoDB)
3. Go to **"Variables"** tab
4. Look for `RAPIDAPI_KEY` in the list
5. If it's there, click on it to see the value (make sure it's correct)

### Step 2: Check Deployment Logs

1. Go to your web service
2. Click **"Deployments"** tab
3. Click on the latest deployment
4. Check the logs - you should see:
   ```
   🔍 Environment check:
      RAPIDAPI_KEY: ✅ Set (abc123...)
   ```
   If you see `❌ Not set`, the variable isn't being read

### Step 3: Common Issues

#### Issue: Variable added but not visible in logs

**Solution:** Railway needs to redeploy
- Go to Deployments tab
- Click "Redeploy" button
- Wait for new deployment to complete
- Check logs again

#### Issue: Variable shows in dashboard but not in logs

**Possible causes:**
1. Variable was added after the build started
2. Variable is in the wrong service
3. There's a typo in the variable name

**Solution:**
1. Delete the variable
2. Add it again with exact name `RAPIDAPI_KEY`
3. Make sure you're adding it to the web service
4. Trigger a redeploy

#### Issue: Variable has extra characters

**Solution:**
1. Edit the variable
2. Remove any quotes, spaces, or special characters
3. Paste just the API key value
4. Save and redeploy

### Step 4: Test the Fix

After redeploying, check the logs. You should see:
```
🔍 Environment check:
   RAPIDAPI_KEY: ✅ Set (your-key-prefix...)
```

If you still see `❌ Not set`, try:

1. **Remove and re-add the variable:**
   - Delete `RAPIDAPI_KEY` from variables
   - Add it again with the exact same name
   - Redeploy

2. **Check for typos:**
   - Variable name: `RAPIDAPI_KEY` (not `RAPID_API_KEY`, `RAPIDAPIKEY`, etc.)
   - Make sure it's in the web service, not MongoDB service

3. **Try a different variable name temporarily:**
   - Add `TEST_VAR=hello` to verify variables work
   - Check logs to see if it appears
   - If it doesn't, there might be a Railway configuration issue

## Railway-Specific Notes

- Railway automatically redeploys when you add variables, but sometimes you need to manually trigger it
- Variables are case-sensitive
- Railway doesn't require quotes around values
- Variables set in the dashboard are available at runtime, not build time (which is fine for our use case)

## Still Not Working?

If none of the above works:

1. Check Railway status page: https://status.railway.app
2. Try creating a new variable with a different name (like `API_KEY`) and update the code to check for that too
3. Contact Railway support with:
   - Your project name
   - Screenshot of your variables tab
   - Deployment logs showing the error

