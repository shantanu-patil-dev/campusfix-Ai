import { Link } from 'react-router-dom'
import { Shield, Lock, FileText, Database, Eye, Bell, ArrowLeft } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Card, Button } from '../components/ui'

export default function PrivacyPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flex: 1, maxWidth: 960, margin: '0 auto', width: '100%', padding: '40px 24px' }}>
        {/* Navigation Breadcrumb / Back */}
        <div style={{ marginBottom: 24 }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <Button variant="ghost" size="sm" style={{ paddingLeft: 0, color: '#64748b' }}>
              <ArrowLeft size={14} /> Back to Home
            </Button>
          </Link>
        </div>

        {/* Page Header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '4px 10px', background: '#e2e8f0', borderRadius: 6, fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 12 }}>
            <Shield size={14} /> Institutional Data Governance
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: '#0f172a', marginBottom: 10, lineHeight: 1.2 }}>
            CampusFix AI Privacy Policy
          </h1>
          <p style={{ fontSize: 15, color: '#64748b', lineHeight: 1.6 }}>
            Effective Date: Academic Year 2026-2027 | Last Revised: October 2026
          </p>
        </div>

        {/* Confirmation Advisory Notice */}
        <div style={{
          background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: 8,
          padding: '16px 20px', marginBottom: 32, color: '#334155', fontSize: 14, lineHeight: 1.6
        }}>
          <strong style={{ color: '#0f172a' }}>Institutional Notice:</strong> This privacy documentation reflects standard institutional facility management procedures. Specific administrative contacts, data retention thresholds, and server locations designated with <code>[Confirmation Required]</code> require formal validation by the University Office of General Counsel and Data Protection Officer.
        </div>

        {/* Content Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Section 1 */}
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{ width: 32, height: 32, borderRadius: 6, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
                <FileText size={18} />
              </div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a' }}>1. Scope and Purpose</h2>
            </div>
            <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.7, marginBottom: 12 }}>
              CampusFix AI operates as an institutional platform intended strictly for campus facility maintenance, incident triage, and operational infrastructure management. This policy describes how operational telemetry and user account records are handled across students, faculty, staff, and authorized administrative personnel.
            </p>
            <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.7 }}>
              Use of CampusFix AI is restricted to university-affiliated tasks and physical estate maintenance tracking.
            </p>
          </Card>

          {/* Section 2 */}
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{ width: 32, height: 32, borderRadius: 6, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
                <Database size={18} />
              </div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a' }}>2. Information Collected</h2>
            </div>
            <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.7, marginBottom: 12 }}>
              CampusFix AI collects only information strictly necessary to identify, locate, and resolve physical infrastructure issues:
            </p>
            <ul style={{ paddingLeft: 20, fontSize: 14, color: '#475569', lineHeight: 1.8, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <li>
                <strong>Identity & Account Data:</strong> Full name, institutional email address (@campus.edu domain), affiliated academic or operations department, and user role (Student, Faculty, Staff, Administrator).
              </li>
              <li>
                <strong>Incident Reporting Data:</strong> Physical building name, room or specific area descriptor, category of issue, issue narrative, timestamp of report, and optional photographic attachments demonstrating the repair condition.
              </li>
              <li>
                <strong>Operational Logs:</strong> Work order status adjustments, dispatch assignments, technician progress comments, and resolution audit trails.
              </li>
            </ul>
          </Card>

          {/* Section 3 */}
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{ width: 32, height: 32, borderRadius: 6, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
                <Eye size={18} />
              </div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a' }}>3. Role-Based Access and Data Sharing</h2>
            </div>
            <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.7, marginBottom: 12 }}>
              Data access within CampusFix AI is governed by strict principle-of-least-privilege access controls:
            </p>
            <ul style={{ paddingLeft: 20, fontSize: 14, color: '#475569', lineHeight: 1.8, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <li>
                <strong>Students & Faculty:</strong> Can view their own submitted tickets, current resolution stages, and official technician responses.
              </li>
              <li>
                <strong>Facilities Maintenance Staff:</strong> Can view assigned work order descriptions, building coordinates, issue severity, and submit work completion notes.
              </li>
              <li>
                <strong>Campus Administrators:</strong> Maintain campus-wide audit oversight, ticket dispatch capabilities, role permissions, and aggregated facility health statistics.
              </li>
              <li>
                <strong>Third Parties:</strong> Maintenance data is never sold, leased, or transmitted to commercial marketing entities. External contractors receive work order parameters on a strictly need-to-know basis subject to university non-disclosure provisions.
              </li>
            </ul>
          </Card>

          {/* Section 4 */}
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{ width: 32, height: 32, borderRadius: 6, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
                <Lock size={18} />
              </div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a' }}>4. Data Storage, Security, and Retention</h2>
            </div>
            <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.7, marginBottom: 12 }}>
              Institutional records are safeguarded using access authentication controls and transport-layer encryption.
            </p>
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: 16, display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13, color: '#475569' }}>
              <div>
                <strong>Storage Location:</strong> [Confirmation Required: University On-Premises Data Center / Institutional AWS GovCloud Tenant]
              </div>
              <div>
                <strong>Retention Schedule:</strong> Closed work order records are retained for auditing purposes for [Confirmation Required: Standard 3 Academic Years], after which identifying reporter attributes are anonymized.
              </div>
              <div>
                <strong>Media File Handling:</strong> Maintenance photographs are stored in private institutional object storage buckets and accessible only during work order investigation.
              </div>
            </div>
          </Card>

          {/* Section 5 */}
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{ width: 32, height: 32, borderRadius: 6, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
                <Bell size={18} />
              </div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a' }}>5. User Rights and Data Inquiries</h2>
            </div>
            <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.7, marginBottom: 12 }}>
              Members of the campus community possess the right to inspect their submitted issue history, request correction of erroneous report details, or request redaction of personal information where not mandated for campus safety audits.
            </p>
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: 16, fontSize: 13, color: '#334155', lineHeight: 1.6 }}>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>Institutional Compliance Contacts:</div>
              <div>University Data Protection Officer: <code>[Confirmation Required: dpo@campus.edu]</code></div>
              <div>Office of Facilities Management: <code>[Confirmation Required: facilities-admin@campus.edu]</code></div>
              <div>Physical Office: <code>[Confirmation Required: Administration Building, Suite 300]</code></div>
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
