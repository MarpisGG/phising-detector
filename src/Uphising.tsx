import { useState } from "react";


const PHISHING_TYPES = [
  { title: "Email Palsu", desc: "Pesan yang tampak resmi namun berisi tautan berbahaya untuk mencuri data login pengguna." },
  { title: "Situs Tiruan", desc: "Website yang meniru tampilan situs resmi perbankan atau e-commerce populer." },
  { title: "SMS / WhatsApp", desc: "Pesan teks berisi link hadiah atau notifikasi palsu yang memancing korban untuk klik." },
  { title: "Social Engineering", desc: "Manipulasi psikologis untuk mendapatkan kepercayaan korban sebelum melakukan penipuan." },
];

const TIPS = [
  { num: "01", title: "Verifikasi alamat URL sebelum klik", desc: 'Pastikan domain sesuai dengan situs asli. Perhatikan ejaan yang sedikit berbeda seperti "g00gle.com" atau "paypa1.com".' },
  { num: "02", title: "Aktifkan autentikasi dua faktor (2FA)", desc: "Lapisan keamanan tambahan ini mencegah akses tidak sah meski password berhasil dicuri oleh penyerang." },
  { num: "03", title: "Jangan klik tautan dari sumber tidak dikenal", desc: "Selalu akses situs penting langsung dari browser, bukan melalui link di pesan masuk yang mencurigakan." },
  { num: "04", title: "Perbarui perangkat dan antivirus secara rutin", desc: "Pembaruan sistem menutup celah keamanan yang sering dieksploitasi oleh pelaku phishing." },
];

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000";

type ResultType = {
  safe: boolean;
  score: number;
  url: string;
};

