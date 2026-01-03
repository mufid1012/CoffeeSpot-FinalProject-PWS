-- ============================================
-- CoffeeSpot API - Extended Seed Data (100 Coffee Shops)
-- ============================================

USE coffeespot_db;

-- ============================================
-- Admin User (password: admin123)
-- ============================================
INSERT INTO users (username, email, password, role) VALUES
('admin', 'admin@coffeespot.id', '$2a$10$rQnM1UG1h0J5Q5l5l5l5luY6Y6Y6Y6Y6Y6Y6Y6Y6Y6Y6Y6Y6Y6Y6', 'admin');

-- Demo User (password: user123)
INSERT INTO users (username, email, password, role) VALUES
('developer', 'dev@example.com', '$2a$10$rQnM1UG1h0J5Q5l5l5l5luY6Y6Y6Y6Y6Y6Y6Y6Y6Y6Y6Y6Y6Y6Y6', 'user');

-- ============================================
-- Categories
-- ============================================
INSERT INTO categories (name, description) VALUES
('Specialty Coffee', 'Coffee shop yang fokus pada kopi specialty dan single origin dengan brewing methods premium'),
('Cafe & Eatery', 'Cafe dengan menu makanan lengkap dan variasi minuman'),
('Roastery', 'Tempat roasting kopi dengan fasilitas brewing dan cafe'),
('Coffee Chain', 'Jaringan coffee shop dengan banyak cabang di berbagai lokasi');

-- ============================================
-- Facilities
-- ============================================
INSERT INTO facilities (name, icon) VALUES
('WiFi', '📶'),
('AC', '❄️'),
('Parking', '🚗'),
('Outdoor Seating', '🌳'),
('Power Outlet', '🔌'),
('Non-Smoking Area', '🚭'),
('Live Music', '🎵'),
('Food Menu', '🍕'),
('Meeting Room', '🏢'),
('Pet Friendly', '🐕');

