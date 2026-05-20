'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { messageApi } from '@/lib/api'
import { timeAgo } from '@/lib/utils'
import { Mail, MailOpen, Trash2, ChevronDown, ChevronUp, Phone, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

export default function MessagesPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [messages, setMessages] = useState<any[]>([])
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 })
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const status = searchParams.get('status') ?? ''
  const page = Number(searchParams.get('page') ?? 1)

  const fetchMessages = async () => {
    setLoading(true)
    try {
      const res = await messageApi.getAll({ status, page, limit: 15 })
      setMessages(res.data.data.messages)
      setPagination(res.data.data.pagination)
      setUnreadCount(res.data.data.unreadCount)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchMessages() }, [status, page])

  const markRead = async (id: string) => {
    setLoadingId(id)
    await messageApi.patch(id, { status: 'READ' })
    setLoadingId(null)
    fetchMessages()
  }

  const markUnread = async (id: string) => {
    setLoadingId(id)
    await messageApi.patch(id, { status: 'UNREAD' })
    setLoadingId(null)
    fetchMessages()
  }

  const deleteMessage = async (id: string) => {
    setLoadingId(id)
    await messageApi.delete(id)
    setLoadingId(null)
    setDeleteId(null)
    fetchMessages()
  }

  const toggleExpand = async (id: string, isUnread: boolean) => {
    const opening = expanded !== id
    setExpanded(opening ? id : null)
    if (opening && isUnread) await markRead(id)
  }

  const buildTabUrl = (s: string) => {
    const params = new URLSearchParams()
    if (s) params.set('status', s)
    params.set('page', '1')
    return `/admin/dashboard/messages?${params.toString()}`
  }

  const buildPageUrl = (p: number) => {
    const params = new URLSearchParams()
    if (status) params.set('status', status)
    params.set('page', String(p))
    return `/admin/dashboard/messages?${params.toString()}`
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Delete Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 max-w-sm w-full shadow-2xl">
            <div className="w-12 h-12 bg-red-50 dark:bg-red-950 rounded-xl flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="font-display font-bold text-center text-slate-900 dark:text-white mb-2">Delete Message?</h3>
            <p className="text-slate-500 text-sm text-center mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-medium"
              >Cancel</button>
              <button
                onClick={() => deleteMessage(deleteId)}
                disabled={loadingId === deleteId}
                className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white rounded-xl text-sm font-medium"
              >{loadingId === deleteId ? 'Deleting...' : 'Delete'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="flex flex-wrap gap-4">
        {[
          { label: 'Total', value: pagination.total, color: 'text-slate-900 dark:text-white' },
          { label: 'Unread', value: unreadCount, color: 'text-orange-500' },
          { label: 'Read', value: pagination.total - unreadCount, color: 'text-green-500' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800/60 px-5 py-3 flex items-center gap-3">
            <span className={`font-display font-bold text-2xl ${color}`}>{value}</span>
            <span className="text-slate-500 dark:text-slate-400 text-sm">{label}</span>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {[{ value: '', label: 'All' }, { value: 'UNREAD', label: 'Unread' }, { value: 'READ', label: 'Read' }].map((tab) => (
          <Link
            key={tab.value}
            href={buildTabUrl(tab.value)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              status === tab.value
                ? 'bg-orange-500 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
            }`}
          >{tab.label}</Link>
        ))}
      </div>

      {/* Messages List */}
      {loading ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 p-6 space-y-3 animate-pulse">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          ))}
        </div>
      ) : messages.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 p-16 text-center">
          <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Mail className="w-7 h-7 text-slate-400" />
          </div>
          <h3 className="font-display font-semibold text-slate-900 dark:text-white mb-2">No messages yet</h3>
          <p className="text-slate-400 text-sm">Messages from your contact form will appear here.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 overflow-hidden">
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {messages.map((msg) => {
              const isUnread = msg.status === 'UNREAD'
              const isExpanded = expanded === msg.id

              return (
                <div key={msg.id} className={isUnread ? 'bg-orange-50/30 dark:bg-orange-950/10' : ''}>
                  {/* Row */}
                  <div
                    className="flex items-center gap-4 px-6 py-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    onClick={() => toggleExpand(msg.id, isUnread)}
                  >
                    {/* Unread dot */}
                    <div className="shrink-0">
                      {isUnread
                        ? <div className="w-2.5 h-2.5 rounded-full bg-orange-500 shadow-sm shadow-orange-500/50" />
                        : <div className="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700" />
                      }
                    </div>

                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                      <span className="text-slate-600 dark:text-slate-400 text-sm font-bold">
                        {msg.name.charAt(0).toUpperCase()}
                      </span>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className={`text-sm font-medium truncate ${isUnread ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                          {msg.name}
                        </p>
                        <span className="text-slate-300 dark:text-slate-700 text-xs">·</span>
                        <p className="text-slate-400 text-xs truncate">{msg.email}</p>
                      </div>
                      <p className={`text-xs truncate mt-0.5 ${isUnread ? 'text-slate-700 dark:text-slate-300 font-medium' : 'text-slate-500 dark:text-slate-400'}`}>
                        {msg.subject}
                      </p>
                    </div>

                    <span className="text-slate-400 text-xs shrink-0 hidden sm:block">
                      {timeAgo(msg.createdAt)}
                    </span>

                    {/* Actions */}
                    <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => isUnread ? markRead(msg.id) : markUnread(msg.id)}
                        title={isUnread ? 'Mark as read' : 'Mark as unread'}
                        disabled={loadingId === msg.id}
                        className="p-1.5 text-slate-400 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-950/30 rounded-lg transition-all disabled:opacity-50"
                      >
                        {isUnread ? <MailOpen className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => setDeleteId(msg.id)}
                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="p-1.5 text-slate-400">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="px-6 pb-6">
                      <div className="ml-[4.25rem] bg-slate-50 dark:bg-slate-800/50 rounded-xl p-5 border border-slate-100 dark:border-slate-800">
                        <div className="flex flex-wrap gap-4 mb-4 text-sm text-slate-600 dark:text-slate-400">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-orange-500" />
                            <a href={`mailto:${msg.email}`} className="hover:text-orange-500 transition-colors">
                              {msg.email}
                            </a>
                          </div>
                          {msg.phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4 text-orange-500" />
                              <a href={`tel:${msg.phone}`} className="hover:text-orange-500 transition-colors">
                                {msg.phone}
                              </a>
                            </div>
                          )}
                          <span className="text-slate-400 text-xs">
                            {new Date(msg.createdAt).toLocaleString('en-NG', { dateStyle: 'medium', timeStyle: 'short' })}
                          </span>
                        </div>

                        <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                          {msg.body}
                        </p>

                        <div className="flex gap-3 mt-4">
                          <a
                            href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                            className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-xs font-medium transition-colors"
                          >
                            <Mail className="w-3.5 h-3.5" />
                            Reply via Email
                          </a>
                          {msg.phone && (
                            <a
                              href={`https://wa.me/${msg.phone.replace(/\D/g, '')}?text=Hi ${encodeURIComponent(msg.name)}, thank you for your enquiry about our property.`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-xs font-medium transition-colors"
                            >
                              WhatsApp
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 px-6 py-4 border-t border-slate-100 dark:border-slate-800">
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={buildPageUrl(p)}
                  className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-medium transition-all ${
                    p === pagination.page
                      ? 'bg-orange-500 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >{p}</Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
