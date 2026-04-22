import React, { useState } from 'react';
import EmptyState from '../components/shared/EmptyState';
import { Settings, ShieldCheck, Loader2 } from 'lucide-react';
import { db } from '../services/firebase';
import { collection, getDocs, doc, getDoc, updateDoc, deleteField } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { encryptData, hashText } from '../utils/encryption';

const SettingsPage = () => {
  const { familyId } = useAuth();
  const [isMigrating, setIsMigrating] = useState(false);
  const [message, setMessage] = useState('');

  const migrateData = async () => {
    if (!window.confirm("This will encrypt ALL your old plain-text data into mathematical AES cipher form in the database. Continue?")) return;
    setIsMigrating(true);
    setMessage('Securing User Account...');
    try {
      // 1. Secure user account passwords
      const userRef = doc(db, 'users', familyId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const udata = userSnap.data();
        const updates = {};
        if (udata.password && udata.password.length !== 64) {
          updates.password = hashText(udata.password);
        }
        if (udata.securityAnswer && udata.securityAnswer.length !== 64) {
          updates.securityAnswer = hashText(udata.securityAnswer.toLowerCase().trim());
        }
        if (Object.keys(updates).length > 0) {
          await updateDoc(userRef, updates);
        }
      }

      // 2. Secure Subcollections
      const subcollections = ['members', 'fds', 'passwords', 'accounts', 'documents'];
      let count = 0;
      
      for (const sub of subcollections) {
        setMessage(`Securing Vault Data: ${sub}...`);
        const subSnap = await getDocs(collection(db, 'families', familyId, sub));
        for (const subDoc of subSnap.docs) {
          const subData = subDoc.data();
          // Condition: If there is no encryptedData OR if there are lingering structural keys
          if (!subData.encryptedData && Object.keys(subData).length > 0) {
            const encryptedData = encryptData(subData, familyId);
            const docUpdates = { encryptedData };
            for (const key of Object.keys(subData)) {
              if (key !== 'createdAt' && key !== 'updatedAt') {
                docUpdates[key] = deleteField();
              }
            }
            await updateDoc(doc(db, 'families', familyId, sub, subDoc.id), docUpdates);
            count++;
          }
        }
      }
      setMessage(`✅ Security Migration Complete! Permanently encrypted ${count} legacy inputs.`);
    } catch (e) {
      console.error(e);
      setMessage(`Migration Error: ${e.message}`);
    }
    setIsMigrating(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Settings className="text-indigo-400" /> Settings
          </h1>
          <p className="text-slate-400 text-sm mt-1">Configure your vault preferences and run security actions.</p>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg relative overflow-hidden">
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2 mb-2">
          <ShieldCheck className="text-emerald-400" /> Legacy Data Security Tool
        </h2>
        <p className="text-slate-400 text-sm mb-6 max-w-2xl">
          If you have old data stored plainly in your database before the AES protocol was introduced, this tool will crawl through your entire family vault, securely encrypt every detail, and delete the legacy unencrypted footprints from Google's servers.
        </p>

        <button 
          onClick={migrateData} 
          disabled={isMigrating}
          className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 disabled:bg-slate-700 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-lg shadow-indigo-500/25"
        >
          {isMigrating ? <Loader2 size={18} className="animate-spin" /> : <ShieldCheck size={18} />}
          {isMigrating ? 'Encrypting...' : 'Encrypt Old Data'}
        </button>

        {message && (
          <div className="mt-4 text-sm font-mono text-emerald-400 bg-emerald-400/10 inline-block px-3 py-2 rounded-lg border border-emerald-400/20">
            {message}
          </div>
        )}
      </div>

      <EmptyState 
        icon={Settings}
        title="More Settings Coming Soon"
        description="Configuration for Vault themes, pins, and exports will appear here."
      />
    </div>
  );
};

export default SettingsPage;
