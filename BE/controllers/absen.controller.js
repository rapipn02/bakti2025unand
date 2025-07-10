// File: controllers/absen.controller.js

const fs = require("fs") // Sudah ada
const path = require("path") // Sudah ada
const { v4: uuidv4 } = require("uuid"); // Sudah ada, mungkin tidak dipakai di fungsi baru
const prisma = require("../prisma"); // Sudah ada

exports.GetAbsen = async (req, res) => {
    // ... (kode Anda yang sudah ada)
    try {

        const data = await prisma.absen.findMany({
            orderBy: {
                tanggal: "asc"
            },
            include: {
                absensi: true
            }
        })
        const sendData = data.map((item) => {
            let sakit = 0;
            let alfa = 0;
            let hadir = 0;
            let izin = 0;
            item.absensi.forEach((item2) => {
                if (item2.keterangan === "Hadir") { // Perhatikan: ini string, enum di skema pakai Keterangan.Hadir
                    hadir = hadir + 1;
                } else if (item2.keterangan === "Sakit") {
                    sakit = sakit + 1;
                } else if (item2.keterangan === "Alfa") {
                    alfa = alfa + 1;
                } else if (item2.keterangan === "Izin") {
                    izin = izin + 1;
                }
            })
            return {
                ...item,
                sakit,
                alfa,
                hadir,
                izin
            }
        })

        if (data) { // Sebaiknya if (sendData) atau cek panjang data
            return res.status(200).json({
                status: 200,
                message: "Berhasil mengambil List Absen", // Diubah dari "menambahkan"
                data: sendData
            })
        } else { // Kondisi ini mungkin tidak akan pernah tercapai jika findMany mengembalikan array kosong
            return res.status(404).json({ // Status 404 jika tidak ada data
                status: 404,
                message: "List Absen tidak ditemukan",
            })
        }

    } catch (error) {
        console.log("Absen Controller Error (GetAbsen):", error);
        return res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            error: error.message // Kirim error.message untuk info lebih jelas
        })
    }
}
exports.AddAbsen = async (req, res) => {
    // ... (kode Anda yang sudah ada)
    try {
        const { title, tanggal } = req.body;

        // Validasi input
        if (!title || !tanggal) {
            return res.status(400).json({
                status: 400,
                message: "Title dan tanggal diperlukan"
            })
        }

        const data = await prisma.absen.create({
            data: {
                title,
                tanggal: new Date(tanggal) // Pastikan tanggal adalah objek Date
            }
        })

        // 'data' akan selalu ada jika create berhasil, error akan ditangkap di catch
        return res.status(201).json({ // Status 201 untuk create
            status: 201,
            message: "Berhasil menambahkan List Absen",
            data
        })
    } catch (error) {
        console.log("Absen Controller Error (AddAbsen):", error);
        return res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            error: error.message
        })
    }
}
exports.DeleteAbsen = async (req, res) => {
    // ... (kode Anda yang sudah ada)
    try {
        const id = req.query.id;
        if (!id) {
            return res.status(400).json({ status: 400, message: "ID List Absen diperlukan" });
        }

        const data = await prisma.absen.delete({
            where: {
                id
            }
        })
        
        // 'data' akan ada jika delete berhasil
        return res.status(200).json({
            status: 200,
            message: "Berhasil delete List Absen",
            data
        })
    } catch (error) {
        // Tangani error jika record tidak ditemukan (Prisma akan throw error)
        if (error.code === 'P2025') { // Kode error Prisma untuk record not found
             return res.status(404).json({
                status: 404,
                message: "Gagal delete List Absen: Record tidak ditemukan",
            });
        }
        console.log("Absen Controller Error (DeleteAbsen):", error);
        return res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            error: error.message
        })
    }
}
exports.EditAbsen = async (req, res) => {
    // ... (kode Anda yang sudah ada)
    try {
        const { id, title, tanggal } = req.body;
        // console.log(req.body) // Sebaiknya dihapus di produksi

        if (!id) {
            return res.status(400).json({ status: 400, message: "ID List Absen diperlukan" });
        }
        if (!title && !tanggal) {
            return res.status(400).json({ status: 400, message: "Minimal satu field (title atau tanggal) diperlukan untuk edit" });
        }
        
        const updateData = {};
        if (title) updateData.title = title;
        if (tanggal) updateData.tanggal = new Date(tanggal);


        const data = await prisma.absen.update({
            where: { id },
            data: updateData
        })
        
        return res.status(200).json({
            status: 200,
            message: "Succesfully Edit List Absen",
            data
        })
    } catch (error) {
        if (error.code === 'P2025') {
             return res.status(404).json({
                status: 404,
                message: "Failed Edit List Absen: Record tidak ditemukan"
            });
        }
        console.log("Error in Edit List Absen:", error)
        return res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            error: error.message
        })
    }
}
exports.AddAbsensi = async (req, res) => {
    // ... (kode Anda yang sudah ada)
    try {
        const { id_absen, id_anggota_kelompok, keterangan, alasan } = req.body;

        if (!id_absen || !id_anggota_kelompok || !keterangan) {
            return res.status(400).json({
                status: 400,
                message: "id_absen, id_anggota_kelompok, dan keterangan diperlukan"
            });
        }

        // Validasi enum Keterangan
        const enumKeteranganValues = ["Hadir", "Sakit", "Izin", "Alfa"]; // Sesuaikan dengan enum Keterangan Anda jika berbeda
        if (!enumKeteranganValues.includes(keterangan)) {
             return res.status(400).json({
                status: 400,
                message: `Nilai keterangan tidak valid. Harus salah satu dari: ${enumKeteranganValues.join(", ")}`
            });
        }


        const check = await prisma.absensi.findFirst({
            where: {
                id_absen,
                id_anggota_kelompok
            }
        })
        if (check) {
            return res.status(409).json({ // Status 409 untuk conflict
                status: 409,
                message: "Mahasiswa sudah melakukan absensi untuk sesi ini."
            })
        }
        const data = await prisma.absensi.create({
            data: {
                id_absen,
                id_anggota_kelompok,
                keterangan, // Ini akan menjadi nilai enum Keterangan
                alasan: alasan || null, // Pastikan alasan bisa null
                metode: 'MANUAL' // Default metode jika ditambahkan melalui endpoint ini
            }
        })

        return res.status(201).json({ // Status 201 untuk create
            status: 201,
            message: "Berhasil menambahkan data absensi",
            data
        })

    } catch (error) {
        console.log("Absen Controller Error (AddAbsensi):", error);
        return res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            error: error.message
        })
    }
}
exports.EditAbsensiToNull = async (req, res) => { // Nama fungsi ini mungkin lebih baik EditAbsensi atau DeleteAbsensi
    // ... (kode Anda yang sudah ada)
    // Fungsi ini saat ini menghapus record absensi. Jika itu tujuannya, namanya bisa DeleteAbsensi.
    // Jika tujuannya untuk mengubah field menjadi null, maka logic-nya harus update, bukan delete.
    // Saya asumsikan ini untuk delete berdasarkan logic Anda.
    try {
        const { id } = req.body; // Biasanya ID diambil dari req.params atau req.query untuk DELETE

        if (!id) {
             return res.status(400).json({ status: 400, message: "ID Absensi diperlukan" });
        }

        // Jika id_absen juga bagian dari composite key di database, Anda mungkin perlu:
        // const { id, id_absen } = req.body;
        // where: { id_id_absen: { id, id_absen } } // jika Anda punya composite key di schema.prisma

        const data = await prisma.absensi.delete({
            where: { id } // Asumsi 'id' adalah primary key unik di tabel Absensi
        })
        
        return res.status(200).json({
            status: 200,
            message: "Successfully Deleted Absensi", // Diubah pesannya
            data
        })
    } catch (error) {
        if (error.code === 'P2025') {
             return res.status(404).json({
                status: 404,
                message: "Failed to Delete Absensi: Record tidak ditemukan"
            });
        }
        console.log("Error in Delete Absensi:", error) // Diubah nama error lognya
        return res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            error: error.message
        })
    }
}

