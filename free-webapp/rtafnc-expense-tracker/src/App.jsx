import { useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { Activity, ArrowDownCircle, ArrowUpCircle, CheckCircle2, Download, LogOut, ShieldCheck, Wallet, XCircle } from 'lucide-react';
import { auth, googleProvider } from './firebase';
import {
  addTransaction,
  approveTransaction,
  ensureUserProfile,
  removeTransaction,
  watchTransactions
} from './services/firestore';

const orgName = import.meta.env.VITE_ORG_NAME || 'วิทยาลัยพยาบาลทหารอากาศ';
const allowedDomain = import.meta.env.VITE_ALLOWED_DOMAIN || '';

const defaultForm = {
  type: 'expense',
  category: 'อาหาร/เครื่องดื่ม',
  amount: '',
  date: new Date().toISOString().slice(0, 10),
  note: ''
};

const categories = [
  'อาหาร/เครื่องดื่ม',
  'การเดินทาง/พาหนะ',
  'วัสดุสำนักงาน',
  'งานกิจการนักเรียน',
  'ฝึก/อบรม',
  'รายรับอื่น ๆ'
];

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

export default function App() {
  const [authUser, setAuthUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState(defaultForm);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

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
    return { income, expense, balance: income - expense, pending };
  }, [rows]);

  async function login() {
    setError('');
    await signInWithPopup(auth, googleProvider);
  }

  async function submit(event) {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      await addTransaction(form, profile);
      setForm({ ...defaultForm, date: new Date().toISOString().slice(0, 10) });
    } catch (err) {
      console.error(err);
      setError('บันทึกไม่สำเร็จ ตรวจสอบ Firebase config / rules / สิทธิ์ผู้ใช้');
    } finally {
      setSaving(false);
    }
  }

  async function approve(id, status) {
    try {
      await approveTransaction(id, status, profile);
    } catch (err) {
      console.error(err);
      setError('อนุมัติรายการไม่สำเร็จ');
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
      <header className="topbar">
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

      {error && <div className="alert">{error}</div>}

      <section className="stat-grid">
        <StatCard title="รายรับอนุมัติแล้ว" value={money(summary.income)} icon={<ArrowUpCircle />} tone="green" />
        <StatCard title="รายจ่ายอนุมัติแล้ว" value={money(summary.expense)} icon={<ArrowDownCircle />} tone="red" />
        <StatCard title="คงเหลือสุทธิ" value={money(summary.balance)} icon={<Wallet />} tone="blue" />
        <StatCard title="รออนุมัติ" value={`${summary.pending} รายการ`} icon={<Activity />} tone="amber" />
      </section>

      <section className="content-grid">
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
                  <th>จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((row) => (
                  <tr key={row.id}>
                    <td>{toDateText(row.date)}</td>
                    <td><span className={classNames('pill', row.type)}>{row.type === 'income' ? 'รายรับ' : 'รายจ่าย'}</span></td>
                    <td><b>{row.category}</b><small>{row.note}</small></td>
                    <td className={row.type === 'income' ? 'amount-plus' : 'amount-minus'}>{money(row.amount)}</td>
                    <td><span className={classNames('status', row.status)}>{statusText(row.status)}</span></td>
                    <td>{row.createdByEmail || '-'}</td>
                    <td>
                      <div className="row-actions">
                        {profile?.role === 'admin' && row.status === 'pending' && (
                          <>
                            <button className="icon-btn ok" onClick={() => approve(row.id, 'approved')}><CheckCircle2 size={16} /></button>
                            <button className="icon-btn no" onClick={() => approve(row.id, 'rejected')}><XCircle size={16} /></button>
                          </>
                        )}
                        {profile?.role === 'admin' && <button className="text-danger" onClick={() => removeTransaction(row.id, profile)}>ลบ</button>}
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredRows.length === 0 && <tr><td colSpan="7" className="empty">ยังไม่มีข้อมูล</td></tr>}
              </tbody>
            </table>
          </div>
        </section>
      </section>
    </main>
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
