import CryptoJS from 'crypto-js';

// We use the familyId combined with a static app secret to ensure isolation
const APP_SECRET_SALT = "FamilyVault_Secure_Salt_2026";

export const hashText = (text) => {
  if (!text) return text;
  return CryptoJS.SHA256(text).toString();
};

export const encryptData = (dataObj, familyId) => {
  if (!dataObj || !familyId) return dataObj;
  const secretKey = `${familyId}_${APP_SECRET_SALT}`;
  const jsonString = JSON.stringify(dataObj);
  return CryptoJS.AES.encrypt(jsonString, secretKey).toString();
};

export const decryptData = (encryptedString, familyId) => {
  if (!encryptedString || !familyId) return null;
  try {
    const secretKey = `${familyId}_${APP_SECRET_SALT}`;
    const bytes = CryptoJS.AES.decrypt(encryptedString, secretKey);
    const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedString);
  } catch (error) {
    console.error("Decryption failed:", error);
    return null; // Return null if decryption fails (e.g. wrong key/familyId)
  }
};