-- ============================================
-- Coffee Shops (100 entries)
-- ============================================
INSERT INTO coffeeshops (name, description, address, city, latitude, longitude, open_time, close_time, category_id, rating, image_url) VALUES
-- Jakarta (25 shops)
('Kopi Kenangan Sudirman', 'Coffee shop modern dengan suasana nyaman dan kopi berkualitas tinggi', 'Jl. Sudirman No. 123, Senayan', 'Jakarta', -6.2088, 106.8456, '07:00:00', '23:00:00', 4, 4.5, NULL),
('Filosofi Kopi Melawai', 'Kedai kopi legendaris dengan suasana vintage dan kopi nusantara', 'Jl. Melawai Raya No. 45', 'Jakarta', -6.2441, 106.7970, '08:00:00', '22:00:00', 1, 4.8, NULL),
('Anomali Coffee Kemang', 'Pioneer specialty coffee Indonesia dengan biji kopi pilihan', 'Jl. Kemang Raya No. 72', 'Jakarta', -6.2607, 106.8143, '08:00:00', '22:00:00', 1, 4.7, NULL),
('Kopi Tuku Cipete', 'Kedai kopi dengan menu signature Es Kopi Susu Tetangga', 'Jl. Cipete Raya No. 28', 'Jakarta', -6.2774, 106.8015, '07:00:00', '22:00:00', 4, 4.4, NULL),
('Starbucks Reserve Gatot Subroto', 'Premium coffee experience dengan reserve bar', 'Jl. Gatot Subroto No. 168', 'Jakarta', -6.2297, 106.8175, '07:00:00', '23:00:00', 4, 4.3, NULL),
('Djournal Coffee Senopati', 'Specialty coffee dengan suasana modern dan instagramable', 'Jl. Senopati No. 88', 'Jakarta', -6.2433, 106.8021, '08:00:00', '22:00:00', 1, 4.6, NULL),
('Common Grounds PIK', 'Specialty coffee shop dengan atmosfer modern dan minimalis', 'Jl. Pantai Indah Kapuk No. 12', 'Jakarta', -6.1025, 106.7430, '07:00:00', '23:00:00', 1, 4.5, NULL),
('Fore Coffee Mega Kuningan', 'Coffee chain modern dengan teknologi ordering canggih', 'Jl. Mega Kuningan Barat No. 45', 'Jakarta', -6.2274, 106.8291, '07:00:00', '21:00:00', 4, 4.4, NULL),
('Tanamera Coffee Sudirman', 'Roastery cafe dengan kopi specialty Indonesia', 'Jl. Sudirman No. 200', 'Jakarta', -6.2150, 106.8180, '08:00:00', '22:00:00', 3, 4.6, NULL),
('Kopi Janji Jiwa Thamrin', 'Jaringan kedai kopi dengan harga terjangkau', 'Jl. MH Thamrin No. 55', 'Jakarta', -6.1950, 106.8230, '07:00:00', '22:00:00', 4, 4.2, NULL),
('Manhattan Coffee Kelapa Gading', 'Coffee shop dengan konsep New York style', 'Jl. Boulevard Raya No. 78', 'Jakarta', -6.1600, 106.9050, '08:00:00', '23:00:00', 2, 4.4, NULL),
('Kopitiam 1916 Menteng', 'Kedai kopi heritage dengan suasana tempo dulu', 'Jl. Menteng Raya No. 32', 'Jakarta', -6.1880, 106.8400, '07:00:00', '21:00:00', 2, 4.5, NULL),
('Blueprint Coffee PIK', 'Modern specialty coffee dengan interior industrial', 'Jl. Pantai Indah Utara No. 56', 'Jakarta', -6.1100, 106.7500, '08:00:00', '22:00:00', 1, 4.6, NULL),
('Simetri Coffee Tebet', 'Coffee shop minimalis dengan fokus pada kualitas', 'Jl. Tebet Barat Dalam No. 15', 'Jakarta', -6.2350, 106.8550, '07:30:00', '22:00:00', 1, 4.5, NULL),
('Coffee Cartel Pondok Indah', 'Specialty coffee dengan suasana cozy', 'Jl. Metro Pondok Indah No. 34', 'Jakarta', -6.2700, 106.7850, '08:00:00', '22:00:00', 1, 4.4, NULL),
('Harlan Holden Kuningan', 'Coffee shop premium dengan interior mewah', 'Jl. HR Rasuna Said No. 100', 'Jakarta', -6.2200, 106.8350, '07:00:00', '21:00:00', 1, 4.7, NULL),
('Kopi Soe Tebet', 'Kedai kopi dengan menu es kopi legendaris', 'Jl. Tebet Utara No. 88', 'Jakarta', -6.2280, 106.8520, '07:00:00', '22:00:00', 4, 4.3, NULL),
('Titik Temu Coffee Cikini', 'Coffee shop dengan atmosfer artistic', 'Jl. Cikini Raya No. 45', 'Jakarta', -6.1900, 106.8430, '09:00:00', '22:00:00', 2, 4.5, NULL),
('Kopi Nako Blok M', 'Kedai kopi dengan suasana santai', 'Jl. Melawai Raya No. 100', 'Jakarta', -6.2450, 106.7980, '08:00:00', '21:00:00', 4, 4.2, NULL),
('Excelso Plaza Indonesia', 'Coffee chain premium dengan berbagai pilihan menu', 'Jl. MH Thamrin No. 28-30', 'Jakarta', -6.1930, 106.8220, '07:00:00', '23:00:00', 4, 4.3, NULL),
('One Fifteenth Coffee Gandaria', 'Specialty coffee dengan single origin pilihan', 'Jl. Gandaria I No. 75', 'Jakarta', -6.2480, 106.7880, '08:00:00', '22:00:00', 1, 4.7, NULL),
('Maxx Coffee Grand Indonesia', 'Coffee chain dengan interior modern', 'Jl. MH Thamrin No. 1', 'Jakarta', -6.1950, 106.8210, '07:00:00', '22:00:00', 4, 4.2, NULL),
('Giyanti Coffee Kemang', 'Roastery dengan single origin Indonesia', 'Jl. Kemang Selatan No. 50', 'Jakarta', -6.2650, 106.8100, '08:00:00', '21:00:00', 3, 4.6, NULL),
('Crematology Senayan', 'Specialty coffee dengan brewing methods premium', 'Jl. Asia Afrika No. 8', 'Jakarta', -6.2180, 106.8020, '07:00:00', '22:00:00', 1, 4.5, NULL),
('Upnormal Sudirman', 'Cafe dengan menu indomie dan kopi', 'Jl. Sudirman No. 50', 'Jakarta', -6.2120, 106.8200, '08:00:00', '23:00:00', 2, 4.1, NULL),

