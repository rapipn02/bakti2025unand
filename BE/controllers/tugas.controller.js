const fs = require("fs")
const path = require("path")
const { v4: uuidv4 } = require("uuid");
const prisma = require("../prisma");

exports.AddTugas = async (req, res) => {
    try {
        const { title, description, deadline } = req.body;

        const data = await prisma.Tugas.create({
            data: {
                title,
                description,
                deadline
            }
        })

        if (data) {
            return res.status(200).json({
                status: 200,
                message: "Berhasil menambahkan tugas",
                data
            })
        } else {
            return res.status(400).json({
                status: 400,
                message: "Gagal menambahkan tugas",
                data
            })
        }

    } catch (error) {
        console.log("Kumpul Tugas Controller Error:", error);
        return res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            error
        })
    }
}
exports.DeleteTugas = async (req, res) => {
    try {
        const id = req.query.id;

        const data = await prisma.Tugas.delete({
            where: {
                id
            }
        })

        if (data) {
            return res.status(200).json({
                status: 200,
                message: "Berhasil delete tugas",
                data
            })
        } else {
            return res.status(400).json({
                status: 400,
                message: "Gagal delete tugas",
            })
        }

    } catch (error) {
        console.log("Kumpul Tugas Controller Error:", error);
        return res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            error
        })
    }
}
exports.EditTugas = async (req, res) => {
    try {
        const { id, title, description, deadline } = req.body;
        console.log(req.body)

        const data = await prisma.Tugas.update({ where: { id }, data: { title, description, deadline: new Date(deadline) } })
        if (data) {
            return res.status(200).json({
                status: 200,
                message: "Succesfully Edit Tugas",
                data
            })
        }
        return res.status(300).json({
            status: 300,
            message: "Failed Edit Tugas"
        })
    } catch (error) {
        console.log("Error in Edit Staff:", error)
        return res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            error
        })
    }
}
exports.GetTugas = async (req, res) => {
    try {

        const data = await prisma.Tugas.findMany({
            include: {
                Kumpul_Tugas: true
            },
            orderBy: {
                deadline: "asc"
            }
        })

        if (data.length > 0) {
            return res.status(200).json({
                status: 200,
                message: "Berhasil mengambil tugas",
                data
            })
        } else {
            return res.status(404).json({
                status: 404,
                message: "Tugas tidak ditemukan",
                data
            })
        }

    } catch (error) {
        console.log("Kumpul Tugas Controller Error:", error);
        return res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            error
        })
    }
}

