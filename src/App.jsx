import React, { useState } from 'react';
import { supabase } from './supabaseClient';

// Import Components
import SplashCursor from './components/SplashCursor';
import FloatingLines from './components/FloatingLines';
import GooeyNav from './components/GooeyNav';
import BlurText from './components/BlurText';
import Stepper, { Step } from './components/Stepper';
import Dock from './components/Dock';

// Import CSS
import './components/FloatingLines.css';
import './components/GooeyNav.css';
import './components/Stepper.css';
import './components/Dock.css';

// Styling Global Input
const inputStyle = {
  width: '100%', padding: '12px', background: 'rgba(255, 255, 255, 0.05)', 
  border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '8px', 
  color: 'white', outline: 'none', fontFamily: 'inherit', cursor: 'crosshair',
  marginBottom: '15px'
};

const labelStyle = { display: 'block', marginBottom: '5px', fontSize: '0.8rem', color: '#94a3b8', fontWeight: 'bold' };

// Data Database Wilayah
const dataWilayah = {
  "DKI Jakarta": { 
      "Jakarta Barat": ["Kembangan", "Kebon Jeruk", "Palmerah"], 
      "Jakarta Selatan": ["Tebet", "Setiabudi", "Cilandak"], 
      "Jakarta Pusat": ["Menteng", "Gambir", "Sawah Besar"] 
  },
  "Jawa Barat": { 
      "Bandung": ["Coblong", "Sukajadi", "Sumur Bandung"], 
      "Bekasi": ["Rawalumbu", "Jatiasih", "Pondok Gede"] 
  },
  "Banten": { 
      "Tangerang": ["Ciledug", "Cipondoh", "Karawaci"], 
      "Tangerang Selatan": ["Pamulang", "Ciputat", "Serpong"] 
  }
};

