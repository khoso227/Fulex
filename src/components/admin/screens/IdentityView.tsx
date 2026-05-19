import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Users } from 'lucide-react';
import { db } from '../../../lib/firebase';
import { 
  doc, 
  updateDoc, 
  collection, 
  getDocs, 
  query 
} from 'firebase/firestore';
import { logAdminAction, AuditAction } from '../../../lib/auditService';
import { cn } from '../../../lib/utils';

export function IdentityView() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchUsers = async () => {
      try {
        const q = query(collection(db, 'users'));
        const querySnapshot = await getDocs(q);
        const userData: any[] = [];
        querySnapshot.forEach((doc) => {
          userData.push({ id: doc.id, ...doc.data() });
        });
        setUsers(userData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    if (!confirm(`SECURITY OVERRIDE: Assign protocol ${newRole.toUpperCase()} to node ${userId}?`)) return;
    const userToUpdate = users.find(u => u.id === userId);
    if (!userToUpdate || userToUpdate.role === newRole) return;

    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, { role: newRole });
      
      await logAdminAction(
        AuditAction.UPDATE_USER_ROLE,
        userId,
        { role: userToUpdate.role },
        { role: newRole }
      );

      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
      alert('User role updated successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to update user role.');
    }
  };

  if (loading) return <div className="text-center py-20 text-brand-text-dim font-black uppercase tracking-widest animate-pulse">Scanning Neural Network...</div>;

  return (
    <div className="glass rounded-[2.5rem] overflow-hidden pb-20">
      <div className="px-10 py-8 border-b border-white/5 flex items-center justify-between">
        <h3 className="font-extrabold flex items-center gap-3 text-brand-text italic tracking-tighter uppercase text-xl">
          <Users className="w-6 h-6 text-brand-accent" />
          Identity Management
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left font-sans text-sm">
          <thead>
            <tr className="bg-white/5 border-b border-white/5 text-[10px] uppercase font-black tracking-widest text-brand-text-dim">
              <th className="px-10 py-6">Email</th>
              <th className="px-10 py-6">Current Role</th>
              <th className="px-10 py-6 text-right">Assign Protocol</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-white/5 transition-colors">
                <td className="px-10 py-6">
                  <div className="font-bold text-brand-text">{user.email}</div>
                  <div className="text-[10px] text-brand-text-dim uppercase tracking-widest">{user.uid}</div>
                </td>
                <td className="px-10 py-6">
                  <span className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                    user.role === 'admin' ? "bg-red-500/10 text-red-500" :
                    user.role === 'owner' ? "bg-brand-accent/10 text-brand-accent" : "bg-blue-500/10 text-blue-500"
                  )}>
                    {user.role}
                  </span>
                </td>
                <td className="px-10 py-6 text-right">
                  <select 
                    value={user.role} 
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 outline-none focus:border-brand-accent text-xs font-bold uppercase tracking-widest"
                  >
                    <option value="driver">Driver</option>
                    <option value="owner">Owner</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
