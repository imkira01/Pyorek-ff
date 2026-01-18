
// Data Paket Diamond Free Fire
const packages = [
    {
        id: 1,
        diamonds: 100,
        description: "100 Diamond",
        price: 15000,
        icon: "fas fa-gem",
        class: "diamond-100"
    },
    {
        id: 2,
        diamonds: 310,
        description: "310 Diamond + Bonus",
        price: 45000,
        icon: "fas fa-gem",
        class: "diamond-310"
    },
    {
        id: 3,
        diamonds: 520,
        description: "520 Diamond + Bonus",
        price: 75000,
        icon: "fas fa-gem",
        class: "diamond-520"
    },
    {
        id: 4,
        diamonds: 1060,
        description: "1060 Diamond + Bonus",
        price: 150000,
        icon: "fas fa-crown",
        class: "diamond-1060"
    },
    {
        id: 5,
        diamonds: 2180,
        description: "2180 Diamond + Bonus",
        price: 300000,
        icon: "fas fa-crown",
        class: "diamond-2180"
    },
    {
        id: 6,
        diamonds: 5600,
        description: "5600 Diamond + Bonus Maksimal",
        price: 750000,
        icon: "fas fa-crown",
        class: "diamond-5600"
    }
];

// Data WhatsApp API
const whatsappNumber = "+6281223654383";

// State aplikasi
let selectedPackage = null;
let selectedPaymentMethod = "dana";

// Inisialisasi
document.addEventListener('DOMContentLoaded', function() {
    // Render paket diamond
    renderPackages();
    
    // Inisialisasi event listeners
    initEventListeners();
    
    // Update ringkasan awal
    updateOrderSummary();
});

// Render paket diamond
function renderPackages() {
    const packageContainer = document.getElementById('packageContainer');
    packageContainer.innerHTML = '';
    
    packages.forEach(pkg => {
        const packageElement = document.createElement('div');
        packageElement.className = `package ${pkg.class}`;
        packageElement.dataset.id = pkg.id;
        
        packageElement.innerHTML = `
            <div class="package-icon">
                <i class="${pkg.icon}"></i>
            </div>
            <div class="package-diamond">${pkg.diamonds} 💎</div>
            <div class="package-desc">${pkg.description}</div>
            <div class="package-price">Rp ${pkg.price.toLocaleString('id-ID')}</div>
        `;
        
        packageElement.addEventListener('click', () => selectPackage(pkg.id));
        packageContainer.appendChild(packageElement);
    });
}

// Inisialisasi event listeners
function initEventListeners() {
    // Input perubahan
    document.getElementById('playerId').addEventListener('input', updateOrderSummary);
    document.getElementById('nickname').addEventListener('input', updateOrderSummary);
    document.getElementById('server').addEventListener('change', updateOrderSummary);
    
    // Metode pembayaran
    document.querySelectorAll('.payment-method').forEach(method => {
        method.addEventListener('click', function() {
            // Hapus active dari semua metode
            document.querySelectorAll('.payment-method').forEach(m => {
                m.classList.remove('active');
            });
            
            // Tambah active ke metode yang dipilih
            this.classList.add('active');
            selectedPaymentMethod = this.dataset.method;
            updateOrderSummary();
        });
    });
    
    // Tombol WhatsApp
    document.getElementById('whatsappBtn').addEventListener('click', openWhatsAppModal);
    
    // Tombol reset
    document.getElementById('resetBtn').addEventListener('click', resetOrder);
    
    // Modal WhatsApp
    document.getElementById('cancelModal').addEventListener('click', closeWhatsAppModal);
    document.getElementById('confirmWhatsApp').addEventListener('click', sendToWhatsApp);
    document.querySelector('.close-modal').addEventListener('click', closeWhatsAppModal);
    
    // Modal sukses
    document.getElementById('closeSuccessModal').addEventListener('click', closeSuccessModal);
    
    // Tutup modal saat klik di luar
    window.addEventListener('click', function(event) {
        const whatsappModal = document.getElementById('whatsappModal');
        const successModal = document.getElementById('successModal');
        
        if (event.target === whatsappModal) {
            closeWhatsAppModal();
        }
        
        if (event.target === successModal) {
            closeSuccessModal();
        }
    });
}

// Pilih paket diamond
function selectPackage(packageId) {
    // Hapus selected dari semua paket
    document.querySelectorAll('.package').forEach(pkg => {
        pkg.classList.remove('selected');
    });
    
    // Tambah selected ke paket yang dipilih
    const selectedElement = document.querySelector(`.package[data-id="${packageId}"]`);
    selectedElement.classList.add('selected');
    
    // Simpan paket yang dipilih
    selectedPackage = packages.find(pkg => pkg.id === packageId);
    updateOrderSummary();
}

// Update ringkasan pesanan
function updateOrderSummary() {
    const playerId = document.getElementById('playerId').value;
    const nickname = document.getElementById('nickname').value;
    const server = document.getElementById('server').value;
    const serverText = document.getElementById('server').options[document.getElementById('server').selectedIndex]?.text || '-';
    
    // Update ringkasan
    document.getElementById('summaryPlayerId').textContent = playerId || '-';
    document.getElementById('summaryNickname').textContent = nickname || '-';
    document.getElementById('summaryServer').textContent = serverText;
    
    if (selectedPackage) {
        document.getElementById('summaryPackage').textContent = `${selectedPackage.diamonds} Diamond`;
        document.getElementById('summaryPrice').textContent = `Rp ${selectedPackage.price.toLocaleString('id-ID')}`;
    } else {
        document.getElementById('summaryPackage').textContent = '-';
        document.getElementById('summaryPrice').textContent = 'Rp 0';
    }
    
    // Update metode pembayaran
    const paymentMethods = {
        dana: 'DANA',
        gopay: 'GoPay',
        ovo: 'OVO',
        shopee: 'ShopeePay',
        bank: 'Transfer Bank'
    };
    
    document.getElementById('summaryPayment').textContent = paymentMethods[selectedPaymentMethod] || '-';
    
    // Update total
    const total = selectedPackage ? selectedPackage.price : 0;
    document.getElementById('summaryTotal').textContent = `Rp ${total.toLocaleString('id-ID')}`;
}

