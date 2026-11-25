'use strict';
/* =================== TerokaMath · BAHASA (BM | EN) untuk kelas DLP ===================
   Rangka dwibahasa. Teks antara muka ditulis dalam BM; apabila bahasa = EN, setiap nod teks
   antara muka ditukar menggunakan kamus TMX di bawah (frasa penuh sahaja – jika ada perkataan
   yang tiada dalam kamus, nod itu dibiarkan BM supaya tiada ayat bercampur).
   Kandungan (nota, soalan, rajah, simulasi) TIDAK disentuh – kandungan EN akan ditambah bab demi bab.
   Dimuat oleh setiap bab (selepas asas.js), halaman utama dan game. */
const TM_LANG_KEY = 'terokamath-lang';
const tmLang = (() => { try { return localStorage.getItem(TM_LANG_KEY) === 'en' ? 'en' : 'ms'; } catch (e) { return 'ms'; } })();
const tmEN = tmLang === 'en';
function tmSetLang(l) { try { localStorage.setItem(TM_LANG_KEY, l); } catch (e) {} location.reload(); }
const tmLangBtn = (cls = 'ib langbtn') => `<button type="button" class="${cls}" id="langBtn" aria-label="${tmEN ? 'Switch to Bahasa Melayu' : 'Tukar ke bahasa Inggeris'}" title="BM | EN"><b>${tmEN ? 'EN' : 'BM'}</b></button>`;
const tmBindLang = () => { const b = document.getElementById('langBtn'); if (b) b.onclick = () => tmSetLang(tmEN ? 'ms' : 'en'); };

