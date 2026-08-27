import React from 'react';
import { Users, Shield, User, RefreshCw, Calendar, Mail } from 'lucide-react';

export const UserManagement = ({ users = [], onRefresh }) => {
  return (
    <div className="space-y-3 text-xs">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <span className="font-bold text-white">Registered Users & Role Permissions ({users.length})</span>
        <button
          onClick={onRefresh}
          className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Refresh</span>
        </button>
      </div>

      {users.length === 0 ? (
        <div className="py-12 text-center text-slate-400 space-y-2 glass-card rounded-2xl p-6">
          <Users className="w-8 h-8 mx-auto text-slate-600" />
          <p className="font-bold text-white text-xs">No users found</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-800 overflow-hidden divide-y divide-slate-800">
          {users.map((u) => (
            <div
              key={u._id}
              className="p-3.5 bg-slate-900/60 hover:bg-slate-900 transition-colors flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <img
                  src={u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb'}
                  alt={u.name}
                  className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-700"
                />
                <div>
                  <p className="font-bold text-white text-xs">{u.name}</p>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                    <Mail className="w-3 h-3 text-slate-500" />
                    <span>{u.email}</span>
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                    u.role === 'admin'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                  }`}
                >
                  {u.role === 'admin' ? 'Store Administrator' : 'Customer'}
                </span>
                <p className="text-[10px] text-slate-500 mt-1 flex items-center justify-end gap-1">
                  <Calendar className="w-3 h-3 text-slate-600" />
                  <span>Joined {new Date(u.createdAt).toLocaleDateString()}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserManagement;
