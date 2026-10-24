import { Link } from 'react-router-dom'
import { FileCheck, AlertTriangle, ShieldCheck, UserCheck, AlertCircle, Scale, ArrowLeft } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Card, Button } from '../components/ui'

export default function TermsPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flex: 1, maxWidth: 960, margin: '0 auto', width: '100%', padding: '40px 24px' }}>
        {/* Navigation Breadcrumb */}
        <div style={{ marginBottom: 24 }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <Button variant="ghost" size="sm" style={{ paddingLeft: 0, color: '#64748b' }}>
              <ArrowLeft size={14} /> Back to Home
            </Button>
          </Link>
        </div>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '4px 10px', background: '#e2e8f0', borderRadius: 6, fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 12 }}>
            <Scale size={14} /> Institutional Service Agreement
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: '#0f172a', marginBottom: 10, lineHeight: 1.2 }}>
            CampusFix AI Terms of Service
          </h1>
          <p style={{ fontSize: 15, color: '#64748b', lineHeight: 1.6 }}>
            Effective Date: Academic Year 2026-2027 | Status: Subject to University Legal Counsel Ratification
          </p>
        </div>

        {/* Legal Review Advisory */}
        <div style={{
          background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: 8,
          padding: '16px 20px', marginBottom: 32, color: '#334155', fontSize: 14, lineHeight: 1.6
        }}>
          <strong style={{ color: '#0f172a' }}>Legal Review Notice:</strong> These terms govern the deployment and use of the CampusFix AI facility reporting platform across campus facilities. Provisions marked <code>[Pending University Legal Counsel Review]</code> denote clauses awaiting final institutional certification.
        </div>

        {/* Emergency Disclaimer Banner */}
        <div style={{
          background: '#fee2e2', border: '1.5px solid #fecaca', borderRadius: 10,
          padding: '18px 20px', marginBottom: 28, display: 'flex', alignItems: 'flex-start', gap: 14
        }}>
          <AlertCircle size={22} style={{ color: '#b91c1c', flexShrink: 0, marginTop: 2 }} />
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#991b1b', marginBottom: 4 }}>
              Critical Emergency Protocol - Not For Immediate Life Safety Dispatches
            </h3>
            <p style={{ fontSize: 13, color: '#b91c1c', lineHeight: 1.6 }}>
              CampusFix AI is designed for facilities work orders, custodial requests, and physical plant maintenance. In the event of active fire, medical emergency, hazardous chemical release, gas leak, or immediate threat to physical safety, do not file a web ticket. Immediately dial campus emergency dispatch at <code>[Confirmation Required: 555-0911]</code> or dial 911.
            </p>
          </div>
        </div>

        {/* Terms Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Section 1 */}
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{ width: 32, height: 32, borderRadius: 6, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
                <FileCheck size={18} />
              </div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a' }}>1. Acceptance and Eligibility</h2>
            </div>
            <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.7, marginBottom: 12 }}>
              By logging into CampusFix AI, you agree to comply with these terms, the University Acceptable Use Policy, and the Student or Employee Codes of Conduct. Access is authorized exclusively for current university students, active faculty, staff employees, and approved maintenance contractors.
            </p>
            <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.7 }}>
              Attempting to bypass role-based access restrictions or misrepresenting institutional identity will result in immediate credential revocation.
            </p>
          </Card>

          {/* Section 2 */}
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{ width: 32, height: 32, borderRadius: 6, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
                <AlertTriangle size={18} />
              </div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a' }}>2. Issue Reporting Rules and Acceptable Use</h2>
            </div>
            <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.7, marginBottom: 12 }}>
              Users submitting work order tickets agree to the following obligations:
            </p>
            <ul style={{ paddingLeft: 20, fontSize: 14, color: '#475569', lineHeight: 1.8, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <li>
                <strong>Factual Accuracy:</strong> Submissions must accurately reflect observed physical campus conditions, correct building identifiers, and precise room or area coordinates.
              </li>
              <li>
                <strong>Prohibition of False or Prank Reports:</strong> Submitting fraudulent, vexatious, or fabricated repair claims diverts emergency resources and is strictly prohibited under campus disciplinary codes.
              </li>
              <li>
                <strong>Photographic Attachments:</strong> Uploaded images must depict physical facility defects only. Uploading non-relevant media, photographs containing recognizable personal likenesses without consent, or illicit imagery is prohibited.
              </li>
              <li>
                <strong>Professional Communication:</strong> All progress updates, feedback notes, and ticket comments must maintain professional standards free of harassment, profanity, or defamatory content.
              </li>
            </ul>
          </Card>

          {/* Section 3 */}
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{ width: 32, height: 32, borderRadius: 6, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
                <UserCheck size={18} />
              </div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a' }}>3. Account Responsibilities and Credentials</h2>
            </div>
            <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.7, marginBottom: 12 }}>
              Users are responsible for safeguarding their login credentials. Users must notify university IT administrators immediately upon discovering any unauthorized access to their account or work order permissions.
            </p>
            <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.7 }}>
              Account sharing or credential delegation is strictly forbidden across administrative and staff dispatch accounts.
            </p>
          </Card>

          {/* Section 4 */}
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{ width: 32, height: 32, borderRadius: 6, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
                <ShieldCheck size={18} />
              </div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a' }}>4. Service Limitations and Triage SLAs</h2>
            </div>
            <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.7, marginBottom: 12 }}>
              Filing a work order via CampusFix AI does not constitute a legal guarantee of instantaneous remediation. Tickets are triaged according to physical safety priority, contractor scheduling, part availability, and operational resources.
            </p>
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: 16, fontSize: 13, color: '#475569', lineHeight: 1.6 }}>
              <div>
                <strong>Operational SLA Target:</strong> [Pending University Legal Counsel Review: Standard Triage Schedule - Critical issues prioritized within 4 hours; High within 24 hours; Standard within 5 business days].
              </div>
              <div style={{ marginTop: 8 }}>
                <strong>Planned Maintenance Windows:</strong> Software updates and system maintenance are scheduled during off-peak hours with prior campus email notice.
              </div>
            </div>
          </Card>

          {/* Section 5 */}
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{ width: 32, height: 32, borderRadius: 6, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
                <Scale size={18} />
              </div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a' }}>5. Institutional Jurisdiction and Revisions</h2>
            </div>
            <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.7, marginBottom: 12 }}>
              These terms are governed by university institutional statutes and applicable state laws:
            </p>
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: 16, fontSize: 13, color: '#334155' }}>
              <div>Jurisdiction: <code>[Pending University Legal Counsel Review: State / District Legal Venue]</code></div>
              <div style={{ marginTop: 6 }}>Administration: <code>University Office of Facilities and Campus Services</code></div>
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