/* ---------- kamus BM → EN (frasa) ---------- */
const TMX = {
  // umum & kerangka
  'Bab': 'Chapter', 'Tingkatan': 'Form', 'Subtopik': 'Subtopic', 'subtopik': 'subtopic', 'Slaid': 'Slide', 'slaid': 'slides', 'Soalan': 'Question', 'soalan': 'questions',
  'Pelan Mengajar': 'Teaching Plan', 'Pelan': 'Plan', 'Mula Mengajar': 'Start Teaching', 'MULA MENGAJAR': 'START TEACHING', 'MENGAJAR': 'TEACHING', 'Mengajar': 'Teaching',
  'NOTA': 'NOTES', 'Nota': 'Notes', 'TEROKA': 'EXPLORE', 'Teroka': 'Explore', 'LATIHAN': 'PRACTICE', 'Latihan': 'Practice', 'GAMES': 'GAMES', 'Games': 'Games',
  'Kembali ke TerokaMath (semua bab)': 'Back to TerokaMath (all chapters)', 'Tab utama': 'Main tabs', 'Tukar ke mod gelap': 'Switch to dark mode', 'Tukar ke mod cerah': 'Switch to light mode', 'Skrin penuh': 'Full screen',
  'Jom Mula!': "Let's Start!", 'Logo': 'Logo', 'Pilih subtopik untuk mula mengajar': 'Choose a subtopic to start teaching', 'Cetak semua nota (PDF)': 'Print all notes (PDF)',
  'Kembali ke senarai subtopik': 'Back to subtopic list', 'Cetak nota subtopik ini': 'Print notes for this subtopic', 'Slaid sebelum': 'Previous slide', 'Slaid seterusnya': 'Next slide', 'Langkah seterusnya': 'Next step', 'Tamat nota Bab': 'End of notes, Chapter',
  'Seterusnya': 'Next', 'Sebelumnya': 'Previous', 'Tamat': 'End', 'Mula': 'Start', 'Pilih': 'Choose', 'Semak': 'Check', 'Tutup': 'Close', 'Keluar': 'Exit', 'Buang': 'Remove', 'Tambah': 'Add', 'Naik': 'Up', 'Turun': 'Down', 'Kurang': 'Less', 'Kembali': 'Back',
  'daripada': 'of', 'Pilih simulasi': 'Choose a simulation', 'Simulasi': 'Simulation', 'SIMULASI': 'SIMULATION', 'Mudah': 'Easy', 'Sederhana': 'Medium', 'Sukar': 'Hard',
  // latihan
  'Latihan Kelas': 'Class Practice', 'Tandakan subtopik yang': 'Tick the subtopics that have', 'sudah diajar': 'been taught', 'Soalan hanya diambil daripada subtopik ini': 'Questions are taken only from these subtopics',
  'BILANGAN SOALAN': 'NUMBER OF QUESTIONS', 'ARAS SOALAN': 'QUESTION LEVEL', 'Soalan dijana rawak, disusun dari mudah ke sukar. Setiap set berbeza': 'Questions are randomly generated, from easy to hard. Every set is different',
  'Mula Latihan': 'Start Practice', 'LATIHAN SELESAI': 'PRACTICE COMPLETE', 'Syabas, kelas!': 'Well done, class!', 'soalan telah dibincangkan': 'questions discussed',
  'Set baharu (subtopik sama)': 'New set (same subtopics)', 'Pilih subtopik lain': 'Choose other subtopics', 'Soalan sebelumnya': 'Previous question', 'Soalan seterusnya': 'Next question',
  'Tunjuk': 'Show', 'Sorok': 'Hide', 'jawapan': 'answer', 'Tunjuk jawapan': 'Show answer', 'Sorok jawapan': 'Hide answer', 'Selesai': 'Done', 'JAWAPAN': 'ANSWER', 'JALAN KERJA': 'WORKING',
  // Cabaran 60 Saat
  'Cabaran 60 Saat': '60-Second Challenge', 'Jawab seberapa banyak soalan dalam masa 60 saat': 'Answer as many questions as you can in 60 seconds', 'Masa': 'Time', 'saat': 'seconds', 'Ada': 'You have', '3 nyawa': '3 lives',
  'Jawapan salah menolak satu nyawa': 'A wrong answer costs one life', 'Betul berturut-turut untuk': 'Answer correctly in a row for a', 'combo': 'combo', 'markah berganda sehingga ×5': 'points multiply up to ×5',
  'Rekod': 'Best', 'markah': 'points', 'jawapan betul': 'correct answers', 'Main lagi': 'Play again', 'Ulang kaji nota': 'Revise the notes', 'Betul!': 'Correct!', 'Salah. Jawapan': 'Wrong. Answer', 'Pilihan anda': 'Your choice', 'Skor': 'Score',
  'NYAWA HABIS': 'OUT OF LIVES', 'MASA TAMAT': "TIME'S UP", 'Rekod baharu!': 'New best!', 'Langkau soalan': 'Skip question', 'Ketik pada titik persilangan grid': 'Tap a grid intersection', 'nyawa': 'lives', 'saat lagi': 'seconds left',
  'Semua soalan': 'All questions are', 'pilih jawapan': 'multiple choice', 'daripada bank soalan bab ini': 'from this chapter’s question bank', 'Selepas menjawab, jawapan betul ditunjukkan': 'After you answer, the correct answer is shown',
  'Senyapkan bunyi': 'Mute sound', 'Hidupkan bunyi': 'Turn sound on', 'JENIS SOALAN': 'QUESTION TYPES', 'Jenis soalan': 'Question types',
  // pilih game & game kelas
  'Pilih game': 'Choose a game', 'Pilih cara bermain yang sesuai dengan kelas hari ini': 'Choose a way to play that suits your class today',
  'MURID MAIN SENDIRI': 'STUDENTS PLAY SOLO', 'Jawab seberapa banyak soalan dalam 60 saat. 3 nyawa, combo dan rekod terbaik': 'Answer as many questions as you can in 60 seconds. 3 lives, combos and a best score',
  'KUMPULAN': 'TEAMS', 'Pertandingan Kumpulan': 'Team Competition', '2 hingga 6 kumpulan berlawan. Cikgu beri markah kepada kumpulan yang betul. Ada papan markah dan podium': '2 to 6 teams compete. The teacher awards points to teams that answer correctly. Includes a scoreboard and podium',
  'SELURUH KELAS': 'WHOLE CLASS', 'Siapa Nak Jawab?': 'Who Wants to Answer?', 'SIAPA NAK JAWAB?': 'WHO WANTS TO ANSWER?', 'Soalan untuk seluruh kelas. Murid angkat tangan, cikgu pilih siapa jawab, kemudian tunjuk jawapan': 'Questions for the whole class. Students raise their hands, the teacher picks who answers, then shows the answer',
  'PILIH RAWAK': 'RANDOM PICK', 'Roda Nama': 'Name Wheel', 'Taip nama murid (atau apa-apa) ke dalam roda. Putar untuk pilih seorang secara rawak': 'Type student names (or anything) into the wheel. Spin to pick one at random',
  'BILANGAN KUMPULAN': 'NUMBER OF TEAMS', 'NAMA KUMPULAN': 'TEAM NAMES', 'Nama kumpulan': 'Team name', 'MASA SETIAP SOALAN': 'TIME PER QUESTION', 'Tanpa': 'None', 'KEPUTUSAN': 'RESULTS', 'Tahniah semua kumpulan!': 'Congratulations, all teams!',
  'Tukar tetapan': 'Change settings', 'Kumpulan': 'Team', 'Merah': 'Red', 'Biru': 'Blue', 'Hijau': 'Green', 'Kuning': 'Yellow', 'Ungu': 'Purple', 'Oren': 'Orange', 'JOHAN': 'CHAMPION', 'NAIB JOHAN': 'RUNNER-UP', 'KETIGA': 'THIRD',
  'Tamatkan pertandingan dan lihat keputusan?': 'End the competition and see the results?', 'BONUS ×2': 'BONUS ×2', 'Lihat keputusan': 'See results', 'Beri markah': 'Award points', 'Siapa betul?': 'Who got it right?',
  'Soalan disusun dari mudah ke sukar. Tiada had masa': 'Questions go from easy to hard. No time limit', 'SELESAI': 'COMPLETE', 'soalan dijawab betul oleh kelas': 'questions answered correctly by the class', 'Kelas betul': 'Class correct',
  'Angkat tangan jika tahu jawapan!': 'Raise your hand if you know the answer!', 'Langkau': 'Skip', 'Kelas jawab betul?': 'Did the class answer correctly?', 'Salah': 'Wrong', 'Betul': 'Correct', 'Tiada had masa. Tunjuk jawapan bila sudah sedia': 'No time limit. Show the answer when ready',
  'Taip nama dalam kotak nama': 'Type names in the name box', 'PUTAR': 'SPIN', 'Putar': 'Spin', 'Putar lagi': 'Spin again', 'Putar roda': 'Spin the wheel', 'Soalan untuk': 'Question for', 'Soalan lain': 'Another question', 'SENARAI': 'LIST', 'Senarai': 'List',
  'TAIP NAMA (satu baris satu nama)': 'TYPE NAMES (one name per line)', 'nama': 'names', 'lagi dalam roda': 'left on the wheel', 'Buang nama selepas dipilih': 'Remove a name after it is picked', 'Beri soalan selepas roda berhenti': 'Give a question when the wheel stops',
  'Masukkan semula semua nama': 'Put all names back', 'TERPILIH': 'PICKED', 'Sudah dipilih': 'Already picked', 'Storan penuh': 'Storage full', 'Semua nama sudah dipilih. Roda diisi semula': 'All names have been picked. The wheel has been refilled',
  'Nama senarai baharu (contoh: 2 Amanah)': 'New list name (e.g. 2 Amanah)', 'Nama senarai': 'List name', 'Pilih sekurang-kurangnya satu jenis soalan': 'Choose at least one question type', 'Roda kosong': 'Empty wheel', 'Tutup soalan': 'Close question',
  'Pilih senarai nama': 'Choose a name list', 'Senarai baharu': 'New list', 'Namakan semula senarai': 'Rename list', 'Padam senarai': 'Delete list',
  // lembaran kerja
  'Lembaran Kerja': 'Worksheet', 'Lembaran': 'Worksheet', 'Pilih soalan yang dikehendaki, kemudian cetak untuk diberi kepada murid': 'Choose the questions you want, then print them for students', 'DIPILIH': 'SELECTED', 'SOALAN': 'QUESTIONS',
  'Sertakan skema jawapan': 'Include answer scheme', 'Cetak / PDF': 'Print / PDF', 'Nama': 'Name', 'Kelas': 'Class', 'Tarikh': 'Date', 'Skema Jawapan': 'Answer Scheme', 'Untuk kegunaan guru': 'For teacher use', 'Semua': 'All', 'Melukis': 'Drawing',
  'Jenis latihan': 'Exercise type', 'Naikkan soalan': 'Move question up', 'Turunkan soalan': 'Move question down', 'Buang soalan': 'Remove question', 'Tapis aras': 'Filter by level', 'Tiada soalan': 'No questions', 'Kosongkan': 'Clear', 'Kosongkan pilihan': 'Clear selection',
  // pelan mengajar
  'Semua slaid': 'All slides', 'Pilih soalan': 'Choose questions', 'PELAN': 'PLAN', 'Pelan baharu': 'New plan', 'Kongsi link': 'Share link', 'BAHAN': 'MATERIALS', 'PELAN PENGAJARAN': 'TEACHING PLAN', 'ITEM': 'ITEMS', 'Seret': 'Drag', 'untuk susun': 'to reorder',
  'PRATONTON': 'PREVIEW', 'Pilih satu item dalam pelan untuk lihat pratonton': 'Choose an item in the plan to preview it', 'Ubah soalan': 'Edit questions', 'Ubah slaid': 'Edit slide', 'Tayang dari sini': 'Present from here',
  'Pelan disimpan dalam pelayar komputer ini. Guna': 'Plans are saved in this computer’s browser. Use', 'untuk beri pelan kepada guru lain': 'to give the plan to other teachers', 'Pilih soalan untuk pelan': 'Choose questions for the plan',
  'Tunjuk jalan kerja bersama jawapan': 'Show working with the answer', 'SAIZ GAMBAR': 'IMAGE SIZE', 'Seret gambar dalam pratonton untuk ubah kedudukan': 'Drag the image in the preview to move it', 'Buang gambar': 'Remove image', 'LATAR': 'BACKGROUND', 'LATAR SLAID': 'SLIDE BACKGROUND',
  'Tiada soalan dalam latihan ini': 'No questions in this exercise', 'LINK': 'LINK', 'Link ini menyimpan pelan seperti sekarang. Jika pelan diubah, cipta link baharu': 'This link stores the plan as it is now. If the plan changes, create a new link', 'Salin link': 'Copy link',
  'Guru yang buka link ini akan nampak pelan': 'Teachers who open this link will see the plan', 'sahaja. Mereka hanya boleh tayang pelan ini. Mereka tidak dapat membuka bahagian lain': 'only. They can only present this plan. They cannot open other parts', 'atau mengubah pelan': 'or change the plan',
  'Set induksi': 'Set induction', 'Penutup': 'Closure', 'murid mencapai objektif': 'students achieved the objectives', 'Catatan': 'Notes', 'RPH': 'Lesson Plan', 'PELAN DIKONGSI': 'SHARED PLAN', 'Pelan dikongsi': 'Shared plan', 'Link tidak sah': 'Invalid link',
  'Link ini rosak atau tidak lengkap. Minta guru yang berkongsi menghantar semula link': 'This link is broken or incomplete. Ask the teacher who shared it to send the link again', 'Membuka pelan…': 'Opening plan…', 'item. Tekan Tayang untuk mula mengajar dengan pelan ini': 'items. Press Present to start teaching with this plan',
  'Tayang': 'Present', 'SLAID': 'SLIDES', 'GAME': 'GAME', 'SLAID CIKGU': 'TEACHER SLIDE', 'Tajuk + isi': 'Title + content', 'Poin keluar satu demi satu': 'Points appear one by one', 'Soalan cepat': 'Quick question', 'Soalan, kemudian tunjuk jawapan': 'Question, then show the answer',
  'Gambar': 'Image', 'Tajuk + gambar sendiri': 'Title + your own image', 'Papan': 'Board', 'Ruang tulis & lukis dengan pen': 'Space to write & draw with a pen', 'Pautan / video': 'Link / video', 'Link YouTube atau laman web': 'YouTube or website link',
  'Storan penuh. Buang gambar yang besar atau pelan lama': 'Storage full. Remove large images or old plans', 'Asal': 'Original', 'Kecil': 'Small', 'Biasa': 'Normal', 'Besar': 'Large', 'Sangat besar': 'Very large', 'Merah jambu': 'Pink', 'Hitam': 'Black', 'Putih': 'White',
  'Buka di YouTube': 'Open in YouTube', 'Buka pautan': 'Open link', 'Slaid nota': 'Note slides', 'Pilih soalan dari bank': 'Choose questions from the bank', 'Game': 'Game', '4 pilihan game': '4 game options', 'Slaid baharu': 'New slide', '5 templat': '5 templates',
  'TAJUK KECIL (pilihan)': 'SUBTITLE (optional)', 'TAJUK': 'TITLE', 'TAJUK KECIL': 'SUBTITLE', 'SOALAN CEPAT': 'QUICK QUESTION', 'JAWAPAN (keluar bila tekan ▶)': 'ANSWER (appears when you press ▶)', 'TEKS BUTANG (pilihan)': 'BUTTON TEXT (optional)', 'TAJUK (pilihan)': 'TITLE (optional)',
  'ISI (satu baris satu poin)': 'CONTENT (one point per line)', 'LINK (YouTube atau laman web)': 'LINK (YouTube or website)', 'GAMBAR': 'IMAGE', 'Pilih gambar': 'Choose image', 'Tukar gambar': 'Change image',
  'Ditambah ke pelan': 'Added to plan', 'Gambar tidak dapat dibaca': 'Image could not be read', 'Nama pelan baharu': 'New plan name', 'Nama pelan': 'Plan name', 'Latihan dikemas kini': 'Practice updated', 'Video YouTube akan dimainkan dalam slaid (perlu internet)': 'YouTube videos play inside the slide (internet needed)',
  'Laman web dibuka dalam tab baharu': 'Websites open in a new tab', 'Slaid dikemas kini': 'Slide updated', 'Tamat pelan pengajaran': 'End of teaching plan', 'Semua langkah dipaparkan': 'All steps shown', 'Item terakhir': 'Last item', 'Link tidak dapat dicipta': 'Link could not be created', 'Link disalin': 'Link copied',
  'Pelan mengajar': 'Teaching plan', 'Rancangan Pengajaran Harian': 'Daily Lesson Plan', 'Jawapan': 'Answer', 'Jawapan:': 'Answer:', 'Tidak dapat': 'Unable to', 'Guru merumus isi penting pelajaran': 'The teacher summarises the key points of the lesson', 'slaid nota': 'note slides', 'Mata pelajaran': 'Subject', 'Matematik': 'Mathematics', 'Tingkatan / Kelas': 'Form / Class', 'Tarikh / Masa': 'Date / Time',
  'Bilangan murid': 'Number of students', 'Bab / Tajuk': 'Chapter / Title', 'Standard Kandungan': 'Content Standard', 'Objektif': 'Objectives', 'Aktiviti': 'Activities', 'BBM': 'Teaching Aids', 'Refleksi': 'Reflection', 'RPH disimpan': 'Lesson plan saved',
  'Buang semua perubahan dan jana semula RPH dari pelan ini?': 'Discard all changes and regenerate the lesson plan from this plan?', 'RPH dijana semula': 'Lesson plan regenerated', 'RPH disalin. Tampal ke Word atau e-RPH': 'Lesson plan copied. Paste into Word or e-RPH',
  'Naikkan item': 'Move item up', 'Turunkan item': 'Move item down', 'Buang item': 'Remove item', 'Pilih pelan': 'Choose plan', 'Namakan semula pelan': 'Rename plan', 'Padam pelan ini': 'Delete this plan', 'Bahan': 'Materials', 'Pelan pengajaran': 'Teaching plan', 'Pratonton': 'Preview',
  'Pilih soalan latihan': 'Choose practice questions', 'Format': 'Format', 'Tebal': 'Bold', 'Templat': 'Templates', 'Item': 'Item', 'Pen conteng': 'Annotation pen', 'Pen': 'Pen', 'Penyerlah': 'Highlighter', 'Pemadam': 'Eraser', 'Padam semua conteng': 'Clear all annotations',
  'Kawalan tayangan': 'Presentation controls', 'Kongsi link pelan': 'Share plan link', 'Siap sedia': 'Get ready', 'Tindakan ini tidak boleh dibatalkan': 'This cannot be undone', 'Padam pelan': 'Delete plan', 'slaid ditambah': 'slides added', 'Langkah': 'Step',
  'Murid meneroka Simulasi': 'Students explore the simulation', 'dan menerangkan dapatan mereka': 'and explain their findings', 'Murid menjawab Latihan': 'Students answer the practice', 'Murid bermain game': 'Students play the game', 'Guru menerangkan': 'The teacher explains',
  'Murid menjawab soalan cepat': 'Students answer a quick question', 'Murid memerhati gambar': 'Students observe the image', 'dan berbincang': 'and discuss', 'Guru dan murid menyelesaikan contoh di papan': 'The teacher and students solve examples on the board', 'Murid menonton video': 'Students watch a video',
  'Murid meneroka laman': 'Students explore the website', 'Guru menayangkan slaid': 'The teacher presents slides', 'dan bersoal jawab dengan murid': 'and holds a Q&A with students', 'menggunakan slaid nota': 'using note slides', 'Pada akhir PdP, murid dapat': 'By the end of the lesson, students will be able to',
  'LCD / telefon pintar': 'LCD / smartphone', 'Jana RPH': 'Generate Lesson Plan', 'Jana semula': 'Regenerate', 'Salin': 'Copy', 'Cetak': 'Print', 'Ubah': 'Edit', 'Siap': 'Done', 'Taip terus dalam kotak bergaris ungu. Tekan': 'Type directly in the purple-outlined boxes. Press', 'untuk simpan': 'to save',
  'Jawapan dan jalan kerja': 'Answer and working', 'Jawapan sahaja': 'Answer only', 'ditunjuk apabila tekan ▶': 'shown when you press ▶', 'dipaparkan skrin penuh. Guna tetikus untuk gerakkan objek, kemudian tekan ▶ untuk item seterusnya': 'is shown full screen. Use the mouse to move objects, then press ▶ for the next item',
  'Pilih soalan tetap daripada bank': 'Choose fixed questions from the bank', 'soalan. Soalan keluar ikut susunan anda': 'questions. Questions appear in your order', 'Seterusnya:': 'Next:', 'Saiz': 'Size', 'Warna': 'Colour', 'Tukar mod': 'Change mode',
  // kuiz online
  'Kuiz Online': 'Online Quiz', 'KUIZ ONLINE': 'ONLINE QUIZ', 'Kuiz': 'Quiz', 'Bina kuiz, hantar link kepada murid. Murid jawab sehingga lulus dan hantar Kad Siap kepada guru': 'Build a quiz and send the link to students. Students answer until they pass and send a Completion Card to the teacher',
  'TAJUK KUIZ': 'QUIZ TITLE', 'Markah lulus': 'Pass mark', 'TAMBAH SOALAN': 'ADD QUESTION', 'Tambah soalan': 'Add question', 'Jana link kuiz': 'Generate quiz link', 'Imbas kod QR dengan kamera telefon untuk masuk kuiz': 'Scan the QR code with a phone camera to enter the quiz', 'Simpan QR': 'Save QR',
  'Tunjuk QR besar': 'Show large QR', 'Link kuiz tidak sah': 'Invalid quiz link', 'Minta guru menghantar semula link kuiz': 'Ask your teacher to send the quiz link again', 'Lulus': 'Pass', 'Boleh cuba berulang kali sehingga lulus': 'You can try again until you pass', 'NAMA': 'NAME', 'KELAS': 'CLASS',
  'Cubaan': 'Attempt', 'Belum lulus. Perlu': 'Not passed yet. Need', 'Soalan yang salah': 'Wrong questions', 'Sikit lagi! Semak soalan yang salah dan cuba sekali lagi': 'Almost there! Check the wrong questions and try again', 'Cuba lagi': 'Try again', 'cubaan': 'attempt',
  'KAD SIAP': 'COMPLETION CARD', 'LULUS pada cubaan ke-': 'PASSED on attempt ', 'Screenshot kad ini dan hantar kepada guru': 'Take a screenshot of this card and send it to your teacher', 'Soalan ditukar': 'Question changed', 'Soalan ditambah': 'Question added', 'Pilih dan salin link': 'Select and copy the link',
  'Kod QR tidak dapat dimuat': 'QR code could not be loaded', 'Link terlalu panjang untuk kod QR': 'Link is too long for a QR code', 'Imbas untuk masuk kuiz': 'Scan to enter the quiz', 'Kod QR disimpan': 'QR code saved', 'Kod QR kuiz': 'Quiz QR code', 'Isi nama dan kelas dahulu': 'Fill in your name and class first',
  'Tukar soalan': 'Change question', 'Belum ada soalan. Tambah di bawah': 'No questions yet. Add some below', 'Mula kuiz': 'Start quiz', 'Hantar': 'Submit', 'Kod semakan': 'Check code', 'Semak kod': 'Check code', 'Kod': 'Code', 'lulus': 'pass',
  // halaman utama
  'Teroka. Faham. Kuasai.': 'Explore. Understand. Master.', 'Pilih tingkatan, kemudian pilih bab': 'Choose a form, then choose a chapter', 'Cara Pasang TerokaMath': 'How to Install TerokaMath', 'Cara pasang di telefon': 'How to install on a phone',
  'Pasang sekali sahaja. Semua bab boleh dibuka dari dalam TerokaMath, termasuk tanpa internet': 'Install once only. Every chapter can be opened inside TerokaMath, even without internet', 'Buka': 'Open', 'dalam Chrome': 'in Chrome', 'Tekan menu': 'Tap the menu', 'di atas kanan': 'at the top right',
  'Tambah ke skrin utama': 'Add to Home screen', 'Pasang aplikasi': 'Install app', 'Tekan': 'Press', 'Pasang': 'Install', 'atau': 'or', 'dalam Safari': 'in Safari', 'Tekan butang': 'Tap the', 'Kongsi': 'Share', '(petak dengan anak panah ke atas)': '(the square with an arrow pointing up)',
  'Komputer (Chrome / Edge)': 'Computer (Chrome / Edge)', 'Tekan ikon': 'Click the icon', 'di hujung bar alamat': 'at the end of the address bar', 'Selepas dibuka sekali dengan internet, semua bab dimuat turun dan boleh digunakan tanpa internet': 'After opening once with internet, all chapters are downloaded and work without internet',
  'akan datang. Nantikan!': 'coming soon. Stay tuned!', 'Laman utama': 'Home', 'TINGKATAN': 'FORM', 'BAB': 'CHAPTER', 'Pilih bab dahulu': 'Choose a chapter first', 'TerokaMath – himpunan simulasi Matematik Tingkatan 1 hingga 5': 'TerokaMath – Mathematics simulations for Forms 1 to 5',
  // game (Phaser)
  'Pusingkan telefon': 'Rotate your phone', 'Game ini dimain dalam keadaan mendatar': 'This game is played in landscape', 'Nyawa': 'Lives', 'Jeda': 'Pause', 'soalan sepanjang permainan': 'questions during the game', 'Sambung': 'Resume', 'Main semula': 'Play again', 'Tamat!': 'Game over!',
  'Tukar game': 'Change game', 'Tukar bab': 'Change chapter', 'Maaf': 'Sorry', 'Bab ini belum ada soalan yang sesuai untuk game': 'This chapter has no suitable questions for games yet', 'Soalan datang!': 'Question incoming!', 'Bab atau game tidak dijumpai': 'Chapter or game not found',
  'Gagal memuatkan game. Semak sambungan internet dan cuba lagi': 'Could not load the game. Check your internet connection and try again', 'Bab ini belum ada soalan untuk game': 'This chapter has no questions for games yet',
  'Lari Pecut': 'Sprint Run', 'JALAN KAMPUNG': 'VILLAGE ROAD', 'Lari, kutip syiling dan elak halangan. Bila soalan muncul, masuk lorong jawapan betul': 'Run, collect coins and avoid obstacles. When a question appears, enter the lane with the correct answer',
  'Tembak Angkasa': 'Space Shooter', 'LANGIT KL': 'KL SKY', 'Tembak meteor untuk markah. Bila soalan muncul, tembak asteroid jawapan betul': 'Shoot meteors for points. When a question appears, shoot the asteroid with the correct answer',
  'Sampan Laju': 'Speed Boat', 'SUNGAI & BAKAU': 'RIVER & MANGROVES', 'Kayuh, elak buaya, ambil pelampung jawapan': 'Paddle, avoid crocodiles, grab the answer buoy', 'Wau Terbang': 'Flying Kite', 'PANTAI TIMUR': 'EAST COAST', 'Terbangkan wau melalui cincin jawapan': 'Fly the kite through the answer ring',
  'Kejar Kancil': 'Chase the Mousedeer', 'HUTAN HUJAN': 'RAINFOREST', 'Lompat dahan dan kejar jawapan': 'Jump branches and chase the answer', 'Bola Sepak': 'Football', 'PADANG SEKOLAH': 'SCHOOL FIELD', 'Tendang bola ke gol jawapan': 'Kick the ball into the answer goal',
  'tukar lorong': 'change lane', 'Ruang': 'Space', 'lompat': 'jump', 'jeda': 'pause', 'LOMPAT': 'JUMP', 'Lompat': 'Jump', 'Kutip syiling, elak kotak dan tong!': 'Collect coins, avoid boxes and barrels!', 'Lorong atas': 'Upper lane', 'Lorong bawah': 'Lower lane',
  'gerak roket': 'move rocket', 'tembak': 'shoot', 'TEMBAK': 'SHOOT', 'Tembak': 'Shoot', 'Tembak meteor, jangan sampai roket dilanggar!': "Shoot the meteors, don't let them hit the rocket!", 'Ke kiri': 'Left', 'Ke kanan': 'Right',
  // tambahan (semakan EN)
  'item': 'items', 'Contoh': 'Example', 'Cuba di TEROKA': 'Try in EXPLORE', 'Roda dengan': 'Wheel with', 'Akan datang': 'Coming soon', 'Dijana daripada pelan': 'Generated from the plan', 'Main': 'Play',
  'Perkembangan': 'Development', 'Siapa betul? Klik kumpulan': 'Who got it right? Click a team', 'mudah': 'easy', 'sederhana': 'medium', 'sukar': 'hard', 'dan menyemak jalan kerja': 'and check the working', 'dan': 'and',
  'TerokaMath': 'TerokaMath', 'latihan': 'practice', 'telefon pintar': 'smartphone', 'video YouTube': 'YouTube video', 'laman web': 'website', 'untuk edit': 'to edit', 'Klik': 'Click', 'Tekan Tayang': 'Press Present',
  'Tunggu jawapan': 'Waiting for answer', 'Klik jika betul': 'Click if correct', 'PAPAN MARKAH': 'SCOREBOARD', 'Papan markah': 'Scoreboard', 'bonus': 'bonus',
  'Kira Pantas': 'Quick Maths', 'Kira Pantas: tambah, tolak, darab dan bahagi': 'Quick Maths: addition, subtraction, multiplication and division', 'Tambah, tolak, darab dan bahagi': 'Addition, subtraction, multiplication and division',
  'soalan tambah, tolak, darab dan bahagi. Makin lama makin susah. Terus pilih game': 'addition, subtraction, multiplication and division questions. It gets harder as you play. Choose a game',
  'Soalan asas tambah, tolak, darab dan bahagi': 'Basic addition, subtraction, multiplication and division questions',
  'Panjat Kelapa': 'Coconut Climb', 'KAMPUNG PANTAI': 'SEASIDE VILLAGE', 'Panjat pokok kelapa. Pilih dahan jawapan betul untuk terus naik': 'Climb the coconut tree. Pick the branch with the correct answer to keep climbing',
  'Roket Sains': 'Science Rocket', 'PELANCARAN LANGKAWI': 'LANGKAWI LAUNCH', 'Isi bahan api dengan jawapan betul. Makin betul, makin tinggi roket terbang': 'Fuel up with correct answers. The more you get right, the higher the rocket flies',
  'Gasing Juara': 'Spinning Top Champion', 'GELANGGANG KELANTAN': 'KELANTAN ARENA', 'Jawapan betul beri gasing pusingan tambahan. Siapa paling lama?': 'Correct answers give the top extra spin. Who lasts the longest?',
  'Kereta Api Jawapan': 'Answer Train', 'LANDASAN KTM': 'KTM RAILWAY', 'Tukar landasan ke stesen yang ada jawapan betul': 'Switch tracks to the station with the correct answer',
  'Penyu Pulang': 'Turtle Homecoming', 'PANTAI TERENGGANU': 'TERENGGANU BEACH', 'Bawa anak penyu ke laut melalui laluan jawapan betul': 'Guide the baby turtle to the sea along the correct-answer path',
  'Pasar Malam': 'Night Market', 'GERAI MALAM': 'NIGHT STALLS', 'Layan pelanggan dengan menyerahkan barang berlabel jawapan betul': 'Serve customers by handing over the item labelled with the correct answer',
  // nama bab (halaman utama & kepala bab)
  'Nombor Nyata': 'Real Numbers', 'Faktor & Gandaan': 'Factors & Multiples', 'Nisbah, Kadar & Perkadaran': 'Ratios, Rates & Proportions', 'Ungkapan Algebra': 'Algebraic Expressions', 'Persamaan & Ketaksamaan Linear': 'Linear Equations & Inequalities',
  'Garis & Sudut': 'Lines & Angles', 'Segi Tiga & Sisi Empat': 'Triangles & Quadrilaterals', 'Pengendalian Data': 'Data Handling', 'Pola & Jujukan': 'Patterns & Sequences', 'Pola dan Jujukan': 'Patterns and Sequences', 'Pemfaktoran & Pecahan Algebra': 'Factorisation & Algebraic Fractions',
  'Rumus Algebra': 'Algebraic Formulae', 'Poligon': 'Polygons', 'Bulatan': 'Circles', 'Bentuk Geometri 3D': 'Three-Dimensional Geometrical Shapes', 'Bentuk Geometri Tiga Dimensi': 'Three-Dimensional Geometrical Shapes', 'Koordinat': 'Coordinates', 'Graf Fungsi': 'Graphs of Functions',
  'Laju & Pecutan': 'Speed & Acceleration', 'Laju dan Pecutan': 'Speed and Acceleration', 'Kecerunan Garis Lurus': 'Gradient of a Straight Line', 'Transformasi Isometri': 'Isometric Transformations', 'Kecenderungan Memusat': 'Measures of Central Tendencies',
  'Sukatan Kecenderungan Memusat': 'Measures of Central Tendencies', 'Kebarangkalian Mudah': 'Simple Probability', 'Indeks': 'Indices', 'Bentuk Piawai': 'Standard Form', 'Simpanan & Pelaburan, Kredit & Hutang': 'Savings & Investments, Credit & Debt',
  'Matematik Pengguna: Simpanan dan Pelaburan, Kredit dan Hutang': 'Consumer Mathematics: Savings and Investments, Credit and Debt', 'Lukisan Berskala': 'Scale Drawings', 'Nisbah Trigonometri': 'Trigonometric Ratios', 'Sudut & Tangen bagi Bulatan': 'Angles & Tangents of Circles',
  'Sudut dan Tangen bagi Bulatan': 'Angles and Tangents of Circles', 'Pelan & Dongakan': 'Plans & Elevations', 'Pelan dan Dongakan': 'Plans and Elevations', 'Lokus dalam Dua Dimensi': 'Loci in Two Dimensions', 'Garis Lurus': 'Straight Lines', 'Fungsi & Persamaan Kuadratik': 'Quadratic Functions & Equations',
  'Fungsi dan Persamaan Kuadratik dalam Satu Pemboleh Ubah': 'Quadratic Functions and Equations in One Variable', 'Asas Nombor': 'Number Bases', 'Penaakulan Logik': 'Logical Reasoning', 'Operasi Set': 'Operations on Sets', 'Rangkaian dalam Teori Graf': 'Network in Graph Theory',
  'Ketaksamaan Linear dalam Dua Pemboleh Ubah': 'Linear Inequalities in Two Variables', 'Graf Gerakan': 'Graphs of Motion', 'Sukatan Serakan Data Tak Terkumpul': 'Measures of Dispersion for Ungrouped Data', 'Kebarangkalian Peristiwa Bergabung': 'Probability of Combined Events',
  'Pengurusan Kewangan': 'Consumer Mathematics: Financial Management', 'Ubahan': 'Variation', 'Insurans': 'Insurance', 'Percukaian': 'Taxation', 'Kekongruenan, Pembesaran & Gabungan Transformasi': 'Congruency, Enlargement & Combined Transformations',
  'Kekongruenan, Pembesaran dan Gabungan Transformasi': 'Congruency, Enlargement and Combined Transformations', 'Nisbah & Graf Fungsi Trigonometri': 'Ratios & Graphs of Trigonometric Functions', 'Nisbah dan Graf Fungsi Trigonometri': 'Ratios and Graphs of Trigonometric Functions',
  'Sukatan Serakan Data Terkumpul': 'Measures of Dispersion for Grouped Data', 'Pemodelan Matematik': 'Mathematical Modeling', 'Matematik Pengguna: Insurans': 'Consumer Mathematics: Insurance', 'Matematik Pengguna: Percukaian': 'Consumer Mathematics: Taxation',
  'Matematik Pengguna: Pengurusan Kewangan': 'Consumer Mathematics: Financial Management', 'Pola dan Jujukan ': 'Patterns and Sequences'
};

