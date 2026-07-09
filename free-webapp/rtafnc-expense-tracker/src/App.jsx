import { useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import {
  Activity,
  ArrowDownCircle,
  ArrowUpCircle,
  BarChart3,
  CheckCircle2,
  Download,
  FileText,
  LogOut,
  Printer,
  Settings,
  ShieldCheck,
  Wallet,
  XCircle
} from 'lucide-react';
import { auth, googleProvider } from './firebase';
import {
  addTransaction,
  approveTransaction,
  defaultSettings,
  ensureUserProfile,
  removeTransaction,
  saveSettings,
  watchSettings,
  watchTransactions
} from './services/firestore';

const allowedDomain = import.meta.env.VITE_ALLOWED_DOMAIN || '';

const defaultForm = {
  type: 'expense',
  category: 'อาหาร/เครื่องดื่ม',
  amount: '',
  date: new Date().toISOString().slice(0, 10),
  note: ''
};

function money(value) {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    minimumFractionDigits: 2
  }).format(Number(value || 0));
}

function toDateText(value) {
  if (!value) return '-';
  return new Intl.DateTimeFormat('th-TH', { dateStyle: 'medium' }).format(new Date(value));
}

function classNames(...items) {
  return items.filter(Boolean).join(' ');
}

function monthKey(dateText) {
  const date = new Date(dateText);
  if (Number.isNaN(date.getTime())) return 'ไม่ระบุ';
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

export default function App() {
  const [authUser, setAuthUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [rows, setRows] = useState([]);
  const [settings, setSettings] = useState(defaultSettings);
  const [settingsDraft, setSettingsDraft] = useState({
    ...defaultSettings,
    categoriesText: defaultSettings.categories.join('\n')
  });
  const [form, setForm] = useState(defaultForm);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [activePanel, setActivePanel] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const categories = settings.categories?.length ? settings.categories : defaultSettings.categories;
  const orgName = settings.organizationName || defaultSettings.organizationName;

  useEffect(() => {
    return onAuthStateChanged(auth, async (user) => {
      try {
        setError('');
        setAuthUser(user);
        if (!user) {
          setProfile(null);
          setRows([]);
          setLoading(false);
          return;
        }
        if (allowedDomain && !user.email.endsWith(`@${allowedDomain}`)) {
          await signOut(auth);
          setError(`บัญชีนี้ไม่ได้อยู่ในโดเมน @${allowedDomain}`);
          setLoading(false);
          return;
        }
        const userProfile = await ensureUserProfile(user);
        setProfile(userProfile);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('ตั้งค่าระบบยังไม่ครบ หรือ Firestore rules ยังไม่พร้อม');
        setLoading(false);
      }
    });
  }, []);

  useEffect(() => {
    if (!profile) return undefined;
    return watchTransactions(profile, setRows);
  }, [profile]);

  useEffect(() => {
    if (!profile) return undefined;
    return watchSettings((nextSettings) => {
      setSettings(nextSettings);
      setSettingsDraft({
        ...nextSettings,
        categoriesText: (nextSettings.categories || []).join('\n')
      });
    });
  }, [profile]);

  useEffect(() => {
    if (!categories.includes(form.category)) {
      setForm((current) => ({ ...current, category: categories[0] || defaultForm.category }));
    }
  }, [categories, form.category]);

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const matchFilter = filter === 'all' || row.type === filter || row.status === filter;
      const text = `${row.category || ''} ${row.note || ''} ${row.createdByEmail || ''}`.toLowerCase();
      return matchFilter && text.includes(search.toLowerCase());
    });
  }, [rows, filter, search]);

  const summary = useMemo(() => {
    const approved = rows.filter((row) => row.status === 'approved');
    const income = approved.filter((row) => row.type === 'income').reduce((sum, row) => sum + Number(row.amount || 0), 0);
    const expense = approved.filter((row) => row.type === 'expense').reduce((sum, row) => sum + Number(row.amount || 0), 0);
    const pending = rows.filter((row) => row.status === 'pending').length;
    return { income, expense, balance: income - expense, pending, approvedCount: approved.length, totalCount: rows.length };
  }, [rows]);

  const monthlySummary = useMemo(() => {
    const approved = rows.filter((row) => row.status === 'approved');
    const map = new Map();
    approved.forEach((row) => {
      const key = monthKey(row.date);
      const current = map.get(key) || { month: key, income: 0, expense: 0 };
      current[row.type === 'income' ? 'income' : 'expense'] += Number(row.amount || 0);
      map.set(key, current);
    });
    return Array.from(map.values()).sort((a, b) => a.month.localeCompare(b.month)).slice(-6);
  }, [rows]);

  async function login() {
    setError('');
    await signInWithPopup(auth, googleProvider);
  }

  async function submit(event) {
    event.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await addTransaction(form, profile);
      setForm({ ...defaultForm, category: categories[0] || defaultForm.category, date: new Date().toISOString().slice(0, 10) });
      setSuccess('บันทึกรายการสำเร็จ');
    } catch (err) {
      console.error(err);
      setError('บันทึกไม่สำเร็จ ตรวจสอบ Firebase config / rules / สิทธิ์ผู้ใช้');
    } finally {
      setSaving(false);
    }
  }

  async function approve(id, status) {
    try {
      setError('');
      await approveTransaction(id, status, profile);
      setSuccess(status === 'approved' ? 'อนุมัติรายการแล้ว' : 'บันทึกไม่อนุมัติแล้ว');
    } catch (err) {
      console.error(err);
      setError('อนุมัติรายการไม่สำเร็จ');
    }
  }

  async function submitSettings(event) {
    event.preventDefault();
    if (profile?.role !== 'admin') return;
    setSavingSettings(true);
    setError('');
    setSuccess('');
    try {
      await saveSettings(settingsDraft, profile);
      setSuccess('บันทึกการตั้งค่าระบบสำเร็จ');
    } catch (err) {
      console.error(err);
      setError('บันทึกการตั้งค่าไม่สำเร็จ เฉพาะ admin เท่านั้นที่แก้ได้');
    } finally {
      setSavingSettings(false);
    }
  }

  function exportCsv() {
    const header = ['date', 'type', 'category', 'amount', 'status', 'createdByEmail', 'note'];
    const lines = filteredRows.map((row) => header.map((key) => `"${String(row[key] || '').replaceAll('"', '""')}"`).join(','));
    const csv = '\ufeff' + [header.join(','), ...lines].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `rtafnc-expense-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  function printReport() {
    window.print();
  }

  if (loading) {
    return <div className="center-screen">กำลังเปิดระบบ...</div>;
  }

  if (!authUser) {
    return (
      <main className="login-page">
        <section className="login-card">
          <div className="badge">FREE WEB APP STACK</div>
          <h1>RTAFNC Expense Tracker</h1>
          <p>ระบบต้นแบบจัดการรายรับรายจ่าย ใช้ Google Login และ Firestore เป็นฐานข้อมูลจริง</p>
          {error && <div className="alert">{error}</div>}
          <button className="primary-btn" onClick={login}>เข้าสู่ระบบด้วย Gmail</button>
          <div className="login-note">เหมาะสำหรับเริ่มต้นระบบภายในแบบไม่ต้องติดตั้งโปรแกรมบนเครื่อง</div>
        </section>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <header className="topbar no-print">
        <div>
          <div className="eyebrow">{orgName}</div>
          <h1>RTAFNC Expense Tracker</h1>
        </div>
        <div className="profile-box">
          <span>{profile?.displayName || authUser.email}</span>
          <small>{profile?.role || 'staff'}</small>
          <button className="ghost-btn" onClick={() => signOut(auth)}><LogOut size={16} /> ออก</button>
        </div>
      </header>

      <nav className="panel-nav no-print">
        <button className={activePanel === 'dashboard' ? 'active' : ''} onClick={() => setActivePanel('dashboard')}><BarChart3 size={16} /> Dashboard</button>
        <button className={activePanel === 'report' ? 'active' : ''} onClick={() => setActivePanel('report')}><FileText size={16} /> รายงาน</button>
        {profile?.role === 'admin' && <button className={activePanel === 'settings' ? 'active' : ''} onClick={() => setActivePanel('settings')}><Settings size={16} /> ตั้งค่า</button>}
      </nav>

      {error && <div className="alert no-print">{error}</div>}
      {success && <div className="success no-print">{success}</div>}

      <section className="stat-grid">
        <StatCard title="รายรับอนุมัติแล้ว" value={money(summary.income)} icon={<ArrowUpCircle />} tone="green" />
        <StatCard title="รายจ่ายอนุมัติแล้ว" value={money(summary.expense)} icon={<ArrowDownCircle />} tone="red" />
        <StatCard title="คงเหลือสุทธิ" value={money(summary.balance)} icon={<Wallet />} tone="blue" />
        <StatCard title="รออนุมัติ" value={`${summary.pending} รายการ`} icon={<Activity />} tone="amber" />
      </section>

      {activePanel === 'dashboard' && (
        <section className="content-grid no-print">
          <form className="panel" onSubmit={submit}>
            <div className="panel-title">
              <ShieldCheck />
              <div>
                <h2>บันทึกรายการใหม่</h2>
                <p>staff เพิ่มรายการแล้วรอ admin อนุมัติ</p>
              </div>
            </div>

            <label>ประเภทรายการ</label>
            <div className="segmented">
              <button type="button" className={form.type === 'expense' ? 'active' : ''} onClick={() => setForm({ ...form, type: 'expense' })}>รายจ่าย</button>
              <button type="button" className={form.type === 'income' ? 'active' : ''} onClick={() => setForm({ ...form, type: 'income' })}>รายรับ</button>
            </div>

            <label>หมวดหมู่</label>
            <select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}>
              {categories.map((category) => <option key={category}>{category}</option>)}
            </select>

            <label>จำนวนเงิน</label>
            <input type="number" min="0" step="0.01" value={form.amount} onChange={(event) => setForm({ ...form, amount: event.target.value })} placeholder="0.00" required />

            <label>วันที่</label>
            <input type="date" value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} required />

            <label>รายละเอียด</label>
            <textarea value={form.note} onChange={(event) => setForm({ ...form, note: event.target.value })} placeholder="ใส่รายละเอียดเพื่อให้ตรวจสอบง่าย" rows="4" />

            <button className="primary-btn" disabled={saving}>{saving ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}</button>
          </form>

          <TransactionsPanel
            rows={filteredRows}
            filter={filter}
            setFilter={setFilter}
            search={search}
            setSearch={setSearch}
            exportCsv={exportCsv}
            profile={profile}
            approve={approve}
            remove={(id) => removeTransaction(id, profile)}
          />
        </section>
      )}

      {activePanel === 'report' && (
        <ReportPanel
          orgName={orgName}
          settings={settings}
          summary={summary}
          monthlySummary={monthlySummary}
          rows={filteredRows}
          printReport={printReport}
          exportCsv={exportCsv}
        />
      )}

      {activePanel === 'settings' && profile?.role === 'admin' && (
        <section className="panel settings-panel no-print">
          <div className="panel-title">
            <Settings />
            <div>
              <h2>ตั้งค่าระบบ</h2>
              <p>แก้ชื่อองค์กร ปีงบประมาณ และหมวดหมู่ที่ใช้ในฟอร์ม</p>
            </div>
          </div>
          <form onSubmit={submitSettings}>
            <label>ชื่อองค์กร</label>
            <input value={settingsDraft.organizationName || ''} onChange={(event) => setSettingsDraft({ ...settingsDraft, organizationName: event.target.value })} />

            <label>ปีงบประมาณ / ปีการศึกษา</label>
            <input type="number" value={settingsDraft.fiscalYear || ''} onChange={(event) => setSettingsDraft({ ...settingsDraft, fiscalYear: event.target.value })} />

            <label>หมวดหมู่ รายการละ 1 บรรทัด</label>
            <textarea rows="8" value={settingsDraft.categoriesText || ''} onChange={(event) => setSettingsDraft({ ...settingsDraft, categoriesText: event.target.value })} />

            <button className="primary-btn" disabled={savingSettings}>{savingSettings ? 'กำลังบันทึก...' : 'บันทึกการตั้งค่า'}</button>
          </form>
        </section>
      )}
    </main>
  );
}

function TransactionsPanel({ rows, filter, setFilter, search, setSearch, exportCsv, profile, approve, remove }) {
  return (
    <section className="panel table-panel">
      <div className="table-toolbar">
        <div>
          <h2>รายการล่าสุด</h2>
          <p>แสดงสูงสุด 200 รายการล่าสุด</p>
        </div>
        <button className="secondary-btn" onClick={exportCsv}><Download size={16} /> Export CSV</button>
      </div>

      <div className="filters">
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="ค้นหาหมวดหมู่/รายละเอียด/ผู้บันทึก" />
        <select value={filter} onChange={(event) => setFilter(event.target.value)}>
          <option value="all">ทั้งหมด</option>
          <option value="income">รายรับ</option>
          <option value="expense">รายจ่าย</option>
          <option value="pending">รออนุมัติ</option>
          <option value="approved">อนุมัติแล้ว</option>
          <option value="rejected">ไม่อนุมัติ</option>
        </select>
      </div>

      <TransactionsTable rows={rows} profile={profile} approve={approve} remove={remove} />
    </section>
  );
}

function TransactionsTable({ rows, profile, approve, remove }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>วันที่</th>
            <th>ประเภท</th>
            <th>หมวดหมู่</th>
            <th>จำนวน</th>
            <th>สถานะ</th>
            <th>ผู้บันทึก</th>
            <th className="no-print">จัดการ</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>{toDateText(row.date)}</td>
              <td><span className={classNames('pill', row.type)}>{row.type === 'income' ? 'รายรับ' : 'รายจ่าย'}</span></td>
              <td><b>{row.category}</b><small>{row.note}</small></td>
              <td className={row.type === 'income' ? 'amount-plus' : 'amount-minus'}>{money(row.amount)}</td>
              <td><span className={classNames('status', row.status)}>{statusText(row.status)}</span></td>
              <td>{row.createdByEmail || '-'}</td>
              <td className="no-print">
                <div className="row-actions">
                  {profile?.role === 'admin' && row.status === 'pending' && (
                    <>
                      <button className="icon-btn ok" onClick={() => approve(row.id, 'approved')}><CheckCircle2 size={16} /></button>
                      <button className="icon-btn no" onClick={() => approve(row.id, 'rejected')}><XCircle size={16} /></button>
                    </>
                  )}
                  {profile?.role === 'admin' && <button className="text-danger" onClick={() => remove(row.id)}>ลบ</button>}
                </div>
              </td>
            </tr>
          ))}
          {rows.length === 0 && <tr><td colSpan="7" className="empty">ยังไม่มีข้อมูล</td></tr>}
        </tbody>
      </table>
    </div>
  );
}

function ReportPanel({ orgName, settings, summary, monthlySummary, rows, printReport, exportCsv }) {
  const maxValue = Math.max(1, ...monthlySummary.flatMap((row) => [row.income, row.expense]));
  return (
    <section className="report-layout">
      <div className="report-actions no-print">
        <button className="secondary-btn" onClick={printReport}><Printer size={16} /> พิมพ์ / Save PDF</button>
        <button className="secondary-btn" onClick={exportCsv}><Download size={16} /> Export CSV</button>
      </div>

      <article className="panel report-page">
        <header className="report-header">
          <div>
            <h2>รายงานสรุปรายรับรายจ่าย</h2>
            <p>{orgName}</p>
          </div>
          <div className="report-meta">
            <b>ปีงบประมาณ {settings.fiscalYear}</b>
            <span>พิมพ์เมื่อ {toDateText(new Date().toISOString())}</span>
          </div>
        </header>

        <section className="report-summary">
          <div><span>รายรับ</span><strong>{money(summary.income)}</strong></div>
          <div><span>รายจ่าย</span><strong>{money(summary.expense)}</strong></div>
          <div><span>คงเหลือ</span><strong>{money(summary.balance)}</strong></div>
          <div><span>รายการทั้งหมด</span><strong>{summary.totalCount}</strong></div>
        </section>

        <section className="mini-chart">
          <h3>ภาพรวม 6 เดือนล่าสุด</h3>
          {monthlySummary.length === 0 && <p>ยังไม่มีรายการที่อนุมัติแล้ว</p>}
          {monthlySummary.map((row) => (
            <div className="chart-row" key={row.month}>
              <span>{row.month}</span>
              <div className="bars">
                <div className="bar income" style={{ width: `${Math.max(4, (row.income / maxValue) * 100)}%` }}>{money(row.income)}</div>
                <div className="bar expense" style={{ width: `${Math.max(4, (row.expense / maxValue) * 100)}%` }}>{money(row.expense)}</div>
              </div>
            </div>
          ))}
        </section>

        <h3>รายการตามตัวกรองปัจจุบัน</h3>
        <TransactionsTable rows={rows} profile={{ role: 'viewer' }} approve={() => {}} remove={() => {}} />
      </article>
    </section>
  );
}

function StatCard({ title, value, icon, tone }) {
  return (
    <article className={classNames('stat-card', tone)}>
      <div>{icon}</div>
      <span>{title}</span>
      <strong>{value}</strong>
    </article>
  );
}

function statusText(status) {
  if (status === 'approved') return 'อนุมัติแล้ว';
  if (status === 'rejected') return 'ไม่อนุมัติ';
  return 'รออนุมัติ';
}
