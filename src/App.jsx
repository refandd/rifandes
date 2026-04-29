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
  // State untuk Data Form
  const [formData, setFormData] = useState({
    nama: '', gender: '', golDarah: '',
    provinsi: '', kota: '', kecamatan: '',
    tanggalLahir: '', kodeNegara: '+62', telepon: '',
    hobi: '', warna: '#00f2fe'
  });

  // State untuk mengontrol apakah form sudah disubmit atau belum
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Fungsi Update Data
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Reset kota & kecamatan kalau provinsi diganti
    if (name === 'provinsi') setFormData(prev => ({ ...prev, kota: '', kecamatan: '' }));
    // Reset kecamatan kalau kota diganti
    if (name === 'kota') setFormData(prev => ({ ...prev, kecamatan: '' }));
  };

  const navItems = [
    { label: "Matrix", href: "#" },
    { label: "Database", href: "#" },
    { label: "Encrypted", href: "#" },
  ];

  const dockItems = [
    { icon: <span style={{fontSize: '24px'}}>🏠</span>, label: 'Home', onClick: () => setIsSubmitted(false) },
    { icon: <span style={{fontSize: '24px'}}>🖨️</span>, label: 'Print', onClick: () => window.print() },
    { icon: <span style={{fontSize: '24px'}}>⚙️</span>, label: 'Settings', onClick: () => alert('Sistem Stabil.') },
  ];

  // Mendapatkan Inisial Nama (Misal: Andini Putri -> AP)
  const getInitials = (name) => {
    if (!name) return '?';
    const words = name.trim().split(' ');
    if (words.length === 1) return words[0].charAt(0).toUpperCase();
    return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
  };

  return (
    <div className="app-container" style={{ position: 'relative', width: '100vw', minHeight: '100vh', backgroundColor: '#030712', color: '#fff', overflowX: 'hidden' }}>
      
      {/* CSS KHUSUS PRINT - Disembunyikan saat tampil di layar, aktif saat di-print */}
      <style>{`
        @media print {
          body, .app-container { background: white !important; color: black !important; min-height: auto !important; }
          #fluid, .floating-lines-container, header, footer, .gooey-nav-container, .dock-panel { display: none !important; }
          .print-area { box-shadow: none !important; border: 2px solid #ccc !important; background: white !important; color: black !important; filter: none !important; }
          * { text-shadow: none !important; }
        }
      `}</style>

      {/* 1. EFEK VISUAL KELAS BERAT */}
      <SplashCursor />
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, opacity: 0.6 }}>
        <FloatingLines enabledWaves={['top', 'middle', 'bottom']} linesGradient={['#00f2fe', '#a855f7', '#ec4899']} />
      </div>

      {/* 2. KONTEN UTAMA */}
      <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        
        <header style={{ padding: '20px', display: 'flex', justifyContent: 'flex-end' }}>
          <GooeyNav items={navItems} />
        </header>

        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          
          <BlurText 
            text="MATRIX ENTITY SYSTEM" 
            animateBy="words" direction="top" delay={100}
            style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '30px', textAlign: 'center', textShadow: `0 0 20px ${formData.warna}80`, color: formData.warna }}
          />

          {/* KONDISI: JIKA BELUM SUBMIT TAMPILKAN FORM, JIKA SUDAH TAMPILKAN PROFIL */}
          {!isSubmitted ? (
            
            /* --- FORM STEPPER --- */
            <div style={{ 
              background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(20px)', borderRadius: '24px', 
              padding: '20px', border: '1px solid rgba(255,255,255,0.1)', width: '100%', maxWidth: '600px',
              boxShadow: `0 20px 50px rgba(0,0,0,0.5), 0 0 30px ${formData.warna}30`
            }}>
              
              {/* PERHATIKAN BAGIAN INI: Fungsi Supabase dimasukkan ke dalam Stepper utama */}
              <Stepper 
                initialStep={1} 
                backButtonText="Kembali" 
                nextButtonText="Lanjut"
                onFinalStepCompleted={async () => {
                  // Fungsi buat kirim data ke Supabase
                  const { data, error } = await supabase
                    .from('profil_users')
                    .insert([
                      { 
                        nama: formData.nama,
                        gender: formData.gender,
                        gol_darah: formData.golDarah,
                        provinsi: formData.provinsi,
                        kota: formData.kota,
                        kecamatan: formData.kecamatan,
                        tanggal_lahir: formData.tanggalLahir,
                        telepon: formData.telepon,
                        hobi: formData.hobi,
                        warna: formData.warna
                      },
                    ]);

                  if (error) {
                    alert("Gagal simpan data: " + error.message);
                    console.error(error);
                  } else {
                    alert("Data berhasil masuk Matrix!");
                    setIsSubmitted(true); // Layar hasil profil muncul
                  }
                }}
              >
                
                {/* STEP 1: IDENTITAS DASAR */}
                <Step>
                  <h2 style={{ marginBottom: '20px', color: '#00f2fe' }}>01. Identitas Utama</h2>
                  <label style={labelStyle}>Nama Lengkap</label>
                  <input name="nama" value={formData.nama} onChange={handleChange} placeholder="Ketik nama entitas..." style={inputStyle} />
                  
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
                
                {/* STEP 2: LOKASI & KONTAK */}
                <Step>
                  <h2 style={{ marginBottom: '20px', color: '#a855f7' }}>02. Sistem Pelacakan</h2>
                  <div style={{ display: 'flex', gap: '15px' }}>
                    <div style={{ flex: 1 }}>
                      <label style={labelStyle}>Provinsi</label>
                      <select name="provinsi" value={formData.provinsi} onChange={handleChange} style={inputStyle}>
                        <option value="">Pilih Provinsi...</option>
                        {Object.keys(dataWilayah).map(prov => <option key={prov} value={prov}>{prov}</option>)}
                      </select>
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={labelStyle}>Kota / Kabupaten</label>
                      <select name="kota" value={formData.kota} onChange={handleChange} style={inputStyle} disabled={!formData.provinsi}>
                        <option value="">Pilih Kota...</option>
                        {formData.provinsi && Object.keys(dataWilayah[formData.provinsi]).map(kota => <option key={kota} value={kota}>{kota}</option>)}
                      </select>
                    </div>
                  </div>

                  <label style={labelStyle}>Kecamatan</label>
                  <select name="kecamatan" value={formData.kecamatan} onChange={handleChange} style={inputStyle} disabled={!formData.kota}>
                    <option value="">Pilih Kecamatan...</option>
                    {formData.kota && dataWilayah[formData.provinsi][formData.kota].map(kec => <option key={kec} value={kec}>{kec}</option>)}
                  </select>

                  <label style={labelStyle}>Sinyal Komunikasi (Telepon)</label>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <select name="kodeNegara" value={formData.kodeNegara} onChange={handleChange} style={{ ...inputStyle, width: '30%' }}>
                      <option value="+62">🇮🇩 +62</option><option value="+81">🇯🇵 +81</option>
                    </select>
                    <input type="number" name="telepon" value={formData.telepon} onChange={handleChange} placeholder="81234..." style={{ ...inputStyle, width: '70%' }} />
                  </div>
                </Step>

                {/* STEP 3: PERSONALISASI */}
                <Step>
                  <h2 style={{ marginBottom: '20px', color: '#ec4899' }}>03. Personalisasi</h2>
                  <label style={labelStyle}>Keahlian / Hobi</label>
                  <input name="hobi" value={formData.hobi} onChange={handleChange} placeholder="Contoh: Coding, Desain..." style={inputStyle} />
                  
                  <label style={labelStyle}>Aura (Warna Tema Profil)</label>
                  <input type="color" name="warna" value={formData.warna} onChange={handleChange} style={{ ...inputStyle, padding: '5px', height: '50px' }} />
                  
                  <div style={{ marginTop: '20px', padding: '15px', background: 'rgba(0,0,0,0.5)', borderRadius: '10px', fontSize: '0.9rem' }}>
                    Sistem siap mendata entitas <strong>{formData.nama || 'Anonim'}</strong>. Klik 'Complete' untuk merender Matrix Card.
                  </div>
                </Step>

              </Stepper>
            </div>

          ) : (

            /* --- HASIL PROFIL (MATRIX CARD) --- */
            <div className="print-area" style={{ 
              background: 'rgba(10, 15, 30, 0.85)', backdropFilter: 'blur(30px)', borderRadius: '30px', 
              padding: '40px', border: `2px solid ${formData.warna}50`, width: '100%', maxWidth: '500px',
              boxShadow: `0 20px 60px rgba(0,0,0,0.8), inset 0 0 30px ${formData.warna}20`,
              textAlign: 'center'
            }}>
              {/* Avatar Bulat */}
              <div style={{ 
                width: '120px', height: '120px', margin: '0 auto 20px', borderRadius: '50%',
                display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '3rem', fontWeight: '800',
                background: formData.warna, color: '#000', boxShadow: `0 0 40px ${formData.warna}`
              }}>
                {getInitials(formData.nama)}
              </div>
              
              <h1 style={{ margin: '0 0 5px 0', fontSize: '2.2rem' }}>{formData.nama || 'Unknown Entity'}</h1>
              <p style={{ margin: '0 0 25px 0', color: formData.warna, fontWeight: 'bold', letterSpacing: '2px' }}>STATUS: ACTIVE</p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', textAlign: 'left' }}>
                <div style={{ background: 'rgba(0,0,0,0.4)', padding: '15px', borderRadius: '12px' }}>
                  <label style={labelStyle}>Gender</label>
                  <div style={{ fontWeight: 'bold' }}>{formData.gender || '-'}</div>
                </div>
                <div style={{ background: 'rgba(0,0,0,0.4)', padding: '15px', borderRadius: '12px' }}>
                  <label style={labelStyle}>Gol. Darah</label>
                  <div style={{ fontWeight: 'bold', color: '#ff4757' }}>{formData.golDarah || '-'}</div>
                </div>
                <div style={{ background: 'rgba(0,0,0,0.4)', padding: '15px', borderRadius: '12px', gridColumn: 'span 2' }}>
                  <label style={labelStyle}>Pusat Kordinat (Lokasi)</label>
                  <div style={{ fontWeight: 'bold' }}>
                    {formData.kecamatan}, {formData.kota}, {formData.provinsi}
                  </div>
                </div>
                <div style={{ background: 'rgba(0,0,0,0.4)', padding: '15px', borderRadius: '12px' }}>
                  <label style={labelStyle}>Tgl. Lahir</label>
                  <div style={{ fontWeight: 'bold' }}>{formData.tanggalLahir || '-'}</div>
                </div>
                <div style={{ background: 'rgba(0,0,0,0.4)', padding: '15px', borderRadius: '12px' }}>
                  <label style={labelStyle}>Kontak</label>
                  <div style={{ fontWeight: 'bold' }}>{formData.kodeNegara} {formData.telepon}</div>
                </div>
                <div style={{ background: 'rgba(0,0,0,0.4)', padding: '15px', borderRadius: '12px', gridColumn: 'span 2' }}>
                  <label style={labelStyle}>Keahlian Khusus</label>
                  <div style={{ fontWeight: 'bold' }}>{formData.hobi || '-'}</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '15px', marginTop: '30px', justifyContent: 'center' }} className="hide-on-print">
                <button onClick={() => window.print()} style={{ flex: 1, padding: '15px', borderRadius: '10px', border: 'none', background: formData.warna, color: '#000', fontWeight: 'bold', cursor: 'pointer' }}>🖨️ Cetak PDF</button>
                <button onClick={() => setIsSubmitted(false)} style={{ flex: 1, padding: '15px', borderRadius: '10px', border: `1px solid ${formData.warna}`, background: 'transparent', color: formData.warna, fontWeight: 'bold', cursor: 'pointer' }}>🔄 Buat Baru</button>
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