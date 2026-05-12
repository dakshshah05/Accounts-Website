# Google Drive Integration Guide

To securely upload your documents directly to Google Drive (saving your precious Firebase quota), I have set up your application to communicate with a **Google Apps Script Web App**.

You need to deploy a tiny script on your Google Account that will receive the documents and save them to a secure folder in your Drive. Here is how to do it in 5 easy steps:

### Step 1: Create the Script
1. Go to [script.google.com](https://script.google.com/) and click **"New Project"**.
2. Delete any code in the editor and **paste the following exact code**:

```javascript
function doPost(e) {
  try {
    var action = e.parameter.action;

    // Handle Deletion
    if (action === "delete") {
      var fileId = e.parameter.fileId;
      var fileToDelete = DriveApp.getFileById(fileId);
      fileToDelete.setTrashed(true);
      return ContentService.createTextOutput(JSON.stringify({
        status: "success",
        message: "File deleted"
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // Handle Upload
    var base64Data = e.parameter.base64;
    var filename = e.parameter.filename;
    var mimeType = e.parameter.mimeType;

    var decoded = Utilities.base64Decode(base64Data);
    var blob = Utilities.newBlob(decoded, mimeType, filename);

    var folderIterator = DriveApp.getFoldersByName("FamilyVault_Documents");
    var folder;
    if (folderIterator.hasNext()) {
      folder = folderIterator.next();
    } else {
      folder = DriveApp.createFolder("FamilyVault_Documents");
      // Ensures the folder is accessible via the link we save
      folder.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    }

    var file = folder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      url: file.getUrl(),
      downloadUrl: file.getDownloadUrl()
    })).setMimeType(ContentService.MimeType.JSON);

  } catch(error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
```

### Step 2: Deploy as a Web App
1. Click the **"Deploy"** button at the top right, then select **"New deployment"**.
2. Click the gear icon ⚙️ next to "Select type" and choose **"Web app"**.
3. In the configuration:
   - **Description**: "Drive Uploader"
   - **Execute as**: `Me` *(Important!)*
   - **Who has access**: `Anyone` *(Important! So your app can reach it)*
4. Click **"Deploy"**.

### Step 3: Grant Permissions
1. Google will prompt you to authorize access to your Google Drive. Click **"Authorize access"**.
2. Choose your Google Account.
3. You might see a warning saying "Google hasn’t verified this app" (because you just created it). Click **"Advanced"** at the bottom, then click **"Go to Untitled project (unsafe)"**.
4. Click **"Allow"**.

### Step 4: Copy the URL
Once deployed, Google will give you a **Web app URL**. Copy this URL. It will look something like this:
`https://script.google.com/macros/s/AKfycb.../exec`

### Step 5: Update Your Website Code
1. Open your code editor and go to `src/components/documents/DocumentForm.jsx`.
2. On line **23**, you will see:
```javascript
const GOOGLE_SCRIPT_URL = "YOUR_GOOGLE_SCRIPT_URL_HERE";
```
3. **Paste your copied URL** in place of `"YOUR_GOOGLE_SCRIPT_URL_HERE"`.
4. Save the file and push it to GitHub!

Your website will now route all heavy document uploads straight to a folder named `FamilyVault_Documents` in your Google Drive, while seamlessly saving the Drive URL encrypted in your Firebase database!