// --- FUNGSI BARU UNTUK ADMIN SCAN QR PESERTA ---
exports.AdminScanParticipantQR = async (req, res) => {
    try {
        const { participantIdentifier, absenId, id_kelompok } = req.body;
        const adminUserId = req.user.id; // req.user dari middleware.authentication
        const adminName = req.user.name || `Admin User (${adminUserId.substring(0, 6)})`;

        if (!participantIdentifier || !absenId || !id_kelompok) {
            return res.status(400).json({
                status: 400,
                message: "participantIdentifier (dari QR), absenId (sesi absen), dan id_kelompok diperlukan."
            });
        }

        const absenSession = await prisma.absen.findUnique({
            where: { id: absenId }
        });
        if (!absenSession) {
            return res.status(404).json({
                status: 404,
                message: `Sesi absen dengan ID '${absenId}' tidak ditemukan.`
            });
        }

        const kelompokExist = await prisma.kelompok.findUnique({
            where: {id: id_kelompok}
        });
        if (!kelompokExist) {
            return res.status(404).json({
                status: 404,
                message: `Kelompok dengan ID '${id_kelompok}' tidak ditemukan.`
            });
        }

        let anggotaKelompok;
        // Cek apakah participantIdentifier adalah UUID (panjang 36 dengan '-')
        if (participantIdentifier.length === 36 && participantIdentifier.includes('-')) {
             anggotaKelompok = await prisma.anggota_Kelompok.findUnique({
                where: { id: participantIdentifier }
            });
        }
        // Jika tidak ketemu dengan ID atau bukan format UUID, coba dengan NIM
        if (!anggotaKelompok) {
            anggotaKelompok = await prisma.anggota_Kelompok.findUnique({
                where: { nim: participantIdentifier } // Pastikan 'nim' unik di skema Anda
            });
        }
        if (!anggotaKelompok) {
            return res.status(404).json({
                status: 404,
                message: `Peserta dengan identifier '${participantIdentifier}' tidak ditemukan.`
            });
        }

        if (anggotaKelompok.id_kelompok !== id_kelompok) {
            return res.status(400).json({
                status: 400,
                message: `Peserta ${anggotaKelompok.nama} (NIM: ${anggotaKelompok.nim}) bukan anggota dari kelompok ${kelompokExist.nomor} (ID: ${id_kelompok}). Peserta terdaftar di kelompok ID '${anggotaKelompok.id_kelompok}'.`
            });
        }

        const existingAbsensi = await prisma.absensi.findFirst({
            where: {
                id_absen: absenId,
                id_anggota_kelompok: anggotaKelompok.id,
            },
        });

        // Jika sudah hadir, kirim respons bahwa sudah hadir
        if (existingAbsensi && existingAbsensi.keterangan === "Hadir") { // Ganti "Hadir" dengan Keterangan.Hadir jika Anda menggunakan tipe enum di controller
            return res.status(409).json({
                status: 409,
                message: `${anggotaKelompok.nama} (NIM: ${anggotaKelompok.nim}) sudah tercatat HADIR untuk sesi '${absenSession.title}' di kelompok ${kelompokExist.nomor}. Tidak ada perubahan data.`,
                data: existingAbsensi
            });
        }

        const dataUntukAbsensi = {
            keterangan: "Hadir", // Ganti dengan Keterangan.Hadir jika menggunakan enum
            metode: "QR_SCAN_BY_ADMIN", // Ini adalah nilai dari enum AbsenMetode
            alasan: ` dicatat oleh ${adminName} melalui scan QR.`,
        };

        let absensiRecord;
        if (existingAbsensi) { // Jika ada record sebelumnya (misal Alfa, Izin, Sakit), update menjadi Hadir
            absensiRecord = await prisma.absensi.update({
                where: { id: existingAbsensi.id },
                data: dataUntukAbsensi, // createAt tidak diubah, updateAt akan otomatis
            });
            return res.status(200).json({
                status: 200,
                message: `Status absensi untuk ${anggotaKelompok.nama} (NIM: ${anggotaKelompok.nim}) pada sesi '${absenSession.title}' di kelompok ${kelompokExist.nomor} telah diperbarui menjadi HADIR oleh ${adminName}.`,
                data: absensiRecord,
            });
        } else { // Jika belum ada record sama sekali, buat baru
            absensiRecord = await prisma.absensi.create({
                data: {
                    id_absen: absenId,
                    id_anggota_kelompok: anggotaKelompok.id,
                    ...dataUntukAbsensi, // createAt akan otomatis terisi
                },
            });
            return res.status(201).json({
                status: 201,
                message: `Kehadiran untuk ${anggotaKelompok.nama} (NIM: ${anggotaKelompok.nim}) di kelompok ${kelompokExist.nomor} berhasil dicatat sebagai HADIR oleh ${adminName} untuk sesi '${absenSession.title}'.`,
                data: absensiRecord,
            });
        }
    } catch (error) {
        console.error("Error pada AdminScanParticipantQR:", error);
        return res.status(500).json({
            status: 500,
            message: "Terjadi kesalahan pada server.",
            error: error.message
        });
    }
};