exports.GetKumpulTugas = async (req, res) => {
    try {
        const page = parseInt(req.query.page)
        const limit = 10;
        const skip = (page - 1) * limit
        if (page) {
            const data = await prisma.Kumpul_Tugas.findMany({
                take: limit,
                skip,
                // orderBy: {
                //     createAt: "desc"
                // },
                orderBy: {
                    nim: "asc"
                },
                include: {
                    user: true,
                    tugas: true
                }
            })
            const totalItems = await prisma.Kumpul_Tugas.count()
            const totalPages = Math.ceil(totalItems / limit)

            if (data) {
                return res.status(200).json({
                    status: 200,
                    message: "Berhasil mengambil kumpul tugas",
                    data,
                    currentPage: page,
                    totalPages
                })
            } else {
                return res.status(400).json({
                    status: 400,
                    message: "Gagal mengambil kumpul tugas",
                })
            }
        }
        const data = await prisma.Kumpul_Tugas.findMany({
            // orderBy: {
            //     createAt: "desc"
            // },
            orderBy: {
                nim: "asc"
            },
            include: {
                user: true,
                tugas: true
            }
        })

        if (data) {
            return res.status(200).json({
                status: 200,
                message: "Berhasil mengambil kumpul tugas",
                data
            })
        } else {
            return res.status(400).json({
                status: 400,
                message: "Gagal mengambil kumpul tugas",
            })
        }

    } catch (error) {
        console.log("Kumpul Tugas Controller Error:", error);
        return res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            error
        })
    }
}
exports.GetKumpulTugasByKelompok = async (req, res) => {
    try {
        const page = parseInt(req.query.page)
        const limit = 10;
        const skip = (page - 1) * limit
        const kelompok = parseInt(req.query.kelompok);
        const tugas = req.query.tugas
        if (page) {
            const data = await prisma.Kumpul_Tugas.findMany({
                take: limit,
                skip,
                where: {
                    kelompok,
                    id_tugas: tugas
                },
                // orderBy: {
                //     createAt: "desc"
                // },
                orderBy: {
                    nim: "asc"
                },
                include: {
                    user: true,
                    tugas: true
                }
            })
            const totalItems = await prisma.Kumpul_Tugas.count({
                where: {
                    kelompok,
                    id_tugas: tugas
                },
            })
            const totalPages = Math.ceil(totalItems / limit)

            if (data) {
                return res.status(200).json({
                    status: 200,
                    message: "Berhasil mengambil kumpul tugas",
                    data,
                    currentPage: page,
                    totalPages
                })
            } else {
                return res.status(400).json({
                    status: 400,
                    message: "Gagal mengambil kumpul tugas",
                })
            }
        }
        const data = await prisma.Kumpul_Tugas.findMany({
            where: {
                kelompok,
                id_tugas: tugas
            },
            // orderBy: {
            //     createAt: "desc"
            // },
            orderBy: {
                nim: "asc"
            },
            include: {
                user: true,
                tugas: true
            }
        })

        if (data) {
            return res.status(200).json({
                status: 200,
                message: "Berhasil mengambil kumpul tugas",
                data
            })
        } else {
            return res.status(400).json({
                status: 400,
                message: "Gagal mengambil kumpul tugas",
            })
        }

    } catch (error) {
        console.log("Kumpul Tugas Controller Error:", error);
        return res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            error
        })
    }
}
exports.SearchGetKumpulTugasByKelompok = async (req, res) => {
    try {
        const page = parseInt(req.query.page)
        const limit = 10;
        const skip = (page - 1) * limit
        const kelompok = parseInt(req.query.kelompok);
        const nama = req.query.nama;
        const nim = req.query.nim

        if (page) {
            let data = []
            let totalItems = 0
            if (nama) {
                data = await prisma.Kumpul_Tugas.findMany({
                    take: limit,
                    skip,
                    where: {
                        kelompok,
                        nama: {
                            contains: nama
                        }
                    },
                    orderBy: {
                        nim: "asc"
                    },
                    include: {
                        user: true,
                        tugas: true
                    }
                })
                totalItems = await prisma.Kumpul_Tugas.count({
                    where: {
                        kelompok,
                        nama: {
                            contains: nama
                        }
                    },
                })
            } else if (nim) {
                data = await prisma.Kumpul_Tugas.findMany({
                    take: limit,
                    skip,
                    where: {
                        kelompok,
                        nim: {
                            contains: nim
                        }
                    },
                    orderBy: {
                        nim: "asc"
                    },
                    include: {
                        user: true,
                        tugas: true
                    }
                })
                totalItems = await prisma.Kumpul_Tugas.count({
                    where: {
                        kelompok,
                        nama: {
                            contains: nama
                        }
                    },
                })
            }
            const totalPages = Math.ceil(totalItems / limit)

            if (data) {
                return res.status(200).json({
                    status: 200,
                    message: "Berhasil mengambil kumpul tugas",
                    data,
                    currentPage: page,
                    totalPages
                })
            } else {
                return res.status(400).json({
                    status: 400,
                    message: "Gagal mengambil kumpul tugas",
                })
            }
        }
        let data = []
        if (nama) {
            data = await prisma.Kumpul_Tugas.findMany({
                where: {
                    kelompok,
                    nama: {
                        contains: nama
                    }
                },
                // orderBy: {
                //     createAt: "desc"
                // },
                orderBy: {
                    nim: "asc"
                },
                include: {
                    user: true,
                    tugas: true
                }
            })
        } else if (nim) {
            data = await prisma.Kumpul_Tugas.findMany({
                where: {
                    kelompok,
                    nim: {
                        contains: nim
                    }
                },
                // orderBy: {
                //     createAt: "desc"
                // },
                orderBy: {
                    nim: "asc"
                },
                include: {
                    user: true,
                    tugas: true
                }
            })
        }

        if (data) {
            return res.status(200).json({
                status: 200,
                message: "Berhasil mengambil kumpul tugas",
                data
            })
        } else {
            return res.status(400).json({
                status: 400,
                message: "Gagal mengambil kumpul tugas",
            })
        }

    } catch (error) {
        console.log("Kumpul Tugas Controller Error:", error);
        return res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            error
        })
    }
}
exports.KumpulTugas = async (req, res) => {
    try {
        const { id_user, id_tugas, nama, nim, kelompok, link_tugas } = req.body;

        // Debug logging untuk tracking
        console.log("=== KUMPUL TUGAS DEBUG ===");
        console.log("Request body:", req.body);
        console.log("Kelompok value:", kelompok, "Type:", typeof kelompok);

        // 1. VALIDASI INPUT - Cek semua field required
        const requiredFields = { id_user, id_tugas, nama, nim, kelompok, link_tugas };
        const missingFields = [];

        for (const [key, value] of Object.entries(requiredFields)) {
            if (value === undefined || value === null || value === '') {
                missingFields.push(key);
            }
        }

        if (missingFields.length > 0) {
            console.log("Missing fields:", missingFields);
            return res.status(400).json({
                status: 400,
                message: `Field berikut wajib diisi: ${missingFields.join(', ')}`,
                missing_fields: missingFields
            });
        }

        // 2. KONVERSI TIPE DATA - Pastikan kelompok adalah integer
        const kelompokInt = parseInt(kelompok);
        if (isNaN(kelompokInt)) {
            console.log("Invalid kelompok format:", kelompok);
            return res.status(400).json({
                status: 400,
                message: "Kelompok harus berupa angka yang valid",
                received_kelompok: kelompok
            });
        }
        console.log("Kelompok converted:", kelompokInt);

        // 3. VALIDASI KELOMPOK EXISTS - Cek kelompok ada di database
        const existingKelompok = await prisma.Kelompok.findFirst({
            where: { 
                nomor: kelompokInt // ✅ FIXED: Gunakan 'nomor' sesuai schema
            }
        });

        if (!existingKelompok) {
            console.log("Kelompok not found:", kelompokInt);
            return res.status(404).json({
                status: 404,
                message: `Kelompok ${kelompokInt} tidak ditemukan atau tidak tersedia`,
                kelompok_searched: kelompokInt
            });
        }
        console.log("Kelompok found:", existingKelompok);

        // 4. Cek apakah user sudah pernah mengumpulkan tugas ini sebelumnya
        const existingSubmission = await prisma.Kumpul_Tugas.findFirst({
            where: {
                id_user,
                id_tugas
            }
        });

        if (existingSubmission) {
            console.log("Duplicate submission found:", existingSubmission.id);
            return res.status(409).json({
                status: 409,
                message: "Anda sudah pernah mengumpulkan tugas ini.",
                existing_submission_id: existingSubmission.id
            });
        }

        // 5. Ambil data tugas untuk cek deadline
        const tugas = await prisma.Tugas.findUnique({ 
            where: { id: id_tugas },
            select: { id: true, title: true, deadline: true } // ✅ FIXED: Gunakan 'title' sesuai schema
        });

        if (!tugas) {
            console.log("Tugas not found:", id_tugas);
            return res.status(404).json({
                status: 404,
                message: "Tugas tidak ditemukan.",
                tugas_id: id_tugas
            });
        }

        console.log("Tugas found:", tugas);

        // Cek deadline
        if (tugas.deadline && new Date() > new Date(tugas.deadline)) {
            console.log("Deadline passed. Current:", new Date(), "Deadline:", tugas.deadline);
            return res.status(400).json({
                status: 400,
                message: "Pengumpulan tugas sudah melewati deadline. Tidak dapat submit lagi.",
                deadline: tugas.deadline,
                current_time: new Date()
            });
        }

        // 6. Create data dengan kelompok yang sudah dikonversi
        const data = await prisma.Kumpul_Tugas.create({
            data: {
                id_user,
                id_tugas,
                nama: nama.trim(), // Trim whitespace
                nim: nim.trim(),
                kelompok: kelompokInt, // Gunakan integer
                link_tugas: link_tugas.trim(),
                createAt: new Date(), // ✅ FIXED: Gunakan 'createAt' sesuai schema
                updateAt: new Date()  // ✅ FIXED: Gunakan 'updateAt' sesuai schema
            }
        });

        console.log("Tugas berhasil dikumpulkan:", data);

        if (data) {
            return res.status(201).json({ // 201 untuk created
                status: 201,
                message: "Berhasil mengumpulkan tugas",
                data: {
                    ...data,
                    tugas_info: {
                        title: tugas.title, // ✅ FIXED: Gunakan 'title' sesuai schema
                        deadline: tugas.deadline
                    }
                }
            });
        } else {
            console.log("Create failed but no error thrown");
            return res.status(400).json({
                status: 400,
                message: "Gagal mengumpulkan tugas"
            });
        }

    } catch (error) {
        console.error("=== KUMPUL TUGAS ERROR ===");
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
        console.error("Request body:", req.body);
        
        // Handle specific Prisma errors
        if (error.code === 'P2002') {
            return res.status(409).json({
                status: 409,
                message: "Data duplikat: Kombinasi user dan tugas sudah ada",
                error_code: error.code
            });
        }
        
        if (error.code === 'P2003') {
            return res.status(400).json({
                status: 400,
                message: "Data referensi tidak valid (Foreign key constraint)",
                error_code: error.code
            });
        }

        return res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            error_message: error.message,
            timestamp: new Date()
        });
    }
};