-- Bandung (20 shops)
('Two Cents Coffee Braga', 'Specialty coffee dengan single origin pilihan dan brewing methods premium', 'Jl. Braga No. 78', 'Bandung', -6.9175, 107.6191, '07:30:00', '22:00:00', 3, 4.7, NULL),
('Kafe Kolong Dago', 'Cafe unik di bawah jembatan dengan suasana industrial', 'Jl. Dago Pakar No. 15', 'Bandung', -6.8721, 107.6185, '09:00:00', '21:00:00', 2, 4.4, NULL),
('Noah Barn Prawirotaman', 'Coffee shop dengan konsep barn rustic dan specialty coffee', 'Jl. Setiabudi No. 12', 'Bandung', -6.8800, 107.6150, '08:00:00', '23:00:00', 2, 4.6, NULL),
('Armor Kopi Dago', 'Roastery kopi dengan suasana homey', 'Jl. Dago No. 145', 'Bandung', -6.8850, 107.6120, '08:00:00', '22:00:00', 3, 4.5, NULL),
('Kopi Progo', 'Kedai kopi legendaris Bandung sejak 1960', 'Jl. Progo No. 17', 'Bandung', -6.9100, 107.6200, '07:00:00', '21:00:00', 2, 4.6, NULL),
('Yellow Truck Coffee', 'Coffee shop dengan konsep food truck', 'Jl. Riau No. 88', 'Bandung', -6.9020, 107.6180, '08:00:00', '22:00:00', 2, 4.3, NULL),
('Kopi Selasar Sunaryo', 'Coffee shop di area galeri seni', 'Jl. Bukit Pakar Timur No. 100', 'Bandung', -6.8650, 107.6300, '09:00:00', '21:00:00', 1, 4.7, NULL),
('Coffee Toffee Cihampelas', 'Cafe dengan menu kopi dan snack lengkap', 'Jl. Cihampelas No. 160', 'Bandung', -6.8950, 107.6050, '08:00:00', '22:00:00', 2, 4.2, NULL),
('Origin Coffee Paskal', 'Specialty coffee dengan kopi lokal', 'Jl. Pasir Kaliki No. 25', 'Bandung', -6.9080, 107.5950, '07:30:00', '22:00:00', 1, 4.5, NULL),
('Lacamera Coffee Buah Batu', 'Coffee shop dengan suasana mediterania', 'Jl. Buah Batu No. 200', 'Bandung', -6.9350, 107.6350, '08:00:00', '22:00:00', 2, 4.4, NULL),
('Mimiti Coffee Lengkong', 'Roastery lokal dengan single origin pilihan', 'Jl. Lengkong Kecil No. 30', 'Bandung', -6.9200, 107.6100, '08:00:00', '21:00:00', 3, 4.6, NULL),
('Jack Runner Roaster', 'Specialty coffee dengan roasting in-house', 'Jl. Sukajadi No. 155', 'Bandung', -6.8900, 107.5900, '07:00:00', '22:00:00', 3, 4.5, NULL),
('Contrast Coffee Riau', 'Coffee shop dengan konsep kontras hitam putih', 'Jl. RE Martadinata No. 88', 'Bandung', -6.9050, 107.6150, '08:00:00', '22:00:00', 1, 4.4, NULL),
('Kopi Anjis', 'Kedai kopi hits dengan menu unik', 'Jl. Bengawan No. 34', 'Bandung', -6.9150, 107.6250, '08:00:00', '23:00:00', 4, 4.3, NULL),
('Sejiwa Coffee', 'Coffee shop dengan suasana tenang', 'Jl. Dipatiukur No. 72', 'Bandung', -6.8950, 107.6200, '07:30:00', '21:00:00', 1, 4.5, NULL),
('Cups Coffee Setiabudhi', 'Specialty coffee dengan view pegunungan', 'Jl. Setiabudi No. 350', 'Bandung', -6.8600, 107.6100, '08:00:00', '22:00:00', 1, 4.6, NULL),
('Kilogram Coffee', 'Coffee shop dengan konsep industrial', 'Jl. Trunojoyo No. 60', 'Bandung', -6.9000, 107.6080, '07:00:00', '22:00:00', 1, 4.4, NULL),
('Masagi Coffee', 'Kedai kopi dengan menu sundanese', 'Jl. Ciumbuleuit No. 45', 'Bandung', -6.8700, 107.6050, '08:00:00', '21:00:00', 2, 4.5, NULL),
('Kedai Kopi 89', 'Coffee shop dengan suasana vintage', 'Jl. Braga No. 89', 'Bandung', -6.9170, 107.6190, '07:00:00', '22:00:00', 2, 4.4, NULL),
('Sae Coffee Cihampelas', 'Modern coffee shop dengan menu lengkap', 'Jl. Cihampelas No. 50', 'Bandung', -6.8920, 107.6020, '08:00:00', '23:00:00', 2, 4.3, NULL),