// QR Scan for absensi
exports.ScanQRAbsensi = async (req, res) => {
    try {
        const { nim, kelompok, id_absen, metode = 'QR_SCAN_BY_ADMIN' } = req.body;

        // Validasi input
        if (!nim || !id_absen) {
            return res.status(400).json({
                status: 400,
                message: "NIM dan id_absen diperlukan"
            });
        }

        // Cari sesi absen
        const absenSession = await prisma.absen.findUnique({
            where: { id: id_absen }
        });

        if (!absenSession) {
            return res.status(404).json({
                status: 404,
                message: "Sesi absen tidak ditemukan"
            });
        }

        // Cari mahasiswa berdasarkan NIM
        const mahasiswa = await prisma.anggota_Kelompok.findUnique({
            where: { nim: nim },
            include: {
                kelompok: true
            }
        });

        if (!mahasiswa) {
            return res.status(404).json({
                status: 404,
                message: `Mahasiswa dengan NIM ${nim} tidak ditemukan`
            });
        }

        // Validasi kelompok jika disediakan
        if (kelompok && mahasiswa.kelompok.nomor !== parseInt(kelompok)) {
            return res.status(400).json({
                status: 400,
                message: `Mahasiswa ${mahasiswa.nama} terdaftar di kelompok ${mahasiswa.kelompok.nomor}, bukan kelompok ${kelompok}`
            });
        }

        // Cek apakah sudah absen
        const existingAbsensi = await prisma.absensi.findFirst({
            where: {
                id_absen: id_absen,
                id_anggota_kelompok: mahasiswa.id
            }
        });

        if (existingAbsensi) {
            if (existingAbsensi.keterangan === "Hadir") {
                return res.status(409).json({
                    status: 409,
                    message: `${mahasiswa.nama} (NIM: ${nim}) sudah tercatat HADIR`,
                    data: existingAbsensi
                });
            } else {
                // Update status menjadi Hadir
                const updatedAbsensi = await prisma.absensi.update({
                    where: { id: existingAbsensi.id },
                    data: {
                        keterangan: "Hadir",
                        metode: metode,
                        alasan: "Absensi melalui scan QR code"
                    }
                });

                return res.status(200).json({
                    status: 200,
                    message: `Status absensi ${mahasiswa.nama} (NIM: ${nim}) diperbarui menjadi HADIR`,
                    data: updatedAbsensi
                });
            }
        } else {
            // Buat record absensi baru
            const newAbsensi = await prisma.absensi.create({
                data: {
                    id_absen: id_absen,
                    id_anggota_kelompok: mahasiswa.id,
                    keterangan: "Hadir",
                    metode: metode,
                    alasan: "Absensi melalui scan QR code"
                }
            });

            return res.status(201).json({
                status: 201,
                message: `Absensi ${mahasiswa.nama} (NIM: ${nim}) berhasil dicatat sebagai HADIR`,
                data: newAbsensi
            });
        }

    } catch (error) {
        console.error("Scan QR Absensi Error:", error);
        return res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            error: error.message
        });
    }
};