// Buka modal WhatsApp
function openWhatsAppModal() {
    // Validasi form
    const playerId = document.getElementById('playerId').value;
    const nickname = document.getElementById('nickname').value;
    const server = document.getElementById('server').value;
    
    if (!playerId || !nickname || !server || !selectedPackage) {
        alert('Harap lengkapi semua data sebelum melanjutkan!');
        return;
    }
    
    // Update ringkasan di modal
    const modalSummary = document.querySelector('.modal-summary');
    const serverText = document.getElementById('server').options[document.getElementById('server').selectedIndex]?.text;
    
    modalSummary.innerHTML = `
        <div class="summary-item">
            <span>Player ID:</span>
            <span>${playerId}</span>
        </div>
        <div class="summary-item">
            <span>Nickname:</span>
            <span>${nickname}</span>
        </div>
        <div class="summary-item">
            <span>Server:</span>
            <span>${serverText}</span>
        </div>
        <div class="summary-item">
            <span>Paket:</span>
            <span>${selectedPackage.diamonds} Diamond</span>
        </div>
        <div class="summary-item">
            <span>Harga:</span>
            <span>Rp ${selectedPackage.price.toLocaleString('id-ID')}</span>
        </div>
        <div class="summary-item total">
            <span>Total:</span>
            <span>Rp ${selectedPackage.price.toLocaleString('id-ID')}</span>
        </div>
    `;
    
    // Tampilkan modal
    document.getElementById('whatsappModal').style.display = 'flex';
}

// Tutup modal WhatsApp
function closeWhatsAppModal() {
    document.getElementById('whatsappModal').style.display = 'none';
}

// Kirim pesan ke WhatsApp
function sendToWhatsApp() {
    const playerId = document.getElementById('playerId').value;
    const nickname = document.getElementById('nickname').value;
    const server = document.getElementById('server').value;
    const serverText = document.getElementById('server').options[document.getElementById('server').selectedIndex]?.text;
    
    // Format pesan
    const message = `Halo Toko Masashi Ryuzz, saya ingin top up Free Fire dengan detail berikut:
    
🎮 *DATA AKUN FREE FIRE:*
• Player ID: ${playerId}
• Nickname: ${nickname}
• Server: ${serverText}

💎 *PAKET DIAMOND:*
• ${selectedPackage.diamonds} Diamond
• Harga: Rp ${selectedPackage.price.toLocaleString('id-ID')}

💳 *METODE PEMBAYARAN:*
• ${selectedPaymentMethod.toUpperCase()}

Tolong proses pesanan saya. Terima kasih!`;
    
    // Encode pesan untuk URL
    const encodedMessage = encodeURIComponent(message);
    
    // Buat URL WhatsApp
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    
    // Tutup modal WhatsApp
    closeWhatsAppModal();
    
    // Buka WhatsApp di tab baru
    window.open(whatsappURL, '_blank');
    
    // Tampilkan modal sukses setelah 500ms
    setTimeout(() => {
        document.getElementById('successModal').style.display = 'flex';
    }, 500);
}

// Tutup modal sukses
function closeSuccessModal() {
    document.getElementById('successModal').style.display = 'none';
}

// Reset pesanan
function resetOrder() {
    // Reset form
    document.getElementById('playerId').value = '';
    document.getElementById('nickname').value = '';
    document.getElementById('server').value = '';
    
    // Reset paket
    document.querySelectorAll('.package').forEach(pkg => {
        pkg.classList.remove('selected');
    });
    selectedPackage = null;
    
    // Reset metode pembayaran
    document.querySelectorAll('.payment-method').forEach(method => {
        method.classList.remove('active');
    });
    
    // Set DANA sebagai default
    document.querySelector('.payment-method[data-method="dana"]').classList.add('active');
    selectedPaymentMethod = "dana";
    
    // Update ringkasan
    updateOrderSummary();
    
    // Beri feedback
    alert('Pesanan telah direset. Silakan isi data baru.');
}

// Fitur tambahan: Validasi Player ID
document.getElementById('playerId').addEventListener('blur', function() {
    const playerId = this.value;
    if (playerId && (isNaN(playerId) || playerId.length < 8 || playerId.length > 12)) {
        alert('Player ID harus berupa angka antara 8-12 digit!');
        this.focus();
    }
});

// Fitur tambahan: Animasi untuk paket
document.querySelectorAll('.package').forEach(pkg => {
    pkg.addEventListener('mouseenter', function() {
        if (!this.classList.contains('selected')) {
            this.style.transform = 'translateY(-5px)';
        }
    });
    
    pkg.addEventListener('mouseleave', function() {
        if (!this.classList.contains('selected')) {
            this.style.transform = 'translateY(0)';
        }
    });
});

// Fitur tambahan: Simpan data ke localStorage
function saveToLocalStorage() {
    const orderData = {
        playerId: document.getElementById('playerId').value,
        nickname: document.getElementById('nickname').value,
        server: document.getElementById('server').value,
        packageId: selectedPackage ? selectedPackage.id : null,
        paymentMethod: selectedPaymentMethod,
        timestamp: new Date().getTime()
    };
    
    localStorage.setItem('masashiRyuzzLastOrder', JSON.stringify(orderData));
}

// Fitur tambahan: Load data dari localStorage jika ada