-- Surabaya (15 shops)
('Tanamera Coffee Tunjungan', 'Roastery cafe dengan kopi specialty Indonesia', 'Jl. Tunjungan No. 101', 'Surabaya', -7.2575, 112.7521, '08:00:00', '22:00:00', 3, 4.6, NULL),
('Calibre Coffee Galaxy Mall', 'Specialty coffee dengan suasana modern', 'Jl. Dharmahusada No. 45', 'Surabaya', -7.2700, 112.7800, '08:00:00', '22:00:00', 1, 4.5, NULL),
('Historica Coffee Darmo', 'Coffee shop dengan tema sejarah', 'Jl. Darmo No. 150', 'Surabaya', -7.2850, 112.7350, '08:00:00', '21:00:00', 2, 4.4, NULL),
('Contrast Coffee Surabaya', 'Specialty coffee dengan interior minimalis', 'Jl. Embong Malang No. 78', 'Surabaya', -7.2600, 112.7450, '07:30:00', '22:00:00', 1, 4.5, NULL),
('Equator Coffee Pakuwon', 'Coffee shop dengan kopi Indonesia', 'Jl. Pakuwon Town Square No. 12', 'Surabaya', -7.2900, 112.6700, '08:00:00', '22:00:00', 1, 4.4, NULL),
('Redback Specialty Coffee', 'Specialty coffee dengan barista berpengalaman', 'Jl. Sumatra No. 55', 'Surabaya', -7.2650, 112.7500, '07:00:00', '21:00:00', 1, 4.6, NULL),
('Kopi Molo Gubeng', 'Kedai kopi dengan menu tradisional', 'Jl. Gubeng Pojok No. 30', 'Surabaya', -7.2700, 112.7550, '07:00:00', '22:00:00', 2, 4.3, NULL),
('Brick Coffee Mulyosari', 'Coffee shop dengan interior brick exposed', 'Jl. Mulyosari No. 88', 'Surabaya', -7.2550, 112.8000, '08:00:00', '22:00:00', 1, 4.4, NULL),
('Coffee Brosso Manyar', 'Roastery dengan kopi pilihan', 'Jl. Manyar Kertoarjo No. 65', 'Surabaya', -7.2800, 112.7700, '08:00:00', '21:00:00', 3, 4.5, NULL),
('Seca Coffee Kenjeran', 'Modern coffee shop dengan view pantai', 'Jl. Sukolilo No. 100', 'Surabaya', -7.2400, 112.7900, '07:00:00', '22:00:00', 2, 4.3, NULL),
('Cerita Coffee Basuki Rahmat', 'Coffee shop dengan storytelling concept', 'Jl. Basuki Rahmat No. 123', 'Surabaya', -7.2620, 112.7480, '08:00:00', '22:00:00', 2, 4.4, NULL),
('Two Stories Cafe', 'Cafe dua lantai dengan view kota', 'Jl. Raya Darmo Permai No. 50', 'Surabaya', -7.2750, 112.7200, '08:00:00', '23:00:00', 2, 4.5, NULL),
('Northsider Coffee', 'Specialty coffee di Surabaya Utara', 'Jl. Indrapura No. 45', 'Surabaya', -7.2350, 112.7400, '07:30:00', '21:00:00', 1, 4.4, NULL),
('The Goods Cafe TP', 'Lifestyle cafe dengan menu lengkap', 'Jl. Tunjungan Plaza No. 1', 'Surabaya', -7.2610, 112.7380, '09:00:00', '22:00:00', 2, 4.3, NULL),
('BlackBarn Coffee', 'Coffee shop dengan konsep rustic barn', 'Jl. Kertajaya No. 200', 'Surabaya', -7.2720, 112.7650, '08:00:00', '22:00:00', 1, 4.5, NULL),

-- Yogyakarta (15 shops)
('Common Grounds Malioboro', 'Specialty coffee shop dengan atmosfer modern dan minimalis', 'Jl. Malioboro No. 55', 'Yogyakarta', -7.7930, 110.3659, '07:00:00', '23:00:00', 1, 4.5, NULL),
('Peacock Coffee Prawirotaman', 'Coffee shop dengan suasana cozy', 'Jl. Prawirotaman No. 12', 'Yogyakarta', -7.8187, 110.3618, '08:00:00', '23:00:00', 2, 4.6, NULL),
('VIA VIA Cafe', 'Cafe heritage dengan menu internasional', 'Jl. Prawirotaman No. 30', 'Yogyakarta', -7.8190, 110.3620, '08:00:00', '22:00:00', 2, 4.5, NULL),
('Epic Coffee Pandega', 'Specialty coffee dengan single origin', 'Jl. Pandega Marta No. 5', 'Yogyakarta', -7.7700, 110.3850, '07:30:00', '22:00:00', 1, 4.6, NULL),
('Klinik Kopi Jogja', 'Kedai kopi dengan konsep dokter kopi', 'Jl. Kaliurang No. 4.5', 'Yogyakarta', -7.7600, 110.3900, '08:00:00', '23:00:00', 1, 4.7, NULL),
('Filosofi Kopi Jogja', 'Cabang Filosofi Kopi dengan suasana vintage', 'Jl. Jend Sudirman No. 88', 'Yogyakarta', -7.7850, 110.3650, '08:00:00', '22:00:00', 1, 4.5, NULL),
('Satu Satu Coffee', 'Coffee shop dengan interior homey', 'Jl. Palagan Tentara Pelajar No. 15', 'Yogyakarta', -7.7500, 110.3800, '07:00:00', '21:00:00', 2, 4.4, NULL),
('Semasa Coffee Seturan', 'Modern coffee shop untuk anak muda', 'Jl. Seturan Raya No. 25', 'Yogyakarta', -7.7650, 110.4050, '08:00:00', '23:00:00', 2, 4.3, NULL),
('Lucena Coffee', 'Specialty coffee dengan filter brewing', 'Jl. Kaliurang Km 5 No. 20', 'Yogyakarta', -7.7550, 110.3950, '07:30:00', '22:00:00', 1, 4.6, NULL),
('Nala Coffee', 'Coffee shop dengan suasana tenang', 'Jl. Tirtodipuran No. 40', 'Yogyakarta', -7.8100, 110.3700, '08:00:00', '21:00:00', 1, 4.5, NULL),
('Kantin Coffee Gejayan', 'Coffee shop favorit mahasiswa', 'Jl. Gejayan No. 100', 'Yogyakarta', -7.7800, 110.3950, '07:00:00', '23:00:00', 2, 4.2, NULL),
('Mungkin Coffee', 'Kedai kopi dengan nama unik', 'Jl. Kaliurang Km 7 No. 50', 'Yogyakarta', -7.7480, 110.4000, '08:00:00', '22:00:00', 1, 4.4, NULL),
('Lounge Seventeen', 'Coffee lounge dengan view sawah', 'Jl. Palagan Tentara Pelajar Km 8', 'Yogyakarta', -7.7350, 110.3750, '08:00:00', '22:00:00', 2, 4.6, NULL),
('Roaster and Bear', 'Roastery cafe dengan kopi pilihan', 'Jl. Babarsari No. 78', 'Yogyakarta', -7.7750, 110.4100, '08:00:00', '21:00:00', 3, 4.5, NULL),
('Dongeng Coffee', 'Coffee shop dengan tema dongeng', 'Jl. Pandega Marta No. 40', 'Yogyakarta', -7.7720, 110.3880, '08:00:00', '22:00:00', 2, 4.4, NULL),

-- Bali (15 shops)
('Revolver Espresso Seminyak', 'Specialty coffee bar dengan espresso-based drinks premium', 'Jl. Kayu Aya No. 3', 'Bali', -8.6785, 115.1682, '07:00:00', '18:00:00', 1, 4.8, NULL),
('Seniman Coffee Ubud', 'Artists coffee shop dengan kopi lokal dan seni', 'Jl. Sriwedari No. 5', 'Bali', -8.5069, 115.2625, '08:00:00', '22:00:00', 1, 4.5, NULL),
('Anomali Coffee Ubud', 'Specialty coffee dengan view rice terrace', 'Jl. Raya Ubud No. 88', 'Bali', -8.5100, 115.2600, '07:00:00', '21:00:00', 1, 4.6, NULL),
('Hungry Bird Coffee Canggu', 'Coffee shop dengan suasana beach vibes', 'Jl. Pantai Batu Bolong No. 78', 'Bali', -8.6500, 115.1350, '07:00:00', '18:00:00', 1, 4.5, NULL),
('Expat Roasters Seminyak', 'Roastery dengan specialty coffee', 'Jl. Petitenget No. 45', 'Bali', -8.6700, 115.1550, '07:30:00', '22:00:00', 3, 4.7, NULL),
('Sisterfields Seminyak', 'All-day dining cafe dengan kopi berkualitas', 'Jl. Kayu Cendana No. 7', 'Bali', -8.6780, 115.1680, '07:00:00', '22:00:00', 2, 4.6, NULL),
('Milk & Madu Canggu', 'Tropical cafe dengan menu sehat', 'Jl. Pantai Berawa No. 52', 'Bali', -8.6550, 115.1400, '07:00:00', '21:00:00', 2, 4.5, NULL),
('Monsieur Spoon Ubud', 'French bakery cafe dengan kopi premium', 'Jl. Monkey Forest No. 30', 'Bali', -8.5180, 115.2580, '07:30:00', '20:00:00', 2, 4.4, NULL),
('The Slow Canggu', 'Hotel cafe dengan suasana santai', 'Jl. Batu Bolong No. 97', 'Bali', -8.6480, 115.1330, '07:00:00', '22:00:00', 2, 4.6, NULL),
('Gypsy Kitchen Seminyak', 'Bohemian cafe dengan specialty coffee', 'Jl. Oberoi No. 25', 'Bali', -8.6750, 115.1620, '08:00:00', '22:00:00', 2, 4.4, NULL),
('Gemstone Coffee Ubud', 'Hidden gem coffee dengan single origin', 'Jl. Goutama No. 15', 'Bali', -8.5150, 115.2650, '08:00:00', '20:00:00', 1, 4.7, NULL),
('Pison Coffee Sanur', 'Beachside coffee dengan suasana tenang', 'Jl. Danau Tamblingan No. 85', 'Bali', -8.6800, 115.2600, '07:00:00', '21:00:00', 1, 4.5, NULL),
('Coffee Studio Legian', 'Coffee shop dengan konsep studio', 'Jl. Legian No. 200', 'Bali', -8.7100, 115.1700, '08:00:00', '22:00:00', 1, 4.3, NULL),
('I Am Espresso Denpasar', 'Specialty espresso bar di pusat kota', 'Jl. Teuku Umar No. 150', 'Bali', -8.6650, 115.2200, '07:00:00', '21:00:00', 1, 4.4, NULL),
('Habitat Coffee Canggu', 'Eco-friendly coffee shop', 'Jl. Pantai Batu Mejan No. 40', 'Bali', -8.6520, 115.1370, '07:30:00', '18:00:00', 1, 4.6, NULL),

-- Semarang (5 shops)
('Kopi Tarik Selatan', 'Kedai kopi dengan suasana klasik', 'Jl. Pandanaran No. 45', 'Semarang', -6.9830, 110.4190, '07:00:00', '22:00:00', 2, 4.4, NULL),
('Taman Progo Coffee', 'Coffee shop di taman hijau', 'Jl. Progo No. 25', 'Semarang', -6.9750, 110.4100, '08:00:00', '21:00:00', 2, 4.5, NULL),
('Goodrich Coffee Paragon', 'Specialty coffee dengan view mall', 'Jl. Pemuda No. 118', 'Semarang', -6.9800, 110.4250, '08:00:00', '22:00:00', 1, 4.3, NULL),
('Saturdays Coffee Semarang', 'Weekend vibes coffee shop', 'Jl. Gajah Mada No. 88', 'Semarang', -6.9850, 110.4150, '08:00:00', '23:00:00', 1, 4.4, NULL),
('Lokal Kitchen Pleburan', 'Local coffee dengan menu tradisional', 'Jl. Pleburan Raya No. 60', 'Semarang', -6.9900, 110.4050, '07:30:00', '21:00:00', 2, 4.5, NULL),

-- Medan (5 shops)
('Kok Tong Coffee', 'Kedai kopi legendaris Medan', 'Jl. Irian Barat No. 55', 'Medan', 3.5850, 98.6750, '06:00:00', '18:00:00', 2, 4.6, NULL),
('Uptown Coffee', 'Modern coffee shop di pusat kota', 'Jl. Gatot Subroto No. 100', 'Medan', 3.5900, 98.6700, '08:00:00', '22:00:00', 1, 4.4, NULL),
('Daily Coffee Medan', 'Your daily coffee fix', 'Jl. Asia-Afrika No. 150', 'Medan', 3.5950, 98.6650, '07:00:00', '21:00:00', 2, 4.3, NULL),
('Warung Kopi Srikandi', 'Kedai kopi dengan kopi Gayo', 'Jl. Putri Hijau No. 30', 'Medan', 3.5800, 98.6800, '07:00:00', '22:00:00', 1, 4.5, NULL),
('T Garden Coffee', 'Coffee shop dengan taman hijau', 'Jl. Tjong A Fie No. 88', 'Medan', 3.5880, 98.6780, '08:00:00', '21:00:00', 2, 4.4, NULL);

-- ============================================
-- Coffee Shop Facilities (Junction) - Extended
-- ============================================
INSERT INTO coffeeshop_facilities (coffeeshop_id, facility_id) VALUES
-- Jakarta shops (1-25)
(1, 1), (1, 2), (1, 5), (1, 6), (1, 8),
(2, 1), (2, 2), (2, 4), (2, 6),
(3, 1), (3, 2), (3, 3), (3, 5), (3, 6), (3, 8),
(4, 1), (4, 6),
(5, 1), (5, 2), (5, 3), (5, 5), (5, 6), (5, 8), (5, 9),
(6, 1), (6, 2), (6, 5), (6, 6), (6, 8),
(7, 1), (7, 2), (7, 3), (7, 4), (7, 5), (7, 6), (7, 8),
(8, 1), (8, 2), (8, 5), (8, 6),
(9, 1), (9, 2), (9, 3), (9, 5), (9, 6), (9, 8), (9, 9),
(10, 1), (10, 2), (10, 5), (10, 6),
(11, 1), (11, 2), (11, 3), (11, 5), (11, 6), (11, 8),
(12, 1), (12, 2), (12, 4), (12, 6), (12, 8),
(13, 1), (13, 2), (13, 3), (13, 5), (13, 6),
(14, 1), (14, 2), (14, 5), (14, 6),
(15, 1), (15, 2), (15, 3), (15, 5), (15, 6), (15, 8),
(16, 1), (16, 2), (16, 5), (16, 6), (16, 8), (16, 9),
(17, 1), (17, 2), (17, 5), (17, 6),
(18, 1), (18, 2), (18, 4), (18, 5), (18, 7), (18, 8),
(19, 1), (19, 2), (19, 5), (19, 6),
(20, 1), (20, 2), (20, 3), (20, 5), (20, 6), (20, 8),
(21, 1), (21, 2), (21, 5), (21, 6), (21, 8),
(22, 1), (22, 2), (22, 3), (22, 5), (22, 6), (22, 8),
(23, 1), (23, 2), (23, 3), (23, 5), (23, 6),
(24, 1), (24, 2), (24, 5), (24, 6), (24, 8),
(25, 1), (25, 2), (25, 5), (25, 6), (25, 8),
-- Bandung shops (26-45)
(26, 1), (26, 2), (26, 3), (26, 5), (26, 6),
(27, 1), (27, 4), (27, 8),
(28, 1), (28, 2), (28, 4), (28, 7), (28, 8),
(29, 1), (29, 2), (29, 3), (29, 5), (29, 6),
(30, 1), (30, 2), (30, 6), (30, 8),
(31, 1), (31, 4), (31, 8),
(32, 1), (32, 2), (32, 4), (32, 5), (32, 6),
(33, 1), (33, 2), (33, 5), (33, 6), (33, 8),
(34, 1), (34, 2), (34, 5), (34, 6),
(35, 1), (35, 2), (35, 3), (35, 5), (35, 6), (35, 8),
(36, 1), (36, 2), (36, 5), (36, 6),
(37, 1), (37, 2), (37, 3), (37, 5), (37, 6),
(38, 1), (38, 2), (38, 5), (38, 6),
(39, 1), (39, 2), (39, 5), (39, 6), (39, 8),
(40, 1), (40, 2), (40, 5), (40, 6),
(41, 1), (41, 2), (41, 3), (41, 4), (41, 5), (41, 6),
(42, 1), (42, 2), (42, 5), (42, 6),
(43, 1), (43, 2), (43, 4), (43, 8),
(44, 1), (44, 2), (44, 5), (44, 6), (44, 8),
(45, 1), (45, 2), (45, 5), (45, 6), (45, 8),
-- Surabaya shops (46-60)
(46, 1), (46, 2), (46, 3), (46, 5), (46, 6), (46, 8),
(47, 1), (47, 2), (47, 5), (47, 6),
(48, 1), (48, 2), (48, 5), (48, 6), (48, 8),
(49, 1), (49, 2), (49, 5), (49, 6),
(50, 1), (50, 2), (50, 3), (50, 5), (50, 6), (50, 8),
(51, 1), (51, 2), (51, 5), (51, 6),
(52, 1), (52, 2), (52, 5), (52, 6), (52, 8),
(53, 1), (53, 2), (53, 5), (53, 6),
(54, 1), (54, 2), (54, 3), (54, 5), (54, 6),
(55, 1), (55, 4), (55, 8),
(56, 1), (56, 2), (56, 5), (56, 6), (56, 8),
(57, 1), (57, 2), (57, 3), (57, 4), (57, 5), (57, 6), (57, 8),
(58, 1), (58, 2), (58, 5), (58, 6),
(59, 1), (59, 2), (59, 5), (59, 6), (59, 8),
(60, 1), (60, 2), (60, 5), (60, 6),
-- Yogyakarta shops (61-75)
(61, 1), (61, 2), (61, 5), (61, 8),
(62, 1), (62, 2), (62, 4), (62, 7), (62, 8),
(63, 1), (63, 2), (63, 4), (63, 6), (63, 8),
(64, 1), (64, 2), (64, 5), (64, 6),
(65, 1), (65, 2), (65, 5), (65, 6), (65, 8),
(66, 1), (66, 2), (66, 5), (66, 6),
(67, 1), (67, 2), (67, 5), (67, 6), (67, 8),
(68, 1), (68, 2), (68, 5), (68, 6),
(69, 1), (69, 2), (69, 5), (69, 6),
(70, 1), (70, 2), (70, 5), (70, 6),
(71, 1), (71, 2), (71, 5), (71, 6), (71, 8),
(72, 1), (72, 2), (72, 5), (72, 6),
(73, 1), (73, 2), (73, 4), (73, 5), (73, 6), (73, 8),
(74, 1), (74, 2), (74, 3), (74, 5), (74, 6),
(75, 1), (75, 2), (75, 5), (75, 6), (75, 8),
-- Bali shops (76-90)
(76, 1), (76, 4), (76, 10),
(77, 1), (77, 4), (77, 7), (77, 8),
(78, 1), (78, 4), (78, 5), (78, 6),
(79, 1), (79, 4), (79, 10),
(80, 1), (80, 2), (80, 3), (80, 5), (80, 6),
(81, 1), (81, 2), (81, 5), (81, 6), (81, 8),
(82, 1), (82, 4), (82, 8), (82, 10),
(83, 1), (83, 2), (83, 5), (83, 8),
(84, 1), (84, 4), (84, 8),
(85, 1), (85, 4), (85, 7), (85, 8),
(86, 1), (86, 4), (86, 5), (86, 6),
(87, 1), (87, 4), (87, 10),
(88, 1), (88, 2), (88, 5), (88, 6),
(89, 1), (89, 2), (89, 5), (89, 6),
(90, 1), (90, 4), (90, 10),
-- Semarang shops (91-95)
(91, 1), (91, 2), (91, 5), (91, 6), (91, 8),
(92, 1), (92, 4), (92, 5), (92, 6),
(93, 1), (93, 2), (93, 3), (93, 5), (93, 6),
(94, 1), (94, 2), (94, 5), (94, 6), (94, 8),
(95, 1), (95, 2), (95, 5), (95, 6), (95, 8),
-- Medan shops (96-100)
(96, 1), (96, 6), (96, 8),
(97, 1), (97, 2), (97, 5), (97, 6),
(98, 1), (98, 2), (98, 5), (98, 6), (98, 8),
(99, 1), (99, 2), (99, 5), (99, 6),
(100, 1), (100, 4), (100, 5), (100, 6);

-- ============================================
-- Sample API Key for demo user
-- ============================================
INSERT INTO api_keys (user_id, api_key, name, status) VALUES
(2, 'cs_live_demo1234567890abcdef', 'Development Key', 'active');