export default function UPhising() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<ResultType | null>(null);
  const [loading, setLoading] = useState(false);
  const [resultOpen, setResultOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const res = await fetch(`${API_BASE_URL}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });

      if (!res.ok) {
        throw new Error(`Server merespons dengan status ${res.status}`);
      }

      const data = await res.json();

      // result "legitimate" = aman, "phishing" = berbahaya.
      const safe = String(data.result ?? "").toLowerCase() === "legitimate";
      // Bar diambil dari confidence (0..1) dikali 100.
      const score = Math.round((data.confidence ?? 0) * 100);

      setResult({ safe, score, url: url.trim() });
      setResultOpen(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menganalisis URL. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-[#111318] font-sans">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-[#F4F5F7]/90 backdrop-blur border-b border-[#E2E4EA]">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-[15px] tracking-tight">
            <span className="w-2 h-2 rounded-full bg-[#E8622A] inline-block" />
            UPhising
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-16 pb-12">
        <p className="text-[11px] font-semibold tracking-[0.14em] text-[#E8622A] uppercase mb-4">Deteksi Phishing</p>
        <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight mb-5">
          Lindungi Dirimu dari<br />
          <span className="text-[#E8622A]">Ancaman Phishing</span>
        </h1>
        <p className="text-[#6B7080] text-base leading-relaxed max-w-lg">
          Masukkan URL mencurigakan dan sistem kami akan menganalisis apakah tautan tersebut aman atau mengandung indikasi penipuan secara real-time.
        </p>
      </section>

      {/* Form */}
      <section id="cek" className="max-w-5xl mx-auto px-6 pb-16">
        <div className="bg-white border border-[#E2E4EA] rounded-2xl p-7">
          <span className="text-[11px] font-semibold tracking-[0.12em] text-[#6B7080] uppercase mb-3 block">Periksa URL</span>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
              placeholder="Tempel URL di sini, contoh: https://example.com"
              className="flex-1 bg-[#F4F5F7] border border-[#E2E4EA] rounded-xl px-4 py-3 text-sm text-[#111318] placeholder-[#B0B4BE] outline-none focus:border-[#E8622A] focus:ring-2 focus:ring-[#E8622A]/10 transition"
            />
            <button
              onClick={handleAnalyze}
              disabled={loading || !url.trim()}
              className="bg-[#E8622A] text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-[#d4561f] disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity="0.25" />
                    <path fill="currentColor" d="M4 12a8 8 0 018-8v8z" opacity="0.75" />
                  </svg>
                  Menganalisis...
                </>
              ) : "Analisis →"}
            </button>
          </div>

          {error && (
            <div className="mt-5 rounded-xl border border-[#F5C5C5] bg-[#FDF2F2] p-4 text-[13px] text-[#DC2626]">
              {error}
            </div>
          )}

          {resultOpen && result && (
            <div className={`mt-5 rounded-xl border p-5 ${result.safe ? "bg-[#F0FAF5] border-[#BBE5CC]" : "bg-[#FDF2F2] border-[#F5C5C5]"}`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-semibold tracking-[0.14em] text-[#6B7080] uppercase">Hasil Analisis</span>
                <div className="flex items-center gap-1">
                  <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${result.safe ? "bg-[#DCFCE7] text-[#16A34A]" : "bg-[#FEE2E2] text-[#DC2626]"}`}>
                    {result.safe ? "Aman" : "Berbahaya"}
                  </span>
                  <button onClick={() => setResultOpen(false)} className="text-[#6B7080] hover:text-[#6B7080] text-sm px-2 py-1 rounded transition-colors">✕</button>
                </div>
              </div>
              <p className="text-[12px] text-[#6B7080] font-mono mb-3 truncate">{result.url}</p>
              <div className="w-full bg-[#E8EAF0] rounded-full h-2.5 mb-2">
                <div
                  className={`h-2.5 rounded-full transition-all duration-700 ${result.safe ? "bg-[#16A34A]" : "bg-[#DC2626]"}`}
                  style={{ width: `${result.score}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-[#6B7080] mb-3">
                <span>Tingkat keamanan</span>
                <span className={`font-semibold ${result.safe ? "text-[#16A34A]" : "text-[#DC2626]"}`}>{result.score}%</span>
              </div>
              <p className="text-[13px] text-[#6B7080] leading-relaxed">
                {result.safe ? "URL ini tampak aman. Tidak ditemukan indikasi phishing yang signifikan." : "Peringatan! URL ini memiliki indikasi phishing. Hindari mengakses tautan ini."}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Edukasi */}
      <section className="max-w-5xl mx-auto px-6 py-14 border-t border-[#E2E4EA]">
        <p className="text-[11px] font-semibold tracking-[0.14em] text-[#E8622A] uppercase mb-3">Edukasi</p>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">Apa Itu Phishing?</h2>
        <p className="text-[#6B7080] text-sm leading-relaxed max-w-xl mb-8">
          Phishing adalah upaya penipuan siber yang bertujuan mencuri informasi sensitif dengan menyamar sebagai entitas terpercaya melalui pesan atau situs web palsu.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {PHISHING_TYPES.map((item) => (
            <div key={item.title} className="bg-white border border-[#E2E4EA] rounded-xl p-5">
              <h3 className="font-semibold text-[15px] tracking-tight mb-1.5">{item.title}</h3>
              <p className="text-[#6B7080] text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Panduan */}
      <section className="max-w-5xl mx-auto px-6 py-14 border-t border-[#E2E4EA]">
        <p className="text-[11px] font-semibold tracking-[0.14em] text-[#E8622A] uppercase mb-3">Panduan</p>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-6">Cara Menanggulangi Phishing</h2>
        {TIPS.map((tip, i) => (
          <div key={tip.num} className={`flex gap-5 py-5 ${i < TIPS.length - 1 ? "border-b border-[#E2E4EA]" : ""}`}>
            <span className="text-[12px] font-bold text-[#D1D5DB] font-mono min-w-[28px] pt-0.5">{tip.num}</span>
            <div>
              <h4 className="font-semibold text-sm text-[#1F2229] mb-1 tracking-tight">{tip.title}</h4>
              <p className="text-[#6B7080] text-sm leading-relaxed">{tip.desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer className="border-t border-[#E2E4EA] mt-2">
        <div className="max-w-5xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[13px] text-[#6B7080]">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E8622A] inline-block" />
            © 2026 U-Phising · Marvell Christofer · Skripsi Teknik Informatika
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-[#6B7080] transition-colors">Kebijakan Privasi</a>
            <a href="#" className="hover:text-[#6B7080] transition-colors">Kontak</a>
          </div>
        </div>
      </footer>
    </div>
  );
}