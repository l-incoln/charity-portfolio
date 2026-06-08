import { createClient } from '@/lib/supabase/server'
import { markMessageRead, deleteMessage } from '@/lib/actions'
import { Mail, Trash2, Eye } from 'lucide-react'
import type { Message } from '@/lib/types'

async function getMessages() {
  try {
    const supabase = await createClient()
    const { data } = await supabase.from('messages').select('*').order('created_at', { ascending: false })
    return (data as Message[]) || []
  } catch { return [] }
}

export default async function MessagesPage() {
  const messages = await getMessages()
  const unread = messages.filter((m) => !m.is_read).length

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'Sora, sans-serif' }}>Messages</h1>
        <p className="text-slate-400 mt-1">
          {messages.length} total · <span className="text-cyan-400">{unread} unread</span>
        </p>
      </div>

      <div className="space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`glass rounded-2xl p-6 border transition-all duration-300 ${msg.is_read ? 'border-slate-700/50' : 'border-cyan-500/25 bg-cyan-500/3'}`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${msg.is_read ? 'bg-slate-700' : 'bg-cyan-500/20 border border-cyan-500/30'}`}>
                  <Mail size={16} className={msg.is_read ? 'text-slate-400' : 'text-cyan-400'} />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-sm font-semibold text-white">{msg.name}</span>
                    {!msg.is_read && <span className="text-xs bg-cyan-500 text-slate-900 font-bold px-2 py-0.5 rounded-full">NEW</span>}
                  </div>
                  <p className="text-xs text-slate-500 mb-2">{msg.email} · {new Date(msg.created_at).toLocaleDateString('en-US', { dateStyle: 'medium' })}</p>
                  {msg.subject && <p className="text-sm font-medium text-slate-300 mb-2">{msg.subject}</p>}
                  <p className="text-sm text-slate-400 leading-relaxed">{msg.message}</p>
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                {!msg.is_read && (
                  <form action={async () => { 'use server'; await markMessageRead(msg.id) }}>
                    <button type="submit" title="Mark as read"
                      className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-all duration-200">
                      <Eye size={14} />
                    </button>
                  </form>
                )}
                <form action={async () => { 'use server'; await deleteMessage(msg.id) }}>
                  <button type="submit"
                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200">
                    <Trash2 size={14} />
                  </button>
                </form>
              </div>
            </div>
          </div>
        ))}
        {messages.length === 0 && (
          <div className="glass rounded-2xl p-16 border border-slate-700/50 text-center text-slate-400">
            No messages yet. Messages from your contact form will appear here.
          </div>
        )}
      </div>
    </div>
  )
}