exports.EditKumpulTugas = async (req, res) => {
    try {
        const { id, nama, nim, kelompok, link_tugas } = req.body;

        // Debug logging untuk tracking
        console.log("=== EDIT KUMPUL TUGAS DEBUG ===");
        console.log("Request body:", req.body);
        console.log("Kelompok value:", kelompok, "Type:", typeof kelompok);

        // 1. VALIDASI INPUT - Cek semua field required
        const requiredFields = { id, nama, nim, kelompok, link_tugas };
        const missingFields = [];

        for (const [key, value] of Object.entries(requiredFields)) {
            if (value === undefined || value === null || value === '') {
                missingFields.push(key);
            }
        }

        if (missingFields.length > 0) {
            console.log("Missing fields:", missingFields);
            return res.status(400).json({
                status: 400,
                message: `Field berikut wajib diisi: ${missingFields.join(', ')}`,
                missing_fields: missingFields
            });
        }

        // 2. KONVERSI TIPE DATA - Pastikan kelompok adalah integer
        const kelompokInt = parseInt(kelompok);
        if (isNaN(kelompokInt)) {
            console.log("Invalid kelompok format:", kelompok);
            return res.status(400).json({
                status: 400,
                message: "Kelompok harus berupa angka yang valid",
                received_kelompok: kelompok
            });
        }
        console.log("Kelompok converted:", kelompokInt);

        // 3. VALIDASI KELOMPOK EXISTS - Cek kelompok ada di database
        const existingKelompok = await prisma.Kelompok.findFirst({
            where: { 
                nomor: kelompokInt // ✅ FIXED: Gunakan 'nomor' sesuai schema
            }
        });

        if (!existingKelompok) {
            console.log("Kelompok not found:", kelompokInt);
            return res.status(404).json({
                status: 404,
                message: `Kelompok ${kelompokInt} tidak ditemukan atau tidak tersedia`,
                kelompok_searched: kelompokInt
            });
        }
        console.log("Kelompok found:", existingKelompok);

        // 4. Ambil data tugas untuk cek deadline
        const kumpulTugas = await prisma.Kumpul_Tugas.findUnique({ 
            where: { id },
            include: {
                // Jika ada relasi, uncomment ini
                // Tugas: { select: { id: true, judul: true, deadline: true } }
            }
        });

        if (!kumpulTugas) {
            console.log("Kumpul tugas not found:", id);
            return res.status(404).json({ 
                status: 404, 
                message: "Pengumpulan tugas tidak ditemukan.",
                submission_id: id
            });
        }

        const tugas = await prisma.Tugas.findUnique({ 
            where: { id: kumpulTugas.id_tugas },
            select: { id: true, title: true, deadline: true } // ✅ FIXED: Gunakan 'title' sesuai schema
        });

        if (!tugas) {
            console.log("Tugas not found:", kumpulTugas.id_tugas);
            return res.status(404).json({ 
                status: 404, 
                message: "Tugas tidak ditemukan.",
                tugas_id: kumpulTugas.id_tugas
            });
        }

        console.log("Tugas found:", tugas);

        // Cek deadline
        if (tugas.deadline && new Date() > new Date(tugas.deadline)) {
            console.log("Deadline passed. Current:", new Date(), "Deadline:", tugas.deadline);
            return res.status(400).json({ 
                status: 400, 
                message: "Sudah lewat deadline, tidak bisa edit tugas.",
                deadline: tugas.deadline,
                current_time: new Date()
            });
        }

        // 5. Update data dengan kelompok yang sudah dikonversi
        const data = await prisma.Kumpul_Tugas.update({
            where: { id },
            data: { 
                nama: nama.trim(),
                nim: nim.trim(),
                kelompok: kelompokInt, // Gunakan integer
                link_tugas: link_tugas.trim(),
                updateAt: new Date() // ✅ FIXED: Gunakan 'updateAt' sesuai schema
            }
        });

        console.log("Tugas berhasil diedit:", data);

        if (data) {
            return res.status(200).json({ 
                status: 200, 
                message: "Berhasil mengedit tugas", 
                data: {
                    ...data,
                    tugas_info: {
                        title: tugas.title, // ✅ FIXED: Gunakan 'title' sesuai schema
                        deadline: tugas.deadline
                    }
                }
            });
        } else {
            console.log("Update failed but no error thrown");
            return res.status(400).json({ 
                status: 400, 
                message: "Gagal mengedit tugas"
            });
        }

    } catch (error) {
        console.error("=== EDIT KUMPUL TUGAS ERROR ===");
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
        console.error("Request body:", req.body);
        
        // Handle specific Prisma errors
        if (error.code === 'P2002') {
            return res.status(409).json({
                status: 409,
                message: "Data duplikat: Kombinasi data sudah ada",
                error_code: error.code
            });
        }
        
        if (error.code === 'P2003') {
            return res.status(400).json({
                status: 400,
                message: "Data referensi tidak valid (Foreign key constraint)",
                error_code: error.code
            });
        }
        
        if (error.code === 'P2025') {
            return res.status(404).json({
                status: 404,
                message: "Data yang akan diupdate tidak ditemukan",
                error_code: error.code
            });
        }

        return res.status(500).json({ 
            status: 500, 
            message: "Internal Server Error", 
            error_message: error.message,
            timestamp: new Date()
        });
    }
};