// Update status kehadiran anggota
exports.UpdateStatusKehadiran = async (req, res) => {
    try {
        const { anggota_id, absen_id, status_kehadiran } = req.body;

        // Validasi input
        if (!anggota_id || !absen_id || !status_kehadiran) {
            return res.status(400).json({
                status: 400,
                message: "anggota_id, absen_id, dan status_kehadiran diperlukan"
            });
        }

        // Validasi status_kehadiran
        const validStatuses = ['Hadir', 'Alfa', 'Sakit', 'Izin'];
        if (!validStatuses.includes(status_kehadiran)) {
            return res.status(400).json({
                status: 400,
                message: "Status kehadiran harus salah satu dari: " + validStatuses.join(', ')
            });
        }

        // Cek apakah record absensi sudah ada
        const existingAbsensi = await prisma.absensi.findFirst({
            where: {
                id_anggota_kelompok: anggota_id,
                id_absen: absen_id
            }
        });

        let result;
        if (existingAbsensi) {
            // Update existing record
            result = await prisma.absensi.update({
                where: {
                    id: existingAbsensi.id
                },
                data: {
                    keterangan: status_kehadiran, // Fix: use correct field name
                    metode: status_kehadiran === 'Hadir' ? existingAbsensi.metode || 'MANUAL' : 'MANUAL', // Fix: use correct field name and enum value
                    alasan: `Status diubah menjadi ${status_kehadiran} oleh admin`
                }
            });
        } else {
            // Create new record
            result = await prisma.absensi.create({
                data: {
                    id_anggota_kelompok: anggota_id,
                    id_absen: absen_id,
                    keterangan: status_kehadiran, // Fix: use correct field name
                    metode: 'MANUAL', // Fix: use correct field name and enum value
                    alasan: `Status diset ke ${status_kehadiran} oleh admin`
                }
            });
        }

        return res.status(200).json({
            status: 200,
            message: `Status kehadiran berhasil diubah menjadi ${status_kehadiran}`,
            data: result
        });

    } catch (error) {
        console.log("Absen Controller Error (UpdateStatusKehadiran):", error);
        return res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            error: error.message
        });
    }
};