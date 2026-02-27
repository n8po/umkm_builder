export function getComponentTemplate(type: string, name: string): string {
  switch (type.toLowerCase()) {
    case 'header':
    case 'navbar':
      return `import React from 'react';

export default function ${name}({ businessName = "Bisnis Anda", logo, navItems = ["Beranda", "Produk", "Tentang", "Kontak"], variant = "default", customStyle = {} }) {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer">
          {logo ? <img src={logo} alt={businessName} className="h-8 w-auto" /> : <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">{businessName.charAt(0)}</div>}
          <span className="font-bold text-xl text-gray-900 tracking-tight">{businessName}</span>
        </div>
        <nav className="hidden md:flex gap-8">
          {navItems.map((item, i) => (
            <a key={i} href="#" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
              {item}
            </a>
          ))}
        </nav>
        <button className="hidden md:inline-flex items-center justify-center rounded-full text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 h-10 px-6 py-2 transition-all">
          Pesan Sekarang
        </button>
        <button className="md:hidden p-2 text-gray-600">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </button>
      </div>
    </header>
  );
}`;

    case 'hero':
      return `import React from 'react';

export default function ${name}({ title = "Selamat Datang", subtitle = "Temukan produk dan layanan terbaik untuk kebutuhan Anda.", bgImage, ctaText = "Mulai Sekarang", ctaLink = "#" }) {
  return (
    <section className="relative w-full py-20 md:py-32 lg:py-40 overflow-hidden bg-gray-50 flex items-center justify-center min-h-[70vh]">
      {bgImage && (
        <>
          <div className="absolute inset-0 w-full h-full bg-cover bg-center" style={{ backgroundImage: \`url(\${bgImage})\` }} />
          <div className="absolute inset-0 bg-black/50" />
        </>
      )}
      <div className="container px-4 md:px-6 relative z-10 mx-auto text-center">
        <div className="space-y-6 max-w-3xl mx-auto">
          <h1 className={\`text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl \${bgImage ? 'text-white' : 'text-gray-900'}\`}>
            {title}
          </h1>
          <p className={\`mx-auto max-w-[700px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed \${bgImage ? 'text-gray-200' : 'text-gray-600'}\`}>
            {subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <a href={ctaLink} className="inline-flex items-center justify-center rounded-full text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none bg-blue-600 text-white hover:bg-blue-700 h-12 px-8 py-3 w-full sm:w-auto shadow-lg shadow-blue-600/20">
              {ctaText}
            </a>
            {!bgImage && (
               <a href="#" className="inline-flex items-center justify-center rounded-full text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none border border-gray-200 bg-white text-gray-900 hover:bg-gray-100 h-12 px-8 py-3 w-full sm:w-auto">
                Pelajari Lebih Lanjut
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}`;

    case 'product':
    case 'menu-grid':
      return `import React from 'react';

export default function ${name}({ title = "Katalog Kami", items = [], category }) {
  const displayItems = items.length > 0 ? items : [
    { name: "Produk Contoh 1", price: 25000, description: "Deskripsi singkat mengenai produk ini yang sangat menarik." },
    { name: "Produk Contoh 2", price: 35000, description: "Deskripsi singkat mengenai produk ini yang sangat menarik." },
    { name: "Produk Contoh 3", price: 15000, description: "Deskripsi singkat mengenai produk ini yang sangat menarik." }
  ];

  return (
    <section className="w-full py-16 md:py-24 bg-white">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center justify-center mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{title}</h2>
          <div className="h-1 w-20 bg-blue-600 rounded mt-4"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayItems.map((item, i) => (
            <div key={i} className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-xl hover:-translate-y-1">
              <div className="aspect-video w-full bg-gray-100 relative overflow-hidden">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-gray-400">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                  </div>
                )}
                {item.category && (
                   <span className="absolute top-3 left-3 bg-white/90 backdrop-blur text-gray-800 text-xs font-semibold px-2.5 py-1 rounded-full">{item.category}</span>
                )}
              </div>
              <div className="p-6 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-xl text-gray-900">{item.name}</h3>
                </div>
                {item.description && <p className="text-sm text-gray-500 mb-6 flex-1">{item.description}</p>}
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-lg font-extrabold text-blue-600">
                    Rp {item.price ? item.price.toLocaleString('id-ID') : '0'}
                  </span>
                  <button className="text-sm font-semibold text-white bg-gray-900 hover:bg-gray-800 px-4 py-2 rounded-full transition-colors">
                    Pesan
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}`;

    case 'about':
      return `import React from 'react';

export default function ${name}({ title = "Tentang Kami", description, image, features = [] }) {
  return (
    <section className="w-full py-16 md:py-24 bg-gray-50">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{title}</h2>
            <div className="h-1 w-20 bg-blue-600 rounded"></div>
            <p className="text-gray-600 text-lg leading-relaxed">
              {description || "Kami adalah UMKM yang berdedikasi untuk memberikan produk dan layanan terbaik kepada pelanggan kami. Berdiri dengan komitmen pada kualitas dan kepuasan pelanggan."}
            </p>
            {features && features.length > 0 && (
              <ul className="space-y-3 pt-4">
                {features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                    <span className="font-medium text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            )}
            <div className="pt-4">
               <button className="inline-flex items-center justify-center rounded-full text-sm font-medium transition-colors bg-white border-2 border-gray-200 text-gray-900 hover:bg-gray-50 h-11 px-8">
                Baca Selengkapnya
              </button>
            </div>
          </div>
          <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-gray-200 shadow-xl">
             {image ? (
               <img src={image} alt={title} className="object-cover w-full h-full" />
             ) : (
               <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                 <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
               </div>
             )}
          </div>
        </div>
      </div>
    </section>
  );
}`;

    case 'testimonial':
      return `import React from 'react';

export default function ${name}({ title = "Apa Kata Mereka", reviews = [] }) {
  const displayReviews = reviews.length > 0 ? reviews : [
    { name: "Budi Santoso", content: "Layanan sangat memuaskan dan produk berkualitas tinggi. Sangat direkomendasikan!", rating: 5 },
    { name: "Siti Aminah", content: "Pengiriman cepat dan respon admin sangat ramah. Bakal langganan terus.", rating: 5 },
    { name: "Andi Wijaya", content: "Harga terjangkau dengan kualitas yang tidak murahan. Terbaik di kelasnya.", rating: 4 }
  ];

  return (
    <section className="w-full py-16 md:py-24 bg-white">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center justify-center mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{title}</h2>
          <div className="h-1 w-20 bg-blue-600 rounded mt-4"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayReviews.map((review, i) => (
            <div key={i} className="flex flex-col p-8 rounded-2xl bg-gray-50 border border-gray-100">
              <div className="flex gap-1 mb-4 text-yellow-400">
                {Array.from({ length: 5 }).map((_, j) => (
                  <svg key={j} width="18" height="18" viewBox="0 0 24 24" fill={j < (review.rating || 5) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                ))}
              </div>
              <p className="flex-1 text-gray-600 italic mb-6">"{review.content}"</p>
              <div className="flex items-center gap-4 mt-auto">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                  {review.name ? review.name.charAt(0) : "U"}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{review.name}</h4>
                  <p className="text-xs text-gray-500">Pelanggan</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}`;

    case 'contact':
      return `import React from 'react';

export default function ${name}({ title = "Hubungi Kami", address, whatsapp, email }) {
  return (
    <section className="w-full py-16 md:py-24 bg-blue-50/50">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2">
             <div className="p-8 md:p-12 bg-blue-600 text-white flex flex-col justify-center">
               <h2 className="text-3xl font-bold mb-6">{title}</h2>
               <p className="text-blue-100 mb-8">Punya pertanyaan atau ingin memesan? Jangan ragu untuk menghubungi kami melalui kontak di bawah ini.</p>
               
               <div className="space-y-6">
                 <div className="flex items-start gap-4">
                   <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center shrink-0">
                     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                   </div>
                   <div>
                     <p className="text-sm text-blue-200 font-medium mb-1">WhatsApp / Telepon</p>
                     <p className="font-semibold text-lg">{whatsapp || "0812-3456-7890"}</p>
                   </div>
                 </div>
                 
                 <div className="flex items-start gap-4">
                   <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center shrink-0">
                     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                   </div>
                   <div>
                     <p className="text-sm text-blue-200 font-medium mb-1">Email</p>
                     <p className="font-semibold">{email || "halo@umkm.co.id"}</p>
                   </div>
                 </div>
                 
                 <div className="flex items-start gap-4">
                   <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center shrink-0">
                     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                   </div>
                   <div>
                     <p className="text-sm text-blue-200 font-medium mb-1">Alamat</p>
                     <p className="font-semibold leading-relaxed">{address || "Jl. Sudirman No 123, Jakarta Selatan, Indonesia"}</p>
                   </div>
                 </div>
               </div>
             </div>
             
             <div className="p-8 md:p-12">
               <form className="space-y-4 flex flex-col h-full justify-center">
                 <h3 className="text-xl font-bold text-gray-900 mb-2">Kirim Pesan</h3>
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                   <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" placeholder="Masukkan nama Anda" />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Pesan</label>
                   <textarea rows={4} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none" placeholder="Tulis pesan Anda di sini..."></textarea>
                 </div>
                 <button type="button" className="w-full bg-gray-900 text-white font-bold py-3 rounded-xl focus:outline-none hover:bg-gray-800 transition-colors mt-2">
                   Kirim Pesan
                 </button>
               </form>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}`;

    case 'footer':
      return `import React from 'react';

export default function ${name}({ businessName = "Bisnis Anda", description, address, year = new Date().getFullYear() }) {
  return (
    <footer className="w-full bg-gray-900 text-white py-12 md:py-16 border-t border-gray-800">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="space-y-4 md:col-span-1">
            <h3 className="text-2xl font-bold tracking-tight text-white">{businessName}</h3>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              {description || "Memberikan produk dan pelayanan terbaik untuk Anda. Kepercayaan Anda adalah prioritas utama kami."}
            </p>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-200">Navigasi</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-blue-400 transition-colors">Beranda</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Katalog</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Tentang Kami</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Kontak</a></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-200">Lokasi Kami</h4>
            <p className="text-sm text-gray-400 leading-relaxed">
              {address || "Jl. Jenderal Sudirman No. 123\\nJakarta Selatan, Indonesia 12345"}
            </p>
            <div className="flex gap-4 pt-2">
               {/* Social Icons Placeholder */}
               {['facebook', 'instagram', 'twitter'].map(social => (
                 <a key={social} href="#" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-all">
                   <div className="w-4 h-4 bg-current rounded-sm"></div>
                 </a>
               ))}
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-sm text-gray-500 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© {year} {businessName}. All rights reserved.</p>
          <p>Dibuat dengan <b className="text-gray-300">AI Web Builder</b></p>
        </div>
      </div>
    </footer>
  );
}`;

    default:
      return `import React from 'react';

export default function ${name}(props) {
  return (
    <section className="w-full py-12 bg-white">
      <div className="container px-4 mx-auto">
        <div className="border border-gray-200 rounded-2xl p-8 bg-gray-50/50">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 border-b pb-2">{props.title || '${name} Component'}</h2>
          
          <div className="grid gap-4 mt-6">
            {Object.entries(props).map(([key, value]) => {
              if (key === 'title') return null;
              
              const displayValue = typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value);
              
              return (
                <div key={key} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1 block">{key}</span>
                  {typeof value === 'object' ? (
                     <pre className="text-sm text-gray-700 overflow-x-auto whitespace-pre-wrap">{displayValue}</pre>
                  ) : (
                     <p className="text-gray-700">{displayValue}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}`;
  }
}