export default function App() {
  // State Form & Tampilan
  const [formData, setFormData] = useState({
    nama: '', gender: '', golDarah: '',
    provinsi: '', kota: '', kecamatan: '',
    tanggalLahir: '', kodeNegara: '+62', telepon: '',
    hobi: '', warna: '#00f2fe'
  });
  
  const [isSubmitted, setIsSubmitted] = useState(false);

  // --- 1. STATE BARU BUAT DATABASE VIEWER ---
  const [showDatabase, setShowDatabase] = useState(false);
  const [dbData, setDbData] = useState([]);
  const [isLoadingDB, setIsLoadingDB] = useState(false);

  // --- 2. FUNGSI TARIK DATA DARI SUPABASE ---
  const ambilDataDatabase = async () => {
    setShowDatabase(true);  // Ganti layar ke mode tabel
    setIsLoadingDB(true);   // Munculin efek loading
    
    // Ambil semua data dari tabel profil_users
    const { data, error } = await supabase.from('profil_users').select('*');
    
    if (error) {
      alert("Gagal ambil database: " + error.message);
    } else {
      setDbData(data); // Simpen datanya ke state
    }
    setIsLoadingDB(false);
  };

  // Fungsi Update Data Form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'provinsi') setFormData(prev => ({ ...prev, kota: '', kecamatan: '' }));
    if (name === 'kota') setFormData(prev => ({ ...prev, kecamatan: '' }));
  };

  // Navigasi Atas (Bisa diklik sekarang)
  const navItems = [
    { label: "Matrix Form", href: "#", onClick: () => { setShowDatabase(false); setIsSubmitted(false); } },
    { label: "Lihat Database", href: "#", onClick: ambilDataDatabase },
  ];

  // Navigasi Dock Bawah (Disesuaikan)
  const dockItems = [
    { icon: <span style={{fontSize: '24px'}}>🏠</span>, label: 'Home', onClick: () => { setShowDatabase(false); setIsSubmitted(false); } },
    { icon: <span style={{fontSize: '24px'}}>🗄️</span>, label: 'Database', onClick: ambilDataDatabase },
    { icon: <span style={{fontSize: '24px'}}>🖨️</span>, label: 'Print', onClick: () => window.print() },
  ];

  const getInitials = (name) => {
    if (!name) return '?';
    const words = name.trim().split(' ');
    if (words.length === 1) return words[0].charAt(0).toUpperCase();
    return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
  };

  return (
    <div className="app-container" style={{ position: 'relative', width: '100vw', minHeight: '100vh', backgroundColor: '#030712', color: '#fff', overflowX: 'hidden' }}>
      
      {/* CSS KHUSUS PRINT */}
      <style>{`
        @media print {
          body, .app-container { background: white !important; color: black !important; min-height: auto !important; }
          #fluid, .floating-lines-container, header, footer, .gooey-nav-container, .dock-panel { display: none !important; }
          .print-area { box-shadow: none !important; border: 2px solid #ccc !important; background: white !important; color: black !important; filter: none !important; }
          * { text-shadow: none !important; }
        }
      `}</style>

      {/* EFEK BACKGROUND */}
      <SplashCursor />
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, opacity: 0.6 }}>
        <FloatingLines enabledWaves={['top', 'middle', 'bottom']} linesGradient={['#00f2fe', '#a855f7', '#ec4899']} />
      </div>

      <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        
        <header style={{ padding: '20px', display: 'flex', justifyContent: 'flex-end' }}>
          {/* Kalau lu klik item di GooeyNav tapi nggak fungsi, berarti komponen custom-nya perlu di-tweak. Pake Dock bawah aja kalau gitu */}
          <GooeyNav items={navItems} />
        </header>

        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          
          <BlurText 
            text="MATRIX ENTITY SYSTEM" 
            animateBy="words" direction="top" delay={100}
            style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '30px', textAlign: 'center', textShadow: `0 0 20px #00f2fe80`, color: '#00f2fe' }}
          />

          {/* --- LOGIKA TAMPILAN: DATABASE vs FORM vs PROFIL --- */}
          {showDatabase ? (
            
            /* TAMPILAN 1: LAYAR TABEL DATABASE */
            <div style={{ 
              background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(20px)', borderRadius: '24px', 
              padding: '30px', border: '1px solid #a855f7', width: '100%', maxWidth: '1000px',
              boxShadow: '0 20px 50px rgba(0,0,0,0.5), 0 0 30px rgba(168, 85, 247, 0.3)',
              overflowX: 'auto'
            }}>
              <h2 style={{ color: '#a855f7', textAlign: 'center', marginBottom: '20px', letterSpacing: '2px' }}>[ SECURE DATABASE LOGS ]</h2>
              
              {isLoadingDB ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#00f2fe' }}>Mendekripsi Data Dari Server... ⏳</div>
              ) : dbData.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#ec4899' }}>Sistem Kosong. Belum ada entitas yang terdaftar.</div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #00f2fe', color: '#00f2fe' }}>
                      <th style={{ padding: '12px' }}>Nama Entitas</th>
                      <th style={{ padding: '12px' }}>Gender</th>
                      <th style={{ padding: '12px' }}>Pusat Lokasi</th>
                      <th style={{ padding: '12px' }}>Kontak</th>
                      <th style={{ padding: '12px' }}>Keahlian</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dbData.map((user, index) => (
                      <tr key={index} style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#e2e8f0', transition: 'all 0.3s' }}>
                        <td style={{ padding: '15px', fontWeight: 'bold' }}>{user.nama}</td>
                        <td style={{ padding: '15px' }}>{user.gender}</td>
                        <td style={{ padding: '15px' }}>{user.kota}, {user.provinsi}</td>
                        <td style={{ padding: '15px' }}>{user.telepon}</td>
                        <td style={{ padding: '15px', color: '#ec4899' }}>{user.hobi}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

          ) : !isSubmitted ? (
            
            /* TAMPILAN 2: FORM STEPPER */
            <div style={{ 
              background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(20px)', borderRadius: '24px', 
              padding: '20px', border: '1px solid rgba(255,255,255,0.1)', width: '100%', maxWidth: '600px',
              boxShadow: `0 20px 50px rgba(0,0,0,0.5), 0 0 30px ${formData.warna}30`
            }}>
              <Stepper 
                initialStep={1} 
                backButtonText="Kembali" 
                nextButtonText="Lanjut"
                onFinalStepCompleted={async () => {
                  const { data, error } = await supabase.from('profil_users').insert([{ 
                    nama: formData.nama, gender: formData.gender, gol_darah: formData.golDarah,
                    provinsi: formData.provinsi, kota: formData.kota, kecamatan: formData.kecamatan,
                    tanggal_lahir: formData.tanggalLahir, telepon: formData.telepon, hobi: formData.hobi, warna: formData.warna
                  }]);

                  if (error) {
                    alert("Gagal simpan data: " + error.message);
                  } else {
                    alert("Data berhasil masuk Matrix!");
                    setIsSubmitted(true);
                  }
                }}
              >
                {/* STEP 1 */}
                <Step>
                  <h2 style={{ marginBottom: '20px', color: '#00f2fe' }}>01. Identitas Utama</h2>
                  <label style={labelStyle}>Nama Lengkap</label>
                  <input name="nama" value={formData.nama} onChange={handleChange} style={inputStyle} />
                  
                  <div style={{ display: 'flex', gap: '15px' }}>
                    <div style={{ flex: 1 }}>
                      <label style={labelStyle}>Gender</label>
                      <select name="gender" value={formData.gender} onChange={handleChange} style={inputStyle}>
                        <option value="">Pilih...</option><option value="Laki-laki">Laki-laki</option><option value="Perempuan">Perempuan</option>
                      </select>
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={labelStyle}>Gol. Darah</label>
                      <select name="golDarah" value={formData.golDarah} onChange={handleChange} style={inputStyle}>
                        <option value="-">N/A</option><option value="A">A</option><option value="B">B</option><option value="AB">AB</option><option value="O">O</option>
                      </select>
                    </div>
                  </div>
                  <label style={labelStyle}>Tanggal Lahir</label>
                  <input type="date" name="tanggalLahir" value={formData.tanggalLahir} onChange={handleChange} style={inputStyle} />
                </Step>
                
                {/* STEP 2 */}
                <Step>
                  <h2 style={{ marginBottom: '20px', color: '#a855f7' }}>02. Sistem Pelacakan</h2>
                  <div style={{ display: 'flex', gap: '15px' }}>
                    <div style={{ flex: 1 }}>
                      <label style={labelStyle}>Provinsi</label>
                      <select name="provinsi" value={formData.provinsi} onChange={handleChange} style={inputStyle}>
                        <option value="">Pilih...</option>{Object.keys(dataWilayah).map(prov => <option key={prov} value={prov}>{prov}</option>)}
                      </select>
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={labelStyle}>Kota</label>
                      <select name="kota" value={formData.kota} onChange={handleChange} style={inputStyle} disabled={!formData.provinsi}>
                        <option value="">Pilih...</option>{formData.provinsi && Object.keys(dataWilayah[formData.provinsi]).map(kota => <option key={kota} value={kota}>{kota}</option>)}
                      </select>
                    </div>
                  </div>
                  <label style={labelStyle}>Kecamatan</label>
                  <select name="kecamatan" value={formData.kecamatan} onChange={handleChange} style={inputStyle} disabled={!formData.kota}>
                    <option value="">Pilih...</option>{formData.kota && dataWilayah[formData.provinsi][formData.kota].map(kec => <option key={kec} value={kec}>{kec}</option>)}
                  </select>
                  <label style={labelStyle}>Kontak Telepon</label>
                  <input type="number" name="telepon" value={formData.telepon} onChange={handleChange} style={inputStyle} />
                </Step>

                {/* STEP 3 */}
                <Step>
                  <h2 style={{ marginBottom: '20px', color: '#ec4899' }}>03. Personalisasi</h2>
                  <label style={labelStyle}>Keahlian</label>
                  <input name="hobi" value={formData.hobi} onChange={handleChange} style={inputStyle} />
                  <label style={labelStyle}>Aura (Warna Tema)</label>
                  <input type="color" name="warna" value={formData.warna} onChange={handleChange} style={{ ...inputStyle, padding: '5px', height: '50px' }} />
                </Step>
              </Stepper>
            </div>

          ) : (

            /* TAMPILAN 3: KARTU HASIL (PROFIL) */
            <div className="print-area" style={{ 
              background: 'rgba(10, 15, 30, 0.85)', backdropFilter: 'blur(30px)', borderRadius: '30px', 
              padding: '40px', border: `2px solid ${formData.warna}50`, width: '100%', maxWidth: '500px',
              boxShadow: `0 20px 60px rgba(0,0,0,0.8), inset 0 0 30px ${formData.warna}20`,
              textAlign: 'center'
            }}>
              <div style={{ 
                width: '120px', height: '120px', margin: '0 auto 20px', borderRadius: '50%',
                display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '3rem', fontWeight: '800',
                background: formData.warna, color: '#000', boxShadow: `0 0 40px ${formData.warna}`
              }}>
                {getInitials(formData.nama)}
              </div>
              
              <h1 style={{ margin: '0 0 5px 0', fontSize: '2.2rem' }}>{formData.nama || 'Unknown'}</h1>
              <p style={{ margin: '0 0 25px 0', color: formData.warna, fontWeight: 'bold' }}>STATUS: ACTIVE</p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', textAlign: 'left' }}>
                <div style={{ background: 'rgba(0,0,0,0.4)', padding: '15px', borderRadius: '12px' }}><label style={labelStyle}>Gender</label><div>{formData.gender}</div></div>
                <div style={{ background: 'rgba(0,0,0,0.4)', padding: '15px', borderRadius: '12px' }}><label style={labelStyle}>Darah</label><div>{formData.golDarah}</div></div>
                <div style={{ background: 'rgba(0,0,0,0.4)', padding: '15px', borderRadius: '12px', gridColumn: 'span 2' }}><label style={labelStyle}>Lokasi</label><div>{formData.kota}, {formData.provinsi}</div></div>
              </div>

              {/* TOMBOL LIHAT DATABASE DIMASUKIN KE SINI BIAR MANTAP */}
              <div style={{ display: 'flex', gap: '10px', marginTop: '30px', flexWrap: 'wrap' }} className="hide-on-print">
                <button onClick={() => setIsSubmitted(false)} style={{ flex: 1, padding: '15px', borderRadius: '10px', border: `1px solid ${formData.warna}`, background: 'transparent', color: formData.warna, fontWeight: 'bold', cursor: 'pointer' }}>🔄 Baru</button>
                <button onClick={ambilDataDatabase} style={{ flex: 1, padding: '15px', borderRadius: '10px', border: 'none', background: '#a855f7', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>🗄️ Buka Database</button>
              </div>
            </div>
          )}
        </main>

        <footer style={{ display: 'flex', justifyContent: 'center', paddingBottom: '20px' }}>
          <Dock items={dockItems} magnification={80} distance={200} panelHeight={70} baseItemSize={50} />
        </footer>
      </div>
    </div>
  );
}