/* ---------- enjin terjemahan ---------- */
(() => {
  if (!tmEN) return;
  Object.keys(TMX).forEach(k => { const u = k.toUpperCase(); if (u !== k && !(u in TMX)) TMX[u] = TMX[k].toUpperCase(); });
  const keys = Object.keys(TMX).sort((a, b) => b.length - a.length).map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const RE = new RegExp(`(?<![\\p{L}\\p{N}])(?:${keys.join('|')})(?![\\p{L}])`, 'gu');
  const seg = s => {                       // terjemah satu segmen: mesti tiada huruf tertinggal
    if (!/\p{L}/u.test(s)) return s;
    let left = '';
    const out = s.replace(RE, m => { return TMX[m] != null ? TMX[m] : m; });
    left = s.replace(RE, '');
    return /\p{L}/u.test(left) ? s : out;
  };
  const tr = s => String(s).split(/( · |: )/).map((p, i) => i % 2 ? p : seg(p)).join('');
  window.tmTr = tr;
  const SKIP = '#qtx,#qfig,.stage,.slide,.kzfig,.wsqt,.wsfig,.ka,.kw,.qtext,.qfig,.gfig,.gopts,.gfb span,.kq,.work,.ansbox b,.wqt,.wqf,.ajql,.kzrow small,.kzq,.kzopts,.subcard p,.subcard h2,.topicl small,.rpick b,button.nm,.ajli span,.tm,.brand b,.kzhd b,textarea,script,style,[contenteditable="true"],[data-asal]';
  const okEl = el => el && !(el.closest && (el.closest(SKIP) || (el.closest('svg') && !el.closest('.rwheel'))));
  const ATTR = ['aria-label', 'placeholder', 'title', 'alt'];
  const doNode = n => {
    if (n.nodeType === 3) { if (okEl(n.parentElement)) { const t = tr(n.nodeValue); if (t !== n.nodeValue) n.nodeValue = t; } return; }
    if (n.nodeType !== 1 || !okEl(n)) return;
    ATTR.forEach(a => { const v = n.getAttribute && n.getAttribute(a); if (v) { const t = tr(v); if (t !== v) n.setAttribute(a, t); } });
    if (n.tagName === 'INPUT' && /^(button|submit)$/.test(n.type) && n.value) n.value = tr(n.value);
    const w = document.createTreeWalker(n, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
    let c; while ((c = w.nextNode())) {
      if (c.nodeType === 3) { if (okEl(c.parentElement)) { const t = tr(c.nodeValue); if (t !== c.nodeValue) c.nodeValue = t; } }
      else if (okEl(c)) ATTR.forEach(a => { const v = c.getAttribute(a); if (v) { const t = tr(v); if (t !== v) c.setAttribute(a, t); } });
    }
  };
  const go = () => {
    document.documentElement.lang = 'en';
    if (document.title) document.title = tr(document.title);
    doNode(document.body);
    new MutationObserver(ms => ms.forEach(m => {
      if (m.type === 'characterData') doNode(m.target);
      else m.addedNodes.forEach(doNode);
      if (m.type === 'attributes') doNode(m.target);
    })).observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTR });
  };
  if (document.body) go(); else document.addEventListener('DOMContentLoaded', go);
  // dialog pelayar
  const wrap = f => function (m, ...r) { return f.call(window, m == null ? m : tr(m), ...r.map(x => typeof x === 'string' ? tr(x) : x)); };
  window.confirm = wrap(window.confirm); window.alert = wrap(window.alert); window.prompt = wrap(window.prompt);
  // teks dalam kanvas game (Phaser)
  const patchPhaser = () => {
    const P = window.Phaser; if (!P || !P.GameObjects || P.__tm) return; P.__tm = 1;
    const F = P.GameObjects.GameObjectFactory.prototype, T = P.GameObjects.Text.prototype;
    const ot = F.text; F.text = function (x, y, t, st) { return ot.call(this, x, y, Array.isArray(t) ? t.map(tr) : (t == null ? t : tr(t)), st); };
    const os = T.setText; T.setText = function (v) { return os.call(this, Array.isArray(v) ? v.map(tr) : (v == null ? v : tr(String(v)))); };
  };
  window.tmPatchPhaser = patchPhaser; patchPhaser();
})();
