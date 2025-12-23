Invite Code Request System Implementation Plan

     Overview

     Add a self-service invite code request system to the finance login page. Users can request an invite code by
     filling out a form with their email and name. They receive a confirmation email, and admins can view and manage
      these requests from the admin panel.

     User Flow

     User Side (Finance App)

     1. User visits /finance/login and clicks "Sign Up" tab
     2. Below the "Create Account" button, they see "Don't have an invite code? Request one"
     3. Click "Request Invite Code" button → Opens a modal/dialog with form
     4. Fill in:
       - Email address
       - Full name
     5. Submit → Confirmation message shown
     6. User receives confirmation email thanking them for their request

     Admin Side

     1. Admin navigates to new page: /admin/invite-requests
     2. See table of all invite code requests with:
       - Email
       - Name
       - Status (Pending, Sent, Rejected)
       - Requested Date
       - Actions: Send Invite Code
     3. Click "Send Invite Code" → Opens existing invite code creation flow
     4. After creating invite code, admin can manually email it to the user

     ---
     Database Schema

     New Table: invite_code_requests

     CREATE TABLE invite_code_requests (
       id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
       email TEXT NOT NULL,
       name TEXT NOT NULL,
       status TEXT DEFAULT 'pending', -- 'pending', 'sent', 'rejected'
       notes TEXT, -- Admin notes
       invite_code_id UUID REFERENCES invite_codes(id), -- Link to sent invite
       created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
       updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
       processed_by UUID REFERENCES admin_users(id), -- Admin who processed it
       processed_at TIMESTAMP WITH TIME ZONE
     );

     -- Index for searching by email
     CREATE INDEX idx_invite_requests_email ON invite_code_requests(email);

     -- Index for filtering by status
     CREATE INDEX idx_invite_requests_status ON invite_code_requests(status);

     -- RLS Policies
     ALTER TABLE invite_code_requests ENABLE ROW LEVEL SECURITY;

     -- Allow anyone to insert (public request form)
     CREATE POLICY "Anyone can request invite codes"
       ON invite_code_requests FOR INSERT
       WITH CHECK (true);

     -- Only admins can view/update (handled via service role client)

     Migration File: supabase/migrations/20250123_invite_code_requests.sql

     Update types/database.types.ts

     Add new interface:
     export interface InviteCodeRequest {
       id: string;
       email: string;
       name: string;
       status: 'pending' | 'sent' | 'rejected';
       notes: string | null;
       invite_code_id: string | null;
       created_at: string;
       updated_at: string;
       processed_by: string | null;
       processed_at: string | null;
     }

     ---
     Email Template

     New Template: InviteRequestConfirmationEmail

     File: emails/templates/InviteRequestConfirmationEmail.tsx

     import { EmailLayout } from '../components/EmailLayout';

     interface InviteRequestConfirmationEmailProps {
       name: string;
     }

     export default function InviteRequestConfirmationEmail({
       name
     }: InviteRequestConfirmationEmailProps) {
       return (
         <EmailLayout>
           <h1>Thank You for Your Interest!</h1>
           <p>Hi {name},</p>
           <p>
             Thank you for requesting an invite code to join OneLibro, the privacy-first
             personal finance platform.
           </p>
           <p>
             Our admin team has received your request and will review it shortly.
             You'll receive your invite code via email within 1-2 business days.
           </p>
           <p>
             We appreciate your patience and look forward to having you on board!
           </p>
         </EmailLayout>
       );
     }

     Database Entry (add to email_templates seed):
     INSERT INTO email_templates (template_key, template_name, category, subject_template, template_type,
     template_path, variables, is_active)
     VALUES (
       'invite_request_confirmation',
       'Invite Request Confirmation',
       'transactional',
       'Thank you for requesting access to OneLibro',
       'react',
       'emails/templates/InviteRequestConfirmationEmail',
       '{"name": "string"}',
       true
     );

     Update Template Registry in lib/email.ts:
     import InviteRequestConfirmationEmail from '@/emails/templates/InviteRequestConfirmationEmail';

     const TEMPLATE_REGISTRY: Record<string, React.ComponentType<any>> = {
       // ... existing templates
       invite_request_confirmation: InviteRequestConfirmationEmail,
     };

     ---
     Frontend Implementation

     1. Request Invite Code Modal Component

     File: components/finance/RequestInviteModal.tsx (NEW)

     'use client';

     import { useState } from 'react';
     import { X, Mail, User, Loader2, CheckCircle2 } from 'lucide-react';

     interface RequestInviteModalProps {
       isOpen: boolean;
       onClose: () => void;
     }

     export default function RequestInviteModal({ isOpen, onClose }: RequestInviteModalProps) {
       const [email, setEmail] = useState('');
       const [name, setName] = useState('');
       const [loading, setLoading] = useState(false);
       const [success, setSuccess] = useState(false);
       const [error, setError] = useState('');

       async function handleSubmit(e: React.FormEvent) {
         e.preventDefault();
         setError('');
         setLoading(true);

         try {
           const response = await fetch('/api/invite-requests/create', {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({ email, name }),
           });

           const data = await response.json();

           if (!response.ok) {
             throw new Error(data.error || 'Failed to submit request');
           }

           setSuccess(true);
           // Auto-close after 3 seconds
           setTimeout(() => {
             onClose();
             setSuccess(false);
             setEmail('');
             setName('');
           }, 3000);
         } catch (err: any) {
           setError(err.message);
         } finally {
           setLoading(false);
         }
       }

       if (!isOpen) return null;

       return (
         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
           <div className="bg-[#1a1a1a] rounded-lg p-6 w-full max-w-md border border-[#2a2a2a]">
             {/* Header */}
             <div className="flex items-center justify-between mb-6">
               <h2 className="text-xl font-bold text-white">Request Invite Code</h2>
               <button onClick={onClose} className="text-gray-400 hover:text-white">
                 <X className="w-5 h-5" />
               </button>
             </div>

             {success ? (
               <div className="text-center py-8">
                 <CheckCircle2 className="w-16 h-16 text-[#10b981] mx-auto mb-4" />
                 <h3 className="text-lg font-semibold text-white mb-2">Request Submitted!</h3>
                 <p className="text-gray-400">
                   Check your email for confirmation. We'll send you an invite code shortly.
                 </p>
               </div>
             ) : (
               <form onSubmit={handleSubmit}>
                 <p className="text-gray-400 mb-6">
                   Enter your details and we'll send you an invite code to join OneLibro.
                 </p>

                 {/* Email Field */}
                 <div className="mb-4">
                   <label className="block text-sm font-medium text-gray-300 mb-2">
                     Email Address
                   </label>
                   <div className="relative">
                     <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                     <input
                       type="email"
                       value={email}
                       onChange={(e) => setEmail(e.target.value)}
                       required
                       className="w-full pl-10 pr-4 py-2 bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg text-white
     focus:outline-none focus:border-[#10b981]"
                       placeholder="you@example.com"
                     />
                   </div>
                 </div>

                 {/* Name Field */}
                 <div className="mb-6">
                   <label className="block text-sm font-medium text-gray-300 mb-2">
                     Full Name
                   </label>
                   <div className="relative">
                     <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                     <input
                       type="text"
                       value={name}
                       onChange={(e) => setName(e.target.value)}
                       required
                       className="w-full pl-10 pr-4 py-2 bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg text-white
     focus:outline-none focus:border-[#10b981]"
                       placeholder="John Doe"
                     />
                   </div>
                 </div>

                 {/* Error Message */}
                 {error && (
                   <div className="mb-4 p-3 bg-red-500/10 border border-red-500 rounded-lg text-red-500 text-sm">
                     {error}
                   </div>
                 )}

                 {/* Submit Button */}
                 <button
                   type="submit"
                   disabled={loading}
                   className="w-full py-2 bg-[#10b981] hover:bg-[#059669] text-white rounded-lg transition-colors
     disabled:opacity-50"
                 >
                   {loading ? (
                     <span className="flex items-center justify-center gap-2">
                       <Loader2 className="w-5 h-5 animate-spin" />
                       Submitting...
                     </span>
                   ) : (
                     'Request Invite Code'
                   )}
                 </button>
               </form>
             )}
           </div>
         </div>
       );
     }

     2. Update Login Page

     File: app/finance/login/page.tsx

     Changes:

     1. Import the modal component (after line 9):
     import RequestInviteModal from '@/components/finance/RequestInviteModal';

     2. Add state for modal (after line 12):
     const [showRequestModal, setShowRequestModal] = useState(false);

     3. Add button below "Create Account" button (after line 353, before closing </form> tag):
     {/* Request Invite Code Link */}
     <div className="mt-4 text-center">
       <p className="text-sm text-gray-400">
         Don't have an invite code?{' '}
         <button
           type="button"
           onClick={() => setShowRequestModal(true)}
           className="text-[#10b981] hover:underline font-medium"
         >
           Request one
         </button>
       </p>
     </div>

     4. Add modal component at end of component (before final closing tag):
     {/* Request Invite Modal */}
     <RequestInviteModal
       isOpen={showRequestModal}
       onClose={() => setShowRequestModal(false)}
     />

     ---
     API Route

     POST /api/invite-requests/create

     File: app/api/invite-requests/create/route.ts (NEW)

     import { NextRequest, NextResponse } from 'next/server';
     import { supabase } from '@/lib/supabase';
     import { sendEmail } from '@/lib/email';

     export async function POST(request: NextRequest) {
       try {
         const { email, name } = await request.json();

         // Validation
         if (!email || !name) {
           return NextResponse.json(
             { error: 'Email and name are required' },
             { status: 400 }
           );
         }

         // Email format validation
         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
         if (!emailRegex.test(email)) {
           return NextResponse.json(
             { error: 'Invalid email format' },
             { status: 400 }
           );
         }

         // Check if already requested (within last 24 hours)
         const { data: existing } = await supabase
           .from('invite_code_requests')
           .select('id, created_at')
           .eq('email', email.toLowerCase())
           .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
           .single();

         if (existing) {
           return NextResponse.json(
             { error: 'You have already submitted a request recently. Please wait 24 hours.' },
             { status: 429 }
           );
         }

         // Insert request into database
         const { data: request, error: dbError } = await supabase
           .from('invite_code_requests')
           .insert({
             email: email.toLowerCase(),
             name: name.trim(),
             status: 'pending',
           })
           .select()
           .single();

         if (dbError) {
           console.error('Database error:', dbError);
           return NextResponse.json(
             { error: 'Failed to submit request' },
             { status: 500 }
           );
         }

         // Send confirmation email (async, don't block response)
         sendEmail({
           to: email,
           subject: 'Thank you for requesting access to OneLibro',
           templateKey: 'invite_request_confirmation',
           templateProps: { name },
           category: 'transactional',
         }).catch((error) => {
           console.error('Failed to send confirmation email:', error);
         });

         return NextResponse.json({
           success: true,
           message: 'Request submitted successfully',
         });
       } catch (error) {
         console.error('Error creating invite request:', error);
         return NextResponse.json(
           { error: 'Internal server error' },
           { status: 500 }
         );
       }
     }

     ---
     Admin Panel Implementation

     1. Invite Requests Page

     File: app/admin/invite-requests/page.tsx (NEW)

     'use client';

     import { useEffect, useState } from 'react';
     import { useAdminAuth } from '@/contexts/AdminAuthContext';
     import { supabaseAdmin } from '@/lib/supabase';
     import { InviteCodeRequest } from '@/types/database.types';
     import { Mail, User, Calendar, Send, Loader2, Search } from 'lucide-react';
     import { useRouter } from 'next/navigation';
     import toast from 'react-hot-toast';

     export default function InviteRequestsPage() {
       const { user, loading: authLoading } = useAdminAuth();
       const router = useRouter();
       const [requests, setRequests] = useState<InviteCodeRequest[]>([]);
       const [loading, setLoading] = useState(true);
       const [searchTerm, setSearchTerm] = useState('');
       const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'sent' | 'rejected'>('all');

       useEffect(() => {
         if (!authLoading && !user) {
           router.push('/admin/login');
         } else if (user) {
           fetchRequests();
         }
       }, [user, authLoading, router]);

       async function fetchRequests() {
         try {
           setLoading(true);

           let query = supabaseAdmin
             .from('invite_code_requests')
             .select('*')
             .order('created_at', { ascending: false });

           const { data, error } = await query;

           if (error) throw error;

           setRequests(data || []);
         } catch (error) {
           console.error('Error fetching requests:', error);
           toast.error('Failed to load requests');
         } finally {
           setLoading(false);
         }
       }

       function handleSendInvite(email: string, name: string) {
         // Navigate to invite creation page with pre-filled email
         router.push(`/admin/invites/create?email=${encodeURIComponent(email)}&name=${encodeURIComponent(name)}`);
       }

       // Filter and search
       const filteredRequests = requests.filter((req) => {
         const matchesSearch =
           req.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
           req.name.toLowerCase().includes(searchTerm.toLowerCase());

         const matchesStatus = statusFilter === 'all' || req.status === statusFilter;

         return matchesSearch && matchesStatus;
       });

       const stats = {
         total: requests.length,
         pending: requests.filter((r) => r.status === 'pending').length,
         sent: requests.filter((r) => r.status === 'sent').length,
       };

       if (authLoading || loading) {
         return (
           <div className="flex items-center justify-center min-h-screen">
             <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
           </div>
         );
       }

       return (
         <div className="p-6">
           {/* Header */}
           <div className="mb-6">
             <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
               Invite Code Requests
             </h1>
             <p className="text-gray-600 dark:text-gray-400">
               Manage user requests for invite codes
             </p>
           </div>

           {/* Stats Cards */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
             <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
               <div className="text-sm text-gray-600 dark:text-gray-400">Total Requests</div>
               <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</div>
             </div>
             <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
               <div className="text-sm text-gray-600 dark:text-gray-400">Pending</div>
               <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
             </div>
             <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
               <div className="text-sm text-gray-600 dark:text-gray-400">Sent</div>
               <div className="text-2xl font-bold text-emerald-600">{stats.sent}</div>
             </div>
           </div>

           {/* Filters */}
           <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700
     mb-4">
             <div className="flex flex-col md:flex-row gap-4">
               {/* Search */}
               <div className="flex-1">
                 <div className="relative">
                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                   <input
                     type="text"
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     placeholder="Search by email or name..."
                     className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
     bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                   />
                 </div>
               </div>

               {/* Status Filter */}
               <select
                 value={statusFilter}
                 onChange={(e) => setStatusFilter(e.target.value as any)}
                 className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white
     dark:bg-gray-700 text-gray-900 dark:text-white"
               >
                 <option value="all">All Status</option>
                 <option value="pending">Pending</option>
                 <option value="sent">Sent</option>
                 <option value="rejected">Rejected</option>
               </select>
             </div>
           </div>

           {/* Table */}
           <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700
     overflow-hidden">
             <div className="overflow-x-auto">
               <table className="w-full">
                 <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                   <tr>
                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400
     uppercase">
                       Name
                     </th>
                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400
     uppercase">
                       Email
                     </th>
                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400
     uppercase">
                       Status
                     </th>
                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400
     uppercase">
                       Requested
                     </th>
                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400
     uppercase">
                       Actions
                     </th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                   {filteredRequests.length === 0 ? (
                     <tr>
                       <td colSpan={5} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                         No invite requests found
                       </td>
                     </tr>
                   ) : (
                     filteredRequests.map((request) => (
                       <tr key={request.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                         <td className="px-6 py-4">
                           <div className="flex items-center gap-2">
                             <User className="w-4 h-4 text-gray-400" />
                             <span className="text-sm font-medium text-gray-900 dark:text-white">
                               {request.name}
                             </span>
                           </div>
                         </td>
                         <td className="px-6 py-4">
                           <div className="flex items-center gap-2">
                             <Mail className="w-4 h-4 text-gray-400" />
                             <span className="text-sm text-gray-600 dark:text-gray-300">
                               {request.email}
                             </span>
                           </div>
                         </td>
                         <td className="px-6 py-4">
                           <span
                             className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                               request.status === 'pending'
                                 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                 : request.status === 'sent'
                                 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
                                 : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                             }`}
                           >
                             {request.status}
                           </span>
                         </td>
                         <td className="px-6 py-4">
                           <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                             <Calendar className="w-4 h-4 text-gray-400" />
                             {new Date(request.created_at).toLocaleDateString()}
                           </div>
                         </td>
                         <td className="px-6 py-4">
                           {request.status === 'pending' && (
                             <button
                               onClick={() => handleSendInvite(request.email, request.name)}
                               className="flex items-center gap-2 px-3 py-1 text-sm bg-emerald-500
     hover:bg-emerald-600 text-white rounded-lg transition-colors"
                             >
                               <Send className="w-4 h-4" />
                               Send Invite
                             </button>
                           )}
                         </td>
                       </tr>
                     ))
                   )}
                 </tbody>
               </table>
             </div>
           </div>
         </div>
       );
     }

     2. Update Admin Navigation

     File: components/admin/AdminLayoutInner.tsx

     Add navigation item (after Invite Codes section, around line 38):
     {
       href: '/admin/invite-requests',
       label: 'Invite Requests',
       icon: MailPlus, // Import from lucide-react
     },

     3. Update Invite Create Page (Optional Enhancement)

     File: app/admin/invites/create/page.tsx

     Pre-fill email from query params (add at beginning of component):
     const searchParams = useSearchParams();
     const prefillEmail = searchParams?.get('email');
     const prefillName = searchParams?.get('name');

     // Show pre-filled info banner if coming from invite request
     {prefillEmail && (
       <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800
     rounded-lg">
         <p className="text-sm text-blue-800 dark:text-blue-300">
           Creating invite code for: <strong>{prefillName}</strong> ({prefillEmail})
         </p>
       </div>
     )}

     ---
     Implementation Checklist

     Phase 1: Database

     - Create migration file supabase/migrations/20250123_invite_code_requests.sql
     - Run migration locally: npx supabase db push
     - Test migration on production Supabase
     - Update types/database.types.ts with new interface
     - Seed email template to email_templates table

     Phase 2: Email Template

     - Create emails/templates/InviteRequestConfirmationEmail.tsx
     - Update template registry in lib/email.ts
     - Test email rendering locally with npm run email:dev

     Phase 3: API Route

     - Create app/api/invite-requests/create/route.ts
     - Test API with duplicate request validation (24-hour window)
     - Test email sending integration

     Phase 4: User Frontend

     - Create components/finance/RequestInviteModal.tsx
     - Update app/finance/login/page.tsx with button and modal
     - Test modal open/close functionality
     - Test form submission and success flow

     Phase 5: Admin Panel

     - Create app/admin/invite-requests/page.tsx
     - Update components/admin/AdminLayoutInner.tsx navigation
     - Add MailPlus icon import
     - Test table display and filtering
     - Test "Send Invite" button navigation

     Phase 6: Testing

     - Submit invite request from login page
     - Verify confirmation email received
     - Verify request appears in admin panel
     - Click "Send Invite" and verify navigation to create page
     - Test duplicate request prevention (24-hour window)
     - Test search and status filtering

     Phase 7: Production Deployment

     - Run migration on production Supabase
     - Deploy frontend changes to Vercel
     - Verify email sending works in production
     - Test end-to-end flow in production

     ---
     Critical Files Summary

     Files to Create (5 new files)

     1. supabase/migrations/20250123_invite_code_requests.sql - Database migration
     2. emails/templates/InviteRequestConfirmationEmail.tsx - Email template
     3. components/finance/RequestInviteModal.tsx - Request form modal
     4. app/api/invite-requests/create/route.ts - API endpoint
     5. app/admin/invite-requests/page.tsx - Admin management page

     Files to Modify (4 existing files)

     1. types/database.types.ts - Add InviteCodeRequest interface
     2. lib/email.ts - Add template to registry
     3. app/finance/login/page.tsx - Add button and modal
     4. components/admin/AdminLayoutInner.tsx - Add navigation link

     ---
     Security Considerations

     1. Rate Limiting: 24-hour window prevents spam requests from same email
     2. Email Validation: Server-side validation of email format
     3. Input Sanitization: Trim whitespace from name, lowercase email
     4. RLS Policies: Public can only INSERT, admins use service role client for viewing
     5. No Sensitive Data: Table only stores email and name (no passwords or PII)

     ---
     User Experience Notes

     1. Confirmation Email: Sent immediately after request submission
     2. Auto-close Modal: Success message shows for 3 seconds then auto-closes
     3. Admin Workflow: One-click navigation from request to invite creation
     4. Status Tracking: Clear visual indicators (Pending/Sent/Rejected)
     5. Search & Filter: Easy to find specific requests or filter